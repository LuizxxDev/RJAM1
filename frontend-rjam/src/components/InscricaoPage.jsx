// src/components/InscricaoPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cpf as cpfValidator } from 'cpf-cnpj-validator'; // <-- Importando a biblioteca

const MODO_TESTE = false; 
const VALOR_INGRESSO = 10.00; 

export default function InscricaoPage() {
  const [quantidade, setQuantidade] = useState(1);
  const [participantes, setParticipantes] = useState([
    { nome: '', cpf: '', whatsapp: '' }
  ]);
  const [errosCpf, setErrosCpf] = useState(['']);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [statusPix, setStatusPix] = useState('aguardando'); 
  const [qrCodeData, setQrCodeData] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(600); 
  const [copiado, setCopiado] = useState(false);


  const alterarQuantidade = (novaQtd) => {
    if (novaQtd < 1) novaQtd = 1;
    if (novaQtd > 10) novaQtd = 10;
    setQuantidade(novaQtd);

    const novosParticipantes = [...participantes];
    const novosErros = [...errosCpf];

    while (novosParticipantes.length < novaQtd) {
      novosParticipantes.push({ nome: '', cpf: '', whatsapp: '' });
      novosErros.push('');
    }
    if (novosParticipantes.length > novaQtd) {
      novosParticipantes.length = novaQtd;
      novosErros.length = novaQtd;
    }

    setParticipantes(novosParticipantes);
    setErrosCpf(novosErros);
  };

  const handleCampoChange = (index, campo, valor) => {
    const novosParticipantes = [...participantes];
    novosParticipantes[index][campo] = valor;
    setParticipantes(novosParticipantes);
  };

  const handleCpfChange = (index, e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Máscara visual do CPF (mantida para a experiência do usuário)
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
    else if (value.length > 6) value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    else if (value.length > 3) value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
    
    handleCampoChange(index, 'cpf', value);

    const novosErros = [...errosCpf];
    // Validação usando a biblioteca cpf-cnpj-validator
    if (value.length === 14) {
      novosErros[index] = !cpfValidator.isValid(value) ? 'CPF inválido.' : '';
    } else {
      novosErros[index] = '';
    }
    setErrosCpf(novosErros);
  };

  const handleWhatsappChange = (index, e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = value.replace(/^(\d{2})(\d{4,5})(\d{4}).*/, '($1) $2-$3');
    else if (value.length > 0) value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    handleCampoChange(index, 'whatsapp', value);
  };

  const mascararCpfIngresso = (cpf) => {
    if (!cpf) return '';
    const limpo = cpf.replace(/\D/g, '');
    if (limpo.length !== 11) return cpf;
    return `${limpo.slice(0, 3)}.***.***-${limpo.slice(9, 11)}`;
  };

 
  const copiarCodigoPix = () => {
    if (qrCodeData?.qr_code) {
      navigator.clipboard.writeText(qrCodeData.qr_code)
        .then(() => {
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2500);
        });
    }
  };

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

  useEffect(() => {
    let intervalo, timerTeste;
    if (statusPix === 'gerado' && qrCodeData) {
      if (MODO_TESTE) {
        timerTeste = setTimeout(async () => {
          setStatusPix('pago');
          try {
            await fetch('https://rjam1-api.onrender.com/api/admin/salvar-teste', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                participantes: participantes,
                valorTotal: quantidade * VALOR_INGRESSO
              })
            });
          } catch (err) {}
        }, 5000);
      } else {
        intervalo = setInterval(async () => {
          try {
            const response = await fetch(`https://rjam1-api.onrender.com/api/pix/${qrCodeData.id_transacao}`);
            const data = await response.json();
            if (data.status === 'approved') {
              clearInterval(intervalo);
              setStatusPix('pago'); 
            }
          } catch (error) {}
        }, 5000);
      }
    }
    return () => { clearInterval(intervalo); clearTimeout(timerTeste); };
  }, [statusPix, qrCodeData, participantes, quantidade]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação usando a biblioteca antes de enviar
    const cpfsInvalidos = participantes.some(p => !cpfValidator.isValid(p.cpf));
    if (cpfsInvalidos) {
      alert('Por favor, corrija os CPFs inválidos antes de continuar.');
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
          participantes: participantes,
          valorTotal: quantidade * VALOR_INGRESSO
        })
      });

      const data = await response.json();
      if (response.ok) {
        setQrCodeData(data);
        setStatusPix('gerado');
        setModalAberto(true);
      } else {
        alert("Erro ao gerar pagamento no servidor.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
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
            <i className="fa-solid fa-arrow-left"></i> Voltar
          </Link>
        </div>

        <div className="text-center mb-10 print:hidden">
          <h2 className="font-serif text-3xl md:text-4xl text-accent-gold uppercase tracking-widest mb-4">Inscrição</h2>
          <p className="text-gray-400">Preencha os dados para emitir os ingressos.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-secondary-dark p-8 rounded-lg shadow-xl border border-gray-700 print:hidden">
          
          <div className="mb-8 pb-6 border-b border-gray-700 flex items-center justify-between">
            <label className="text-gray-300 font-bold text-lg">Quantidade de Ingressos:</label>
            <div className="flex items-center gap-3 bg-primary-dark border border-gray-600 rounded-lg p-1">
              <button 
                type="button" 
                onClick={() => alterarQuantidade(quantidade - 1)}
                disabled={quantidade <= 1}
                className="w-10 h-10 flex items-center justify-center text-accent-gold hover:bg-secondary-dark rounded disabled:opacity-30 transition-colors"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              
              <span className="text-white font-black text-xl w-6 text-center select-none">
                {quantidade}
              </span>
              
              <button 
                type="button" 
                onClick={() => alterarQuantidade(quantidade + 1)}
                disabled={quantidade >= 10}
                className="w-10 h-10 flex items-center justify-center text-accent-gold hover:bg-secondary-dark rounded disabled:opacity-30 transition-colors"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {participantes.map((participante, index) => (
              <div key={index} className="bg-primary-dark/40 p-4 rounded border border-gray-700 relative">
                <div className="absolute -top-3 left-4 bg-secondary-dark px-2 text-xs font-bold text-accent-gold border border-gray-700 rounded">
                  PARTICIPANTE {index + 1}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-xs font-bold mb-1">Nome Completo</label>
                    <input type="text" value={participante.nome} onChange={(e) => handleCampoChange(index, 'nome', e.target.value)} required className="w-full bg-primary-dark border border-gray-600 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-gold" />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-xs font-bold mb-1">CPF</label>
                    <input type="text" value={participante.cpf} onChange={(e) => handleCpfChange(index, e)} required placeholder="000.000.000-00" className={`w-full bg-primary-dark border ${errosCpf[index] ? 'border-red-500' : 'border-gray-600'} text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-gold`} />
                    {errosCpf[index] && <p className="text-red-500 text-xs mt-1">{errosCpf[index]}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-bold mb-1">WhatsApp</label>
                    <input type="text" value={participante.whatsapp} onChange={(e) => handleWhatsappChange(index, e)} required placeholder="(00) 00000-0000" className="w-full bg-primary-dark border border-gray-600 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-gold" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center mb-6">
            <span className="text-gray-300 font-bold text-lg">Total:</span>
            <span className="text-2xl font-black text-accent-gold">
              R$ {(quantidade * VALOR_INGRESSO).toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button type="submit" disabled={carregando} className="w-full bg-gradient-to-r from-accent-gold to-yellow-600 text-primary-dark font-black py-4 rounded-md text-lg uppercase tracking-wider btn-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50">
            {carregando ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</> : `Gerar PIX`}
          </button>
        </form>
      </div>

      {/* Modal PIX / Sucesso */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static print:block">
          <div className="bg-secondary-dark border border-accent-gold rounded-lg p-6 sm:p-8 max-w-lg w-full text-center relative shadow-2xl print:bg-primary-dark print:border-none print:shadow-none print:p-0 print:max-w-none my-8 sm:my-auto">
            
            <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white print:hidden">
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            
            {statusPix === 'gerado' && qrCodeData && (
              <div className="print:hidden">
                <h4 className="font-serif text-2xl text-accent-gold mb-2">Pagamento PIX</h4>
                <div className="mb-4 bg-primary-dark/60 py-2 px-4 rounded border border-gray-700 inline-block">
                  <p className="text-xs text-gray-400">Expira em: <span className="text-accent-gold font-mono font-bold text-lg ml-2">{formatarTempo(tempoRestante)}</span></p>
                </div>
                <div className="flex flex-col items-center">
                  <img src={`data:image/jpeg;base64,${qrCodeData.qr_code_base64}`} alt="QR" className="w-48 h-48 mb-4 border-4 border-white rounded" />
                  <p className="text-sm text-gray-400 mb-2">Ou copie o código:</p>
                  <input type="text" readOnly value={qrCodeData.qr_code} className="w-full bg-primary-dark border border-gray-600 text-gray-300 text-xs rounded px-3 py-2 mb-3 cursor-text select-all" />
                  <button onClick={copiarCodigoPix} className={`w-full py-2.5 px-4 rounded-md font-bold text-sm flex items-center justify-center gap-2 mb-4 ${copiado ? 'bg-green-600 text-white' : 'bg-accent-gold text-primary-dark'}`}>
                    {copiado ? <><i className="fa-solid fa-check"></i> Copiado!</> : <><i className="fa-regular fa-copy"></i> Copiar Código</>}
                  </button>
                  <p className="text-yellow-500 font-bold text-sm"><i className="fa-solid fa-circle-notch fa-spin mr-2"></i>Aguardando pagamento...</p>
                </div>
              </div>
            )}

            {statusPix === 'pago' && (
              <div className="py-2">
                <div className="flex items-center justify-center gap-2 text-green-500 mb-6 print:hidden">
                  <i className="fa-solid fa-circle-check text-3xl"></i>
                  <h4 className="font-serif text-2xl font-bold">Inscrições Confirmadas!</h4>
                </div>
                
                {/* Rendereiza um ingresso para cada participante na mesma tela */}
                <div id="ingresso-imprimir" className="space-y-6">
                  {participantes.map((p, idx) => (
                    <div key={idx} className="bg-primary-dark border-2 border-accent-gold rounded-lg p-6 text-left relative overflow-hidden print:border-4 print:mb-8 print:break-inside-avoid">
                      <div className="absolute -right-6 -bottom-6 text-accent-gold/10 text-9xl pointer-events-none">
                        <i className="fa-solid fa-gem"></i>
                      </div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs text-accent-gold font-bold tracking-widest uppercase">Conferência</span>
                          <h3 className="font-serif text-2xl font-black text-white">RJAM1</h3>
                        </div>
                        <span className="bg-accent-gold/20 text-accent-gold text-xs px-2.5 py-1 rounded font-bold uppercase">Ingresso {idx + 1}/{quantidade}</span>
                      </div>

                      <div className="space-y-2 border-t border-gray-700 pt-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase">Participante</p>
                          <p className="font-bold text-lg text-white">{p.nome}</p>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-gray-400 uppercase">CPF (Protegido)</p>
                            <p className="text-sm text-gray-200 font-mono">{mascararCpfIngresso(p.cpf)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase">Data</p>
                            <p className="text-sm text-gray-200">09 e 10 Out / 2026</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden">
                  <button onClick={() => window.print()} className="flex-1 bg-gradient-to-r from-accent-gold to-yellow-600 text-primary-dark font-bold py-3 rounded-md uppercase tracking-wider text-sm btn-glow flex items-center justify-center gap-2">
                    <i className="fa-solid fa-print"></i> Salvar / Imprimir
                  </button>
                  <Link to="/" className="bg-gray-700 text-gray-300 hover:text-white px-6 py-3 rounded-md text-sm font-bold flex items-center justify-center">
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