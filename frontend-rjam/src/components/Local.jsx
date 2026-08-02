// src/components/Local.jsx

export default function Local() {
  return (
    <section id="local" className="py-20 bg-secondary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-serif text-2xl md:text-3xl text-gray-200 uppercase tracking-widest mb-10 text-center">Localização</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto border border-gray-700 rounded-lg p-6 bg-primary-dark">
                {/* Info Texto */}
                <div>
                    <h4 className="text-accent-gold font-bold text-xl mb-4">Igreja do Evangelho Quadrangular</h4>
                    <p className="text-gray-300 mb-2">Av. Exemplo, 123 - Centro</p>
                    <p className="text-gray-300 mb-6">Sua Cidade / Estado</p>
                    
                    <a href="#" className="inline-flex items-center gap-2 border border-accent-gold text-accent-gold px-6 py-2 rounded hover:bg-accent-gold hover:text-primary-dark transition">
                        <i className="fa-solid fa-map-location-dot"></i>
                        VER NO MAPA
                    </a>
                </div>
                
                {/* Imagem de placeholder para mapa */}
                <div className="h-64 rounded-lg overflow-hidden relative bg-gray-200">
                    <img src="https://placehold.co/600x400/e6d8c3/0b0f15?text=Mapa+do+Local" alt="Mapa" className="w-full h-full object-cover grayscale" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white px-3 py-1 rounded shadow-md text-sm text-red-600 font-bold flex items-center gap-2">
                             <i className="fa-solid fa-location-dot"></i>
                             Igreja do Evangelho Quadrangular
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}