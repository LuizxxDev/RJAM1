// src/components/Programacao.jsx

export default function Programacao() {
  return (
    <section id="programacao" className="py-20 bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
                <h3 className="font-serif text-2xl md:text-3xl text-gray-200 uppercase tracking-widest">Programação da Conferência</h3>
                <div className="h-px bg-gray-700 flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sexta */}
                <div className="border border-gray-700 rounded-lg p-6 bg-secondary-dark relative">
                    <h4 className="text-accent-gold font-bold text-lg mb-6 text-center">27/09 - SEXTA-FEIRA</h4>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">19h00</span>
                            <span className="text-white">Abertura</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">19h30</span>
                            <span className="text-white">Culto de Louvor</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">20h00</span>
                            <span className="text-white">Palavra</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">22h00</span>
                            <span className="text-white">Encerramento</span>
                        </div>
                    </div>
                    <i className="fa-regular fa-gem text-gray-700 text-4xl absolute bottom-4 right-4 opacity-50"></i>
                </div>
                {/* Sábado */}
                <div className="border border-gray-700 rounded-lg p-6 bg-secondary-dark relative">
                    <h4 className="text-accent-gold font-bold text-lg mb-6 text-center">28/09 - SÁBADO</h4>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">14h00</span>
                            <span className="text-white">Tarde de Capacitação</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">16h00</span>
                            <span className="text-white">Workshops</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">19h00</span>
                            <span className="text-white">Culto de Louvor</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">20h00</span>
                            <span className="text-white">Palavra</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">22h00</span>
                            <span className="text-white">Encerramento</span>
                        </div>
                    </div>
                    <i className="fa-regular fa-gem text-gray-700 text-4xl absolute bottom-4 right-4 opacity-50"></i>
                </div>
                {/* Domingo */}
                <div className="border border-gray-700 rounded-lg p-6 bg-secondary-dark relative">
                    <h4 className="text-accent-gold font-bold text-lg mb-6 text-center">29/09 - DOMINGO</h4>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">09h00</span>
                            <span className="text-white">Escola Bíblica</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">18h00</span>
                            <span className="text-white">Culto de Louvor</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">19h00</span>
                            <span className="text-white">Palavra</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400 font-mono">21h00</span>
                            <span className="text-white">Encerramento</span>
                        </div>
                    </div>
                    <i className="fa-regular fa-gem text-gray-700 text-4xl absolute bottom-4 right-4 opacity-50"></i>
                </div>
            </div>
        </div>
    </section>
  );
}