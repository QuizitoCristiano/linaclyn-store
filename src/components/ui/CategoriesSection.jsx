import { Shirt, Monitor, Footprints, Watch, ArrowRight } from "lucide-react";

export function CategoriesSection() {
  const categories = [
    { id: 1, name: "Estilo & Moda", icon: Shirt },
    { id: 2, name: "Tecnologia", icon: Monitor },
    { id: 3, name: "Sport & Fit", icon: Footprints },
    { id: 4, name: "Acessórios", icon: Watch }
  ];

  return (
    <section className="py-8 px-4 md:px-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground italic uppercase tracking-widest">Categorias</h2>
          <div className="h-1 w-12 bg-linaclyn-red mt-1"></div>
        </div>
        <button className="group flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-tighter hover:opacity-80 transition-all">
          Ver todas <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {categories.map((category) => (
          <div key={category.id} className="group cursor-pointer">
            <div className="flex flex-col items-center transition-all duration-300">

              {/* Círculo do Ícone - Foco total no Branco com Ícone Vermelho */}
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center 
                        shadow-lg group-hover:shadow-[0_0_30px_rgba(227,27,35,0.4)] 
                        group-hover:scale-110 transition-all duration-500 mb-4">
                <category.icon className="w-12 h-11 text-linaclyn-red" />
              </div>

              {/* Texto com espaçamento e peso maior */}
              <span className="text-xs md:text-sm font-black uppercase tracking-widest text-foreground 
                         group-hover:text-linaclyn-red transition-colors duration-300 text-center">
                {category.name}
              </span>

              {/* Detalhe minimalista: Linha vermelha que aparece no hover */}
              <div className="h-0.5 w-0 bg-linaclyn-red group-hover:w-8 transition-all duration-300 mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}