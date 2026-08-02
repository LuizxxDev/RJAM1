// src/components/Hero.jsx
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="inicio" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-hero-pattern bg-cover bg-center bg-fixed">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <p className="font-serif tracking-[0.3em] text-gray-300 mb-2 uppercase text-sm md:text-base">Conferência</p>
        <h1 className="font-serif font-black text-6xl md:text-8xl lg:text-9xl text-accent-gold mb-2 tracking-wider drop-shadow-2xl">
          RJAM1
        </h1>
        <h2 className="font-serif font-bold text-3xl md:text-5xl text-white mb-8 tracking-wide">
          ÓLEO, FOGO E PÃO
        </h2>
        
        <div className="flex items-center justify-center gap-4 w-full max-w-2xl mx-auto mb-10">
          <div className="h-px bg-gray-600 flex-1"></div>
          <p className="text-gray-300 uppercase tracking-widest text-sm md:text-base whitespace-nowrap">Santidade, Presença e Propósito</p>
          <div className="h-px bg-gray-600 flex-1"></div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
          <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-lg border border-white/10 backdrop-blur-sm">
            <i className="fa-regular fa-calendar text-accent-gold text-2xl"></i>
            <div className="text-left">
              <p className="font-bold text-lg text-white">09 E 10</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">OUTUBRO/2026</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-lg border border-white/10 backdrop-blur-sm">
            <i className="fa-solid fa-location-dot text-accent-gold text-2xl"></i>
            <div className="text-left">
              <p className="font-bold text-lg text-white">IGREJA DO EVANGELHO</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">QUADRANGULAR</p>
            </div>
          </div>
        </div>

        <Link to="/inscricao" className="inline-block bg-gradient-to-r from-accent-gold to-yellow-600 text-primary-dark font-black px-10 py-4 rounded-md text-lg uppercase tracking-wider btn-glow">
            Faça sua Inscrição
        </Link>
      </div>
    </section>
  );
}