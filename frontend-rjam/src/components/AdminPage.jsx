// src/components/AdminPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');
  const [carregandoLogin, setCarregandoLogin] = useState(false);

  const [inscritos, setInscritos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Verifica se já estava logado anteriormente no navegador
  useEffect(() => {
    const jaLogado = localStorage.getItem('admin_logado');
    if (jaLogado === 'true') {
      setAutenticado(true);
    }
  }, []);

  // Busca a lista de inscritos quando autenticado
  useEffect(() => {
    if (autenticado) {
      carregarInscritos();
    }
  }, [autenticado]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregandoLogin(true);
    setErroLogin('');

    // Remove espaços vazios acidentais que o teclado do celular possa ter colocado
    const usuarioFormatado = usuario.trim();
    const senhaFormatada = senha.trim();

    try {
      const response = await fetch('https://rjam1-api.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuarioFormatado, senha: senhaFormatada })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAutenticado(true);
        localStorage.setItem('admin_logado', 'true');
      } else {
        setErroLogin(data.message || 'Credenciais inválidas.');
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErroLogin('Erro de conexão com o servidor.');
    } finally {
      setCarregandoLogin(false);
    }
  };

  const handleLogout = () => {
    setAutenticado(false);
    localStorage.removeItem('admin_logado');
    setUsuario('');
    setSenha('');
  };

  const carregarInscritos = async () => {
    try {
      setCarregando(true);
      const response = await fetch('https://rjam1-api.onrender.com/api/admin/inscritos');
      const data = await response.json();
      if (response.ok) {
        setInscritos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar inscritos:", error);
    } finally {
      setCarregando(false);
    }
  };

  const inscritosFiltrados = inscritos.filter((inscrito) =>
    inscrito.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (inscrito.email && inscrito.email.toLowerCase().includes(busca.toLowerCase()))
  );

  // SE NÃO ESTIVER LOGADO, MOSTRA A TELA DE LOGIN
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-primary-dark text-text-light flex items-center justify-center px-4">
        <div className="bg-secondary-dark border border-gray-700 p-8 rounded-lg shadow-2xl max-w-md w-full">
          <div className="text-center mb-6">
            <span className="text-xs text-accent-gold font-bold tracking-widest uppercase">Área Restrita</span>
            <h1 className="font-serif text-2xl text-white font-bold mt-1">Painel Administrativo</h1>
          </div>

          {erroLogin && (
            <div className="mb-4 bg-red-500/10 border border-red-500 text-red-400 text-sm p-3 rounded text-center">
              {erroLogin}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-1">Usuário</label>
              <input 
                type="text" 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                className="w-full bg-primary-dark border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:border-accent-gold"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-1">Senha</label>
              <input 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                className="w-full bg-primary-dark border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:border-accent-gold"
              />
            </div>

            <button 
              type="submit"
              disabled={carregandoLogin}
              className="w-full mt-2 bg-gradient-to-r from-accent-gold to-yellow-600 text-primary-dark font-bold py-3 rounded-md uppercase tracking-wider text-sm btn-glow transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {carregandoLogin ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-400 hover:text-accent-gold transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> Voltar para a Página Inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // SE ESTIVER LOGADO, MOSTRA O PAINEL DE INSCRITOS
  return (
    <div className="min-h-screen bg-primary-dark text-text-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho do Painel */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <span className="text-xs text-accent-gold font-bold tracking-widest uppercase">Painel Restrito</span>
            <h1 className="font-serif text-3xl text-white font-bold">Controle de Inscritos</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded text-sm font-bold transition-colors flex items-center">
              <i className="fa-solid fa-house mr-2"></i> Início
            </Link>
            <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded text-sm font-bold transition-colors flex items-center">
              <i className="fa-solid fa-right-from-bracket mr-2"></i> Sair
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa e Atualização */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
          <div className="w-full sm:w-96 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-gray-500"></i>
            <input 
              type="text" 
              placeholder="Pesquisar por nome..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-secondary-dark border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-md focus:outline-none focus:border-accent-gold"
            />
          </div>
          <button 
            onClick={carregarInscritos} 
            className="w-full sm:w-auto bg-secondary-dark border border-gray-700 text-accent-gold hover:bg-gray-800 px-4 py-2.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <i className="fa-solid fa-rotate"></i> Atualizar Lista
          </button>
        </div>

        {/* Tabela de Inscritos */}
        <div className="bg-secondary-dark border border-gray-800 rounded-lg shadow-xl overflow-hidden">
          {carregando ? (
            <div className="text-center py-20">
              <i className="fa-solid fa-circle-notch fa-spin text-4xl text-accent-gold mb-3"></i>
              <p className="text-gray-400">Carregando lista de participantes...</p>
            </div>
          ) : inscritosFiltrados.length === 0 ? (
            <div className="text-center py-20">
              <i className="fa-solid fa-users-slash text-4xl text-gray-600 mb-3"></i>
              <p className="text-gray-400">Nenhum participante encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 bg-primary-dark/50 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Participante</th>
                    <th className="py-4 px-6">CPF</th>
                    <th className="py-4 px-6">Valor</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                  {inscritosFiltrados.map((inscrito, index) => (
                    <tr key={inscrito.id || index} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">{inscrito.nome}</td>
                      <td className="py-4 px-6 text-gray-300 font-mono">{inscrito.cpf}</td>
                      <td className="py-4 px-6 text-gray-300">R$ {Number(inscrito.valor).toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
                          <i className="fa-solid fa-circle-check text-[10px]"></i> Aprovado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-right text-xs text-gray-500">
          Total exibido: {inscritosFiltrados.length} participante(s)
        </div>

      </div>
    </div>
  );
}