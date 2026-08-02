// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 bg-primary-dark/95 border-b border-white/10 backdrop-blur-sm transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center gap-3">
              <i class="fa-regular fa-gem text-accent-gold text-3xl"></i>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl tracking-widest text-white leading-tight">CONFERÊNCIA</span>
                <span className="font-serif font-black text-2xl text-accent-gold leading-none">RJAM1</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-accent-gold border-b-2 border-accent-gold pb-1 font-medium text-sm hover:text-accent-gold transition">INÍCIO</a>
            <a href="#sobre" className="text-gray-300 hover:text-accent-gold font-medium text-sm transition">SOBRE</a>
            <a href="#programacao" className="text-gray-300 hover:text-accent-gold font-medium text-sm transition">PROGRAMAÇÃO</a>
            <a href="#local" className="text-gray-300 hover:text-accent-gold font-medium text-sm transition">LOCAL</a>
            <a href="#contato" className="text-gray-300 hover:text-accent-gold font-medium text-sm transition">CONTATO</a>
            <Link to="/inscricao" className="bg-gradient-to-r from-accent-gold to-accent-orange text-white font-bold py-2 px-6 rounded-md text-sm hover:from-yellow-500 hover:to-orange-500 transition shadow-lg">
              INSCREVA-SE
            </Link>
          </div>
          {/* Botão Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <i className="fa-solid fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      {/* Menu Mobile Dropdown */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-secondary-dark border-t border-gray-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#inicio" className="block px-3 py-2 text-base font-medium text-accent-gold">INÍCIO</a>
          <a href="#sobre" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white">SOBRE</a>
          <a href="#programacao" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white">PROGRAMAÇÃO</a>
          <a href="#local" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white">LOCAL</a>
          <a href="#contato" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white">CONTATO</a>
          <a href="#inscricao-futura" className="block px-3 py-2 text-base font-medium text-center bg-accent-gold text-white rounded-md mt-4">INSCREVA-SE</a>
        </div>
      </div>
    </nav>
  );
}