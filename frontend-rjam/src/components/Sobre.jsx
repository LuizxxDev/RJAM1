// src/components/Sobre.jsx

export default function Sobre() {
  return (
    <section id="sobre" className="py-20 bg-secondary-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card-bg rounded-lg overflow-hidden flex flex-col shadow-xl text-primary-dark hover:scale-105 transition-transform duration-300">
            <div className="h-48 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop" alt="Pão" className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h4 className="font-serif font-bold text-3xl mb-4 text-primary-dark">PÃO</h4>
              <p className="text-gray-800 mb-6 font-medium leading-relaxed">Nem só de pão viverá o homem, mas de toda palavra que procede da boca de Deus.</p>
              <p className="text-accent-orange font-bold mt-auto">Mateus 4:4</p>
            </div>
          </div>
          
          <div className="bg-card-bg rounded-lg overflow-hidden flex flex-col shadow-xl text-primary-dark hover:scale-105 transition-transform duration-300">
            <div className="h-48 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1608681120230-058df2416f50?q=80&w=800&auto=format&fit=crop" alt="Óleo" className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h4 className="font-serif font-bold text-3xl mb-4 text-primary-dark">ÓLEO</h4>
              <p className="text-gray-800 mb-6 font-medium leading-relaxed">O Espírito do Senhor Deus está sobre mim, porque o Senhor me ungiu...</p>
              <p className="text-accent-orange font-bold mt-auto">Isaías 61:1</p>
            </div>
          </div>

          <div className="bg-card-bg rounded-lg overflow-hidden flex flex-col shadow-xl text-primary-dark hover:scale-105 transition-transform duration-300">
            <div className="h-48 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1518338781604-db72f7fb50f1?q=80&w=800&auto=format&fit=crop" alt="Fogo" className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h4 className="font-serif font-bold text-3xl mb-4 text-primary-dark">FOGO</h4>
              <p className="text-gray-800 mb-6 font-medium leading-relaxed">Porventura não ardia em nós o nosso coração...</p>
              <p className="text-accent-orange font-bold mt-auto">Lucas 24:32</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}