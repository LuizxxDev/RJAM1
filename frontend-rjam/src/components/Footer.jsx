// src/components/Footer.jsx

export default function Footer() {
  return (
    <footer id="contato" className="bg-primary-dark pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                {/* Logo e Bio */}
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <i className="fa-solid fa-fire-flame-curved text-accent-gold text-2xl"></i>
                        <div className="flex flex-col">
                            <span className="font-serif font-bold text-sm tracking-widest text-white leading-tight">CONFERÊNCIA</span>
                            <span className="font-serif font-black text-xl text-accent-gold leading-none">RJAM1</span>
                        </div>
                    </div>
                    <p className="font-serif text-gray-400 text-sm mb-4">PÃO, ÓLEO E FOGO</p>
                    <p className="text-gray-500 text-sm">Uma conferência para uma geração que deseja mais de Deus.</p>
                    
                    <div className="flex space-x-4 mt-6">
                        <a href="#" className="text-gray-400 hover:text-accent-gold"><i className="fa-brands fa-instagram text-xl"></i></a>
                        <a href="#" className="text-gray-400 hover:text-accent-gold"><i className="fa-brands fa-facebook text-xl"></i></a>
                        <a href="#" className="text-gray-400 hover:text-accent-gold"><i className="fa-brands fa-youtube text-xl"></i></a>
                    </div>
                </div>
                {/* Contato */}
                <div>
                    <h5 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contato</h5>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-gray-400 text-sm">
                            <i className="fa-brands fa-whatsapp text-accent-gold"></i>
                            (11) 99999-9999
                        </li>
                        <li className="flex items-center gap-3 text-gray-400 text-sm">
                            <i className="fa-regular fa-envelope text-accent-gold"></i>
                            contato@conferenciarijan.com.br
                        </li>
                    </ul>
                </div>
                {/* Menu Rápido */}
                <div>
                    <h5 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Menu Rápido</h5>
                    <div className="grid grid-cols-2 gap-2">
                        <ul className="space-y-2">
                            <li><a href="#inicio" className="text-gray-400 hover:text-accent-gold text-sm">Início</a></li>
                            <li><a href="#sobre" className="text-gray-400 hover:text-accent-gold text-sm">Sobre</a></li>
                            <li><a href="#programacao" className="text-gray-400 hover:text-accent-gold text-sm">Programação</a></li>
                        </ul>
                        <ul className="space-y-2">
                            <li><a href="#local" className="text-gray-400 hover:text-accent-gold text-sm">Local</a></li>
                            <li><a href="#contato" className="text-gray-400 hover:text-accent-gold text-sm">Contato</a></li>
                        </ul>
                    </div>
                </div>
                {/* Realização */}
                <div>
                    <h5 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Realização</h5>
                    <p className="text-gray-400 text-sm mb-4">IGREJA DO EVANGELHO QUADRANGULAR</p>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 border border-accent-gold flex items-center justify-center text-accent-gold"><i className="fa-solid fa-cross"></i></div>
                        <div className="w-8 h-8 border border-accent-gold flex items-center justify-center text-accent-gold"><i className="fa-solid fa-dove"></i></div>
                        <div className="w-8 h-8 border border-accent-gold flex items-center justify-center text-accent-gold"><i className="fa-solid fa-wine-glass"></i></div>
                        <div className="w-8 h-8 border border-accent-gold flex items-center justify-center text-accent-gold"><i className="fa-solid fa-crown"></i></div>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
                <p className="text-gray-600 text-sm">&copy; 2026 Conferência Rijan - Pão, ÓLEO e FOGO. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
  );
}