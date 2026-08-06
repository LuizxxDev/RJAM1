// src/components/Programacao.jsx

export default function Programacao() {
  const conferenciasAnteriores = [
    { id: 1, nome: "Fruto", preletor: "Charles" },
    { id: 2, nome: "Santidade", preletor: "Daniel Almada" },
    { id: 3, nome: "Lapidados no Fogo", preletor: "Jessica" },
    { id: 4, nome: "O Inexplicável de Deus", preletor: "Josivaldo e Nelma" },
    { id: 5, nome: "Não há mais tempo", preletor: "Jessica e Bil" },
    { id: 6, nome: "Fogo consumidor", preletor: "Daniel Almada", ano: "2022" },
    { id: 7, nome: "Lugar de habitação", preletor: "Daniel Almada", ano: "2023" },
    { id: 8, nome: "Transformados", preletor: "Daniel Almada", ano: "2024" },
    { id: 9, nome: "Enraizados", preletor: "Daniel Almada", ano: "2025" },
    { id: 10, nome: "Óleo, fogo e Pão", preletor: "Daniel Almada", ano: "2026" },
  ];

  return (
    <section id="programacao" className="py-20 bg-primary-dark text-text-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl md:text-4xl text-accent-gold uppercase tracking-widest mb-12 text-center">
          Programação
        </h2>

        {/* Grid dos Dias do Evento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          
          {/* Dia 09 de Outubro */}
          <div className="bg-secondary-dark border border-gray-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-accent-gold/5 text-9xl pointer-events-none">
              <i className="fa-solid fa-gem"></i>
            </div>
            <span className="text-xs text-accent-gold font-bold tracking-widest uppercase">Dia 1</span>
            <h3 className="font-serif text-2xl text-white font-bold mb-6">09 de Outubro</h3>
            
            <ul className="space-y-4 border-t border-gray-700 pt-4 text-sm sm:text-base">
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-mono">19:00 - 19:20</span>
                <span className="font-bold text-white">Abertura</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-mono">19:20 - 20:00</span>
                <span className="font-bold text-white">Louvor</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-mono">20:00 - 21:00</span>
                <span className="font-bold text-accent-gold">Pregação</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-mono">21:00 - 21:30</span>
                <span className="font-bold text-white">Homenagens</span>
              </li>
              <li className="flex justify-between items-center border-t border-gray-800 pt-2">
                <span className="text-gray-400 font-mono">21:30</span>
                <span className="font-bold text-gray-300">Encerramento</span>
              </li>
            </ul>
          </div>

          {/* Dia 10 de Outubro */}
          <div className="bg-secondary-dark border border-gray-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-accent-gold/5 text-9xl pointer-events-none">
              <i className="fa-solid fa-gem"></i>
            </div>
            <span className="text-xs text-accent-gold font-bold tracking-widest uppercase">Dia 2</span>
            <h3 className="font-serif text-2xl text-white font-bold mb-6">10 de Outubro</h3>
            
            <ul className="space-y-4 border-t border-gray-700 pt-4 text-sm sm:text-base">
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-mono">19:00 - 19:40</span>
                <span className="font-bold text-white">Louvor</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-mono">19:40 - 20:40</span>
                <span className="font-bold text-accent-gold">Pregação</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-mono">20:40 - 21:30</span>
                <span className="font-bold text-white">Homenagens e agradecimentos finais</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Conferências Anteriores */}
        <div className="max-w-4xl mx-auto bg-secondary-dark border border-gray-700 rounded-lg p-8 shadow-xl">
          <h3 className="font-serif text-2xl text-accent-gold uppercase tracking-wider mb-6 text-center">
            Conferências Anteriores
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {conferenciasAnteriores.map((conf) => (
              <div key={conf.id} className="bg-primary-dark/60 border border-gray-800 p-4 rounded-md flex items-start gap-3">
                <span className="text-accent-gold font-mono font-bold text-lg">{conf.id}.</span>
                <div>
                  <h4 className="font-bold text-white text-base">
                    {conf.nome} {conf.ano && <span className="text-xs font-normal text-gray-400">({conf.ano})</span>}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5"><i className="fa-solid fa-user mr-1 text-accent-gold/70"></i> {conf.preletor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}