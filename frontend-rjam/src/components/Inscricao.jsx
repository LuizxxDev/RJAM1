// src/components/Inscricao.jsx
import { useState, useRef, useEffect } from 'react';

export default function Inscricao() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    whatsapp: '',
    email: ''
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [statusPix, setStatusPix] = useState('aguardando'); 
  const [qrCodeData, setQrCodeData] = useState(null);
  
  const pdfGerado = useRef(false);

  // Máscara de CPF
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 9) value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
    else if (value.length > 6) value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    else if (value.length > 3) value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
    
    setFormData({ ...formData, cpf: value });
  };

  // Máscara de WhatsApp
  const handleWhatsappChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) value = value.replace(/^(\d{2})(\d{4,5})(\d{4}).*/, '($1) $2-$3');
    else if (value.length > 0) value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    
    setFormData({ ...formData, whatsapp: value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sistema de Short Polling para verificar o pagamento
  useEffect(() => {
    let intervalo;
    let timerTeste;

    if (statusPix === 'gerado' && qrCodeData?.id_transacao) {
      
      // SE O MODO TESTE ESTIVER LIGADO, APROVA SOZINHO EM 5 SEGUNDOS
      if (MODO_TESTE) {
        timerTeste = setTimeout(() => {
          setStatusPix('pago');
        }, 5000);
      } else {
        // MODO REAL: Fica perguntando ao backend a cada 5 segundos
        intervalo = setInterval(async () => {
          try {
            const response = await fetch(`http://localhost:3000/api/pix/${qrCodeData.id_transacao}`);
            const data = await response.json();
            
            if (data.status === 'approved') {
              clearInterval(intervalo);
              setStatusPix('pago'); 
            }
          } catch (error) {
            console.error("Erro no polling:", error);
          }
        }, 5000); 
      }
    }

    return () => {
      clearInterval(intervalo);
      clearTimeout(timerTeste);
    };
  }, [statusPix, qrCodeData]);

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    pdfGerado.current = false;
    setModalAberto(true);
    setStatusPix('aguardando');

    try {
      const response = await fetch('http://localhost:3000/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          email: formData.email,
          valor: 0.10 // VALOR DE TESTE
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setQrCodeData(data);
        setStatusPix('gerado');
      }
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      alert("Erro ao conectar com o servidor.");
      setModalAberto(false);
    }
  };

  // Função nativa para imprimir ou salvar PDF
  const lidarComImpressao = () => {
    window.print();
  };

  return (
    <section id="inscricao-futura" className="py-20 bg-primary-dark border-t border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="font-serif text-3xl text-accent-gold uppercase tracking-widest mb-4">Garanta sua Vaga</h3>
          <p className="text-gray-400">Preencha os dados abaixo para gerar o seu PIX e emitir o ingresso.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-secondary-dark p-8 rounded-lg shadow-xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="w-full bg-primary-dark border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:border-accent-gold" />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">CPF</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleCpfChange} required placeholder="000.000.000-00" className="w-full bg-primary-dark border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:border-accent-gold" />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">WhatsApp</label>
              <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleWhatsappChange} required placeholder="(00) 00000-0000" className="w-full bg-primary-dark border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:border-accent-gold" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-primary-dark border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:border-accent-gold" />
            </div>
          </div>

          <button type="submit" className="w-full mt-8 bg-gradient-to-r from-accent-gold to-yellow-600 text-primary-dark font-black py-4 rounded-md text-lg uppercase tracking-wider btn-glow hover:scale-[1.02] transition-transform">
            Gerar Pagamento (R$ 0,10)
          </button>
        </form>
      </div>

      {/* MODAL DO PIX / INGRESSO DIGITAL */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-secondary-dark border border-accent-gold rounded-lg p-8 max-w-lg w-full text-center relative shadow-2xl">
            
            {/* Botão de Fechar */}
            <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            
            {statusPix === 'aguardando' && (
              <div className="py-10">
                <h4 className="font-serif text-2xl text-accent-gold mb-6">Pagamento PIX</h4>
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-accent-gold mb-4"></i>
                <p className="text-gray-300">Conectando ao banco...</p>
              </div>
            )}

            {statusPix === 'gerado' && qrCodeData && (
              <div>
                <h4 className="font-serif text-2xl text-accent-gold mb-6">Pagamento PIX</h4>
                <div className="flex flex-col items-center">
                  <img src={`data:image/jpeg;base64,${qrCodeData.qr_code_base64}`} alt="QR Code PIX" className="w-48 h-48 mb-4 border-4 border-white rounded" />
                  <p className="text-sm text-gray-400 mb-2">Ou copie o código abaixo:</p>
                  <input type="text" readOnly value={qrCodeData.qr_code} className="w-full bg-primary-dark border border-gray-600 text-gray-300 text-xs rounded px-3 py-2 mb-4 cursor-text select-all" />
                  <p className="text-yellow-500 font-bold flex items-center justify-center gap-2 mt-2">
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Aguardando confirmação do pagamento...
                  </p>
                </div>
              </div>
            )}

            {statusPix === 'pago' && (
              <div className="py-4">
                <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
                  <i className="fa-solid fa-circle-check text-3xl"></i>
                  <h4 className="font-serif text-2xl font-bold">Inscrição Confirmada!</h4>
                </div>
                <p className="text-gray-300 text-sm mb-6">Obrigado por participar. Seu ingresso digital está pronto.</p>

                {/* O INGRESSO DIGITAL EXIBIDO NA TELA */}
                <div className="bg-primary-dark border-2 border-accent-gold rounded-lg p-6 text-left relative overflow-hidden mb-6">
                  <div className="absolute -right-6 -bottom-6 text-accent-gold/10 text-9xl pointer-events-none">
                    <i className="fa-solid fa-fire"></i>
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs text-accent-gold font-bold tracking-widest uppercase">Conferência</span>
                      <h3 className="font-serif text-2xl font-black text-white">RJAM1</h3>
                    </div>
                    <span className="bg-accent-gold/20 text-accent-gold text-xs px-2.5 py-1 rounded font-bold uppercase">Pago</span>
                  </div>

                  <div className="space-y-2 border-t border-gray-700 pt-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Participante</p>
                      <p className="font-bold text-lg text-white">{formData.nome}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-gray-400 uppercase">CPF</p>
                        <p className="text-sm text-gray-200">{formData.cpf}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Data</p>
                        <p className="text-sm text-gray-200">09 e 10 Out / 2026</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4">
                  <button onClick={lidarComImpressao} className="flex-1 bg-gradient-to-r from-accent-gold to-yellow-600 text-primary-dark font-bold py-3 rounded-md uppercase tracking-wider text-sm btn-glow flex items-center justify-center gap-2">
                    <i className="fa-solid fa-print"></i> Salvar / Imprimir Ingresso
                  </button>
                  <button onClick={() => { setModalAberto(false); setFormData({ nome: '', cpf: '', whatsapp: '', email: '' }); }} className="bg-gray-700 text-gray-300 hover:text-white px-4 py-3 rounded-md text-sm font-bold">
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}