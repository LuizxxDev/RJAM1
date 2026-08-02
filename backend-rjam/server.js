require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa o cliente do Mercado Pago com o token do arquivo .env
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Caminho para o arquivo JSON onde os inscritos aprovados serão salvos
const ARQUIVO_INSCRITOS = path.join(__dirname, 'inscritos.json');

// Função auxiliar para ler o JSON de inscritos
const lerInscritos = () => {
    if (!fs.existsSync(ARQUIVO_INSCRITOS)) return [];
    try {
        const dados = fs.readFileSync(ARQUIVO_INSCRITOS, 'utf8');
        return JSON.parse(dados);
    } catch (error) {
        return [];
    }
};

// Função auxiliar para salvar um inscrito aprovado no JSON (evita duplicatas)
const salvarInscrito = (novoInscrito) => {
    const inscritos = lerInscritos();
    if (!inscritos.some(i => i.id === novoInscrito.id)) {
        inscritos.push(novoInscrito);
        fs.writeFileSync(ARQUIVO_INSCRITOS, JSON.stringify(inscritos, null, 2), 'utf8');
    }
};

// Rota para gerar o PIX
app.post('/api/pix', async (req, res) => {
    try {
        const { nome, cpf, email, valor } = req.body;

        const payment = new Payment(client);
        
        const body = {
            transaction_amount: Number(valor),
            description: 'Ingresso Conferência RJAM1',
            payment_method_id: 'pix',
            payer: {
                email: email,
                first_name: nome,
                identification: {
                    type: 'CPF',
                    number: cpf.replace(/\D/g, '') // Remove pontuações do CPF
                }
            }
        };

        const response = await payment.create({ body });

        // Retorna o QR Code em Base64 e o código "Copia e Cola"
        res.status(200).json({
            id_transacao: response.id,
            status: response.status,
            qr_code: response.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64
        });

    } catch (error) {
        console.error("Erro ao gerar PIX:", error);
        res.status(500).json({ error: "Falha ao gerar o pagamento PIX." });
    }
});

// Rota para consultar o status do PIX (Short Polling) e salvar no JSON se aprovado
app.get('/api/pix/:id_transacao', async (req, res) => {
    try {
        const payment = new Payment(client);
        
        // Pede as informações do pagamento específico para o Mercado Pago
        const response = await payment.get({ id: req.params.id_transacao });

        // Se o pagamento foi aprovado, salva automaticamente no arquivo JSON local
        if (response.status === 'approved') {
            const dadosInscricao = {
                id: response.id,
                nome: response.additional_info?.payer?.first_name || response.payer?.first_name || req.query.nome || 'Participante',
                email: response.payer?.email || 'Não informado',
                cpf: response.payer?.identification?.number || 'Não informado',
                valor: response.transaction_amount,
                data: new Date().toISOString()
            };
            salvarInscrito(dadosInscricao);
        }

        // Retorna o status (ex: 'pending', 'approved', 'rejected')
        res.status(200).json({ status: response.status });
    } catch (error) {
        console.error("Erro ao verificar status do PIX:", error);
        res.status(500).json({ error: "Falha ao verificar status." });
    }
});

// Rota para o Painel Adminf buscar apenas os aprovados salvos no JSON
app.get('/api/admin/inscritos', (req, res) => {
    try {
        const inscritos = lerInscritos();
        res.status(200).json(inscritos);
    } catch (error) {
        console.error("Erro ao carregar lista do arquivo JSON:", error);
        res.status(500).json({ error: "Erro ao carregar lista de inscritos." });
    }
});

// Rota para salvar um inscrito de forma manual/teste quando o MODO_TESTE estiver ativo
app.post('/api/admin/salvar-teste', (req, res) => {
    try {
        const { nome, email, cpf, valor } = req.body;
        const dadosInscricao = {
            id: 'teste_' + Date.now(), // ID fictício único para o teste
            nome: nome || 'Participante Teste',
            email: email || 'teste@email.com',
            cpf: cpf || '000.000.000-00',
            valor: valor || 0.10,
            data: new Date().toISOString()
        };
        salvarInscrito(dadosInscricao);
        res.status(200).json({ success: true, message: 'Inscrição de teste salva com sucesso!' });
    } catch (error) {
        console.error("Erro ao salvar teste:", error);
        res.status(500).json({ error: "Erro ao salvar teste." });
    }
});

// Rota de Login para o Painel Admin
app.post('/api/admin/login', (req, res) => {
    const { usuario, senha } = req.body;

    // Compara com as credenciais definidas no arquivo .env
    const usuarioValido = process.env.ADMIN_USER || 'admin';
    const senhaValida = process.env.ADMIN_PASS || '123456';

    if (usuario === usuarioValido && senha === senhaValida) {
        res.status(200).json({ success: true, message: 'Autenticado com sucesso!' });
    } else {
        res.status(401).json({ success: false, message: 'Usuário ou senha incorretos.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀`);
});