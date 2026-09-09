// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const payment = new Payment(client);

// Configuração do Supabase
// Certifique-se de ter SUPABASE_URL e SUPABASE_KEY no seu arquivo .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- ROTAS DA APLICAÇÃO ---

// 1. Gerar Pagamento PIX
app.post('/api/pix', async (req, res) => {
  const { participantes, valorTotal } = req.body;
  if (!participantes || participantes.length === 0 || !valorTotal) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  try {
    const pagadorPrincipal = participantes[0]; 

    // Calcula a taxa do Mercado Pago (aprox. 0.99%) para garantir o valor líquido (ex: R$ 10,00)
    const taxaMP = 0.0099;
    const valorComTaxa = Number(valorTotal) / (1 - taxaMP);

    const requestOptions = {
      // Usa o valor com a taxa embutida formatado para 2 casas decimais
      transaction_amount: Number(valorComTaxa.toFixed(2)),
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
    const transacaoId = String(response.id);
    const valorRateado = valorTotal / participantes.length;

    // Salva os participantes DIRETAMENTE no Supabase com o status "pendente"
    const inscritosPendentes = participantes.map(p => ({
      transacao_id: transacaoId,
      nome: p.nome,
      cpf: p.cpf,
      whatsapp: p.whatsapp,
      valor: valorRateado,
      status: 'pendente'
    }));

    const { error: dbError } = await supabase.from('inscritos').insert(inscritosPendentes);
    
    if (dbError) {
      console.error('Erro ao salvar no Supabase:', dbError);
    }

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
  const transacaoId = String(req.params.id);

  try {
    const response = await payment.get({ id: transacaoId });
    const status = response.status;

    // Se aprovado, atualiza o status de todos os participantes com essa transação para "pago"
    if (status === 'approved') {
      const { error: updateError } = await supabase
        .from('inscritos')
        .update({ status: 'pago' })
        .eq('transacao_id', transacaoId)
        .eq('status', 'pendente'); // Garante que atualiza apenas o que estava pendente

      if (updateError) {
        console.error('Erro ao atualizar Supabase:', updateError);
      }
    }

    res.json({ status });
  } catch (error) {
    console.error('Erro ao consultar PIX:', error);
    res.status(500).json({ error: 'Erro ao consultar status.' });
  }
});

// 3. Salvar Teste (Sem pagar - Apenas para ambiente MODO_TESTE do Frontend)
app.post('/api/admin/salvar-teste', async (req, res) => {
  const { participantes, valorTotal } = req.body;
  
  if (!participantes || participantes.length === 0) {
    return res.status(400).json({ error: 'Participantes ausentes.' });
  }

  const valorRateado = valorTotal / participantes.length;
  const transacaoTesteId = 'teste_' + Date.now();

  const inscritosTeste = participantes.map(p => ({
    transacao_id: transacaoTesteId,
    nome: p.nome,
    cpf: p.cpf,
    whatsapp: p.whatsapp,
    valor: valorRateado,
    status: 'pago (teste)'
  }));

  const { error } = await supabase.from('inscritos').insert(inscritosTeste);

  if (error) {
    console.error('Erro ao salvar teste no Supabase:', error);
    return res.status(500).json({ error: 'Erro interno.' });
  }

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
app.get('/api/admin/inscritos', async (req, res) => {
  // Busca apenas os que realmente pagaram ou são testes aprovados, ordenando do mais recente pro mais antigo
  const { data: inscritos, error } = await supabase
    .from('inscritos')
    .select('*')
    .like('status', 'pago%')
    .order('data', { ascending: false });

  if (error) {
    console.error('Erro ao buscar inscritos:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados.' });
  }

  res.json(inscritos || []);
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});