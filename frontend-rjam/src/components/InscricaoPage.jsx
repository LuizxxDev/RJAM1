// src/components/InscricaoPage.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mude para false quando for testar com o pagamento real do banco
const MODO_TESTE = false; 

export default function InscricaoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    whatsapp: '',
    email: ''
  });
  
  const [modalAberto, setModalAberto] = useState(false);
  const [statusPix, setStatusPix] = useState('aguardando'); // 'aguardando', 'gerado', 'pago', 'expirado'
  const [qrCodeData, setQrCodeData] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erroCpf, setErroCpf] = useState('');
  const [tempoRestante, setTempoRestante] = useState(600); // 10 minutos
  const [copiado, setCopiado] = useState(false); // Estado para o feedback do botão de copiar

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = 11 - (soma % 11);
    let digito1 = resto === 10 || resto === 11 ? 0 : resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    let digito2 = resto === 10 || resto === 11 ? 0 : resto;
    return digito2 === parseInt(cpf.charAt(10));
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
    else if (value.length > 6) value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    else if (value.length > 3) value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
    setFormData({ ...formData, cpf: value });

    if (value.length === 14) {
      setErroCpf(!validarCPF(value) ? 'CPF inválido. Verifique os números.' : '');
    } else {
      setErroCpf('');
    }
  };

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

  const mascararCpfIngresso = (cpf) => {
    if (!cpf) return '';
    const limpo = cpf.replace(/\D/g, '');
    if (limpo.length !== 11) return cpf;
    return `${limpo.slice(0, 3)}.***.***-${limpo.slice(9, 11)}`;
  };

  // Função para copiar o código Pix Copia e Cola com feedback visual
  const copiarCodigoPix = () => {
    if (qrCodeData?.qr_code) {
      navigator.clipboard.writeText(qrCodeData.qr_code)
        .then(() => {
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2500); // Reseta o botão após 2.5 segundos
        })
        .catch((err) => {
          console.error("Erro ao copiar o código Pix: ", err);
        });
    }
  };

  // Temporizador de Expiração do PIX
  useEffect(() => {
    let timer;
    if (modalAberto && statusPix === 'gerado' && tempoRestante > 0) {
      timer = setInterval(() => {
        setTempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStatusPix('expirado');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [modalAberto, statusPix, tempoRestante]);

  // GERENCIAMENTO DO STATUS (MODO TESTE OU MODO REAL)
  useEffect(() => {
    let intervalo;
    let timerTeste;

    if (statusPix === 'gerado' && qrCodeData) {
      if (MODO_TESTE) {
        // Simula a aprovação em exatos 5 segundos
        timerTeste = setTimeout(async () => {
          setStatusPix('pago');
          
          // SALVA NO JSON AUTOMATICAMENTE NO MODO TESTE
          try {
            await fetch('https://rjam1-api.onrender.com/api/admin/salvar-teste', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nome: formData.nome,
                email: formData.email,
                cpf: formData.cpf,
                valor: 10.00
              })
            });
          } catch (err) {
            console.error("Erro ao registrar teste no backend:", err);
          }

        }, 5000);
      } else {
        // Consulta real na API a cada 5 segundos
        intervalo = setInterval(async () => {
          try {
            const response = await fetch(`https://rjam1-api.onrender.com/api/pix/${qrCodeData.id_transacao}`);
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
  }, [statusPix, qrCodeData, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCPF(formData.cpf)) {
      setErroCpf('Por favor, informe um CPF válido antes de continuar.');
      return;
    }

    setCarregando(true);
    setTempoRestante(600);
    setCopiado(false);

    try {
      const response = await fetch('https://rjam1-api.onrender.com/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          email: formData.email,
          valor: 10.00
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setQrCodeData(data);
        setStatusPix('gerado');
        setModalAberto(true); // Abre o modal apenas após receber os dados com sucesso
      } else {
        alert("Erro ao gerar pagamento no servidor.");
      }
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const lidarComImpressao = () => {
    window.print();
  };

  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-primary-dark text-text-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 print:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-accent-gold hover:underline text-sm font-bold">
            <i className="fa-solid fa-arrow-left"></i> Voltar para a Página Inicial
          </Link>
        </div>

        <div className="text-center mb-10 print:hidden">
          <h2 className="font-serif text-3xl md:text-4xl text-accent-gold uppercase tracking-widest mb-4">Inscrição Conferência</h2>
          <p className="text-gray-400">Preencha seus dados para emitir o ingresso de participação.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-secondary-dark p-8 rounded-lg shadow-xl border border-gray-700 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="w-full bg-primary-dark border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:border-accent-gold" />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">CPF</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleCpfChange} required placeholder="000.000.000-00" className={`w-full bg-primary-dark border ${erroCpf ? 'border-red-500' : 'border-gray-600'} text-white rounded px-4 py-2 focus:outline-none focus:border-accent-gold`} />
              {erroCpf && <p className="text-red-500 text-xs mt-1 font-semibold">{erroCpf}</p>}
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

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full mt-8 bg-gradient-to-r from-accent-gold to-yellow-600 text-primary-dark font-black py-4 rounded-md text-lg uppercase tracking-wider btn-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {carregando ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i> Processando...
              </>
            ) : (
              'Gerar Pagamento (R$ 10,00)'
            )}
          </button>
        </form>
      </div>

      {/* MODAL DO PIX / INGRESSO DIGITAL */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:p-0 print:bg-white print:static">
          <div className="bg-secondary-dark border border-accent-gold rounded-lg p-8 max-w-lg w-full text-center relative shadow-2xl print:bg-primary-dark print:border-none print:shadow-none print:p-0 print:max-w-none">
            
            <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white print:hidden">
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
                <h4 className="font-serif text-2xl text-accent-gold mb-2">Pagamento PIX</h4>
                <div className="mb-4 bg-primary-dark/60 py-2 px-4 rounded border border-gray-700 inline-block">
                  <p className="text-xs text-gray-400">Expira em:</p>
                  <p className="text-accent-gold font-mono font-bold text-lg">{formatarTempo(tempoRestante)}</p>
                </div>

                <div className="flex flex-col items-center">
                  <img src={`data:image/jpeg;base64,${qrCodeData.qr_code_base64}`} alt="QR Code PIX" className="w-48 h-48 mb-4 border-4 border-white rounded" />
                  <p className="text-sm text-gray-400 mb-2">Ou copie o código abaixo:</p>
                  
                  <input type="text" readOnly value={qrCodeData.qr_code} className="w-full bg-primary-dark border border-gray-600 text-gray-300 text-xs rounded px-3 py-2 mb-3 cursor-text select-all" />
                  
                  {/* Botão de Copiar com Feedback Visual */}
                  <button
                    type="button"
                    onClick={copiarCodigoPix}
                    className={`w-full py-2.5 px-4 rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2 mb-4 ${
                      copiado 
                        ? 'bg-green-600 text-white' 
                        : 'bg-accent-gold text-primary-dark hover:bg-yellow-500'
                    }`}
                  >
                    {copiado ? (
                      <>
                        <i className="fa-solid fa-check"></i> Código Copiado!
                      </>
                    ) : (
                      <>
                        <i className="fa-regular fa-copy"></i> Copiar Código Pix
                      </>
                    )}
                  </button>

                  <p className="text-yellow-500 font-bold flex items-center justify-center gap-2 mt-1">
                    <i className="fa-solid fa-circle-notch fa-spin"></i> {MODO_TESTE ? "Modo Teste: Aprovando em 5 segundos..." : "Aguardando confirmação do pagamento..."}
                  </p>
                </div>
              </div>
            )}

            {statusPix === 'expirado' && (
              <div className="py-10">
                <i className="fa-solid fa-triangle-exclamation text-5xl text-yellow-500 mb-4"></i>
                <h4 className="font-serif text-2xl text-white mb-2">PIX Expirado</h4>
                <p className="text-gray-400 text-sm mb-6">O tempo limite para pagamento expirou.</p>
                <button onClick={() => setModalAberto(false)} className="bg-accent-gold text-primary-dark font-bold px-6 py-2 rounded">
                  Tentar Novamente
                </button>
              </div>
            )}

            {statusPix === 'pago' && (
              <div className="py-4 print:py-0">
                <div className="flex items-center justify-center gap-2 text-green-500 mb-2 print:hidden">
                  <i className="fa-solid fa-circle-check text-3xl"></i>
                  <h4 className="font-serif text-2xl font-bold">Inscrição Confirmada!</h4>
                </div>
                <p className="text-gray-300 text-sm mb-6 print:hidden">Obrigado por participar. Seu ingresso digital está pronto.</p>

                {/* O INGRESSO DIGITAL */}
                <div id="ingresso-imprimir" className="bg-primary-dark border-2 border-accent-gold rounded-lg p-6 text-left relative overflow-hidden mb-6 print:border-4 print:shadow-none print:m-0">
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
                        <p className="text-xs text-gray-400 uppercase">CPF (Protegido)</p>
                        <p className="text-sm text-gray-200 font-mono">{mascararCpfIngresso(formData.cpf)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Data</p>
                        <p className="text-sm text-gray-200">09 e 10 Out / 2026</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4 print:hidden">
                  <button onClick={lidarComImpressao} className="flex-1 bg-gradient-to-r from-accent-gold to-yellow-600 text-primary-dark font-bold py-3 rounded-md uppercase tracking-wider text-sm btn-glow flex items-center justify-center gap-2">
                    <i className="fa-solid fa-print"></i> Salvar / Imprimir Ingresso
                  </button>
                  <Link to="/" className="bg-gray-700 text-gray-300 hover:text-white px-4 py-3 rounded-md text-sm font-bold flex items-center justify-center">
                    Concluir
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}