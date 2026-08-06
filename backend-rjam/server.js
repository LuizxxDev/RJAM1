// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const payment = new Payment(client);

// Caminho do banco de dados local
const DB_FILE = path.join(__dirname, 'inscritos.json');

// --- FUNÇÕES AUXILIARES ---
const lerInscritos = () => {
  if (!fs.existsSync(DB_FILE)) return [];
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
};

const salvarInscritos = (inscritos) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(inscritos, null, 2));
};

// --- MEMÓRIA TEMPORÁRIA DE PAGAMENTOS ---
// Guarda os participantes de cada PIX gerado enquanto aguarda a aprovação
const transacoesPendentes = {};

// --- ROTAS DA APLICAÇÃO ---

// 1. Gerar Pagamento PIX
app.post('/api/pix', async (req, res) => {
  const { participantes, valorTotal } = req.body;

  if (!participantes || participantes.length === 0 || !valorTotal) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  try {
    // Usamos os dados do primeiro participante apenas para preencher o pagador no MP
    const pagadorPrincipal = participantes[0]; 

    const requestOptions = {
      transaction_amount: Number(valorTotal),
      description: `Inscrição RJAM1 - ${participantes.length} ingresso(s)`,
      payment_method_id: 'pix',
      payer: {
        email: 'contato@rjam1.com.br', // E-mail genérico (obrigatório pro MP)
        first_name: pagadorPrincipal.nome,
        identification: {
          type: 'CPF',
          number: pagadorPrincipal.cpf.replace(/\D/g, '')
        }
      }
    };

    const response = await payment.create({ body: requestOptions });
    const transacaoId = response.id;

    // Salva na memória os participantes e o valor rateado
    transacoesPendentes[transacaoId] = {
      participantes: participantes,
      valorTotal: valorTotal
    };

    res.json({
      id_transacao: transacaoId,
      qr_code: response.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    res.status(500).json({ error: 'Erro ao gerar pagamento PIX.' });
  }
});

// 2. Consultar Status do Pagamento (Polling)
app.get('/api/pix/:id', async (req, res) => {
  const transacaoId = req.params.id;

  try {
    const response = await payment.get({ id: transacaoId });
    const status = response.status;

    // Se aprovado e a transação existir na nossa memória temporária
    if (status === 'approved' && transacoesPendentes[transacaoId]) {
      const dadosTransacao = transacoesPendentes[transacaoId];
      const inscritos = lerInscritos();

      // Divide o valor total pela quantidade de participantes para o relatório
      const valorRateado = dadosTransacao.valorTotal / dadosTransacao.participantes.length;

      dadosTransacao.participantes.forEach(p => {
        // Verifica se já não foi salvo acidentalmente no polling anterior
        const jaExiste = inscritos.find(i => i.cpf === p.cpf && i.transacaoId === transacaoId);
        
        if (!jaExiste) {
          inscritos.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            transacaoId: transacaoId,
            nome: p.nome,
            cpf: p.cpf,
            whatsapp: p.whatsapp,
            valor: valorRateado,
            status: 'pago',
            data: new Date().toISOString()
          });
        }
      });

      salvarInscritos(inscritos);
      
      // Limpa da memória para não salvar de novo
      delete transacoesPendentes[transacaoId]; 
    }

    res.json({ status });

  } catch (error) {
    console.error('Erro ao consultar PIX:', error);
    res.status(500).json({ error: 'Erro ao consultar status.' });
  }
});

// 3. Salvar Teste (Sem pagar - Apenas para ambiente MODO_TESTE do Frontend)
app.post('/api/admin/salvar-teste', (req, res) => {
  const { participantes, valorTotal } = req.body;

  if (!participantes || participantes.length === 0) {
    return res.status(400).json({ error: 'Participantes ausentes.' });
  }

  const inscritos = lerInscritos();
  const valorRateado = valorTotal / participantes.length;
  const transacaoTesteId = 'teste_' + Date.now();

  participantes.forEach(p => {
    inscritos.push({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      transacaoId: transacaoTesteId,
      nome: p.nome,
      cpf: p.cpf,
      whatsapp: p.whatsapp,
      valor: valorRateado,
      status: 'pago (teste)',
      data: new Date().toISOString()
    });
  });

  salvarInscritos(inscritos);
  res.json({ success: true });
});

// 4. Login do Painel Administrativo
app.post('/api/admin/login', (req, res) => {
  const { usuario, senha } = req.body;
  
  if (usuario === process.env.ADMIN_USER && senha === process.env.ADMIN_PASS) {
    res.json({ success: true, message: 'Autorizado' });
  } else {
    res.status(401).json({ success: false, message: 'Usuário ou senha incorretos' });
  }
});

// 5. Obter lista de Inscritos (Painel Admin)
app.get('/api/admin/inscritos', (req, res) => {
  const inscritos = lerInscritos();
  res.json(inscritos);
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});