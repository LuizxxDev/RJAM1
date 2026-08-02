// src/components/Local.jsx

export default function Local() {
  return (
    <section id="local" className="py-20 bg-secondary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-serif text-2xl md:text-3xl text-gray-200 uppercase tracking-widest mb-10 text-center">Localização</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto border border-gray-700 rounded-lg p-6 bg-primary-dark">
                {/* Info Texto */}
                <div>
                    <h4 className="text-accent-gold font-bold text-xl mb-4">Catedral da Benção</h4>
                    <p className="text-gray-300 mb-2">R. Quatorze de Fevereiro, 149 - Aura</p>
                    <p className="text-gray-300 mb-6">Ananindeua / Pará</p>
                    
                    <a href="https://maps.app.goo.gl/ZbzbiAKsg5Jqnk1r9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-accent-gold text-accent-gold px-6 py-2 rounded hover:bg-accent-gold hover:text-primary-dark transition">
                        <i className="fa-solid fa-map-location-dot"></i>
                        VER NO MAPA
                    </a>
                </div>
                
                {/* Mapa Interativo no lugar do placeholder */}
                <div className="h-64 rounded-lg overflow-hidden relative border border-gray-700">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.657449923581!2d-48.368142899999995!3d-1.3821763999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a4f572883098d1%3A0x36e34e888396bdfd!2sR.%20Quatorze%20de%20Fevereiro%2C%20149%20-%20Aura%2C%20Ananindeua%20-%20PA%2C%2067032-011!5e0!3m2!1spt-BR!2sbr!4v1785672381005!5m2!1spt-BR!2sbr" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Mapa do Local do Evento"
                    ></iframe>
                </div>
            </div>
        </div>
    </section>
  );
}