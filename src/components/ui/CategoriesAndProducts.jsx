import { useState } from "react";
import { Shirt, Monitor, Footprints, Watch, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Importando sua imagem do Smartwatch
import Quizito2 from '../../imagens/Quizito2.png';
import Mochila_Nike from '../../imagens/Mochila_Nike_Infantil.png';
import Shoes__Casual1 from '../../imagens/Shoes__Casual1.png';
import Sports_Casual from '../../imagens/Sports_Casual.png';
import Projetor_4k from '../../imagens/Projetor_4k.png';




export function CategoriesAndProducts() {
    const [activeTab, setActiveTab] = useState(4); // Começa selecionado no Smartwatch

    const categories = [
        {
            id: 1,
            name: "Estilo & Moda",
            icon: Shirt,
            product: {
                name: "Mochila da Nike", // Ajustado para o que está na foto
                price: "299,90",
                tag: "Nylon Impermeável",
                img: Mochila_Nike
            }
        },
        {
            id: 2,
            name: "Tecnologia",
            icon: Monitor,
            product: {
                name: "Projetor Smart 4K Pro", // Ajustado para o projetor branco da foto
                price: "1.890,00",
                tag: "Conectividade Ultra",
                img: Projetor_4k
            }
        },
        {
            id: 3,
            name: "Sport & Fit",
            icon: Footprints,
            product: {
                name: "Tênis Nike Sport Casual", // Ajustado para o tênis da foto
                price: "459,00",
                tag: "Cushion Comfort",
                img: Shoes__Casual1
            }
        },
        {
            id: 4,
            name: "Acessórios",
            icon: Watch,
            product: {
                name: "Camisa Gola Alta Premium", // Ajustado para a pessoa de camisa branca (Quizito2)
                price: "149,90",
                tag: "Design Minimalista",
                img: Quizito2
            }
        }
    ];

    const activeCategory = categories.find(c => c.id === activeTab);

    return (
        <section className="py-12 px-4 md:px-0 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">

                {/* LADO ESQUERDO: Lista de Categorias */}
                <div className="w-full lg:w-1/3 space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 italic text-foreground">
                        Categorias <span className="text-linaclyn-red">Performance</span>
                    </h2>

                    <div className="grid grid-cols-1 gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 ${activeTab === cat.id
                                    ? "bg-white border-linaclyn-red shadow-[0_10px_30px_rgba(227,27,35,0.2)]"
                                    : "bg-card border-transparent hover:border-white/10"
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${activeTab === cat.id ? "bg-linaclyn-red text-white" : "bg-white text-linaclyn-red"
                                    }`}>
                                    <cat.icon size={22} />
                                </div>
                                <div className="text-left">
                                    <span className={`block font-black uppercase text-xs tracking-widest ${activeTab === cat.id ? "text-black" : "text-muted-foreground"}`}>
                                        {cat.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* LADO DIREITO: Card do Smartwatch com sua Imagem */}
                <div className="w-full lg:w-2/3">
                    <div className="h-full relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#151515] rounded-[3rem] border border-white/5 shadow-2xl">
                        <div className="flex flex-col md:flex-row h-full">

                            {/* Área da Imagem */}
                            <div className="w-full md:w-1/2 p-8 flex items-center justify-center relative overflow-hidden">
                                {/* Glow de fundo para destacar o relógio */}
                                <div className="absolute w-48 h-48 bg-linaclyn-red/20 blur-[80px] rounded-full"></div>

                                <img
                                    key={activeCategory.id} // Reinicia animação ao trocar
                                    src={activeCategory.product.img}
                                    alt={activeCategory.product.name}
                                    className="w-full max-w-[280px] h-auto object-contain z-10 drop-shadow-[0_20px_40px_rgba(227,27,35,0.4)] animate-scale-in"
                                />
                            </div>

                            {/* Área de Texto e Venda */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-black/40 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">+48 Avaliações</span>
                                </div>

                                <h3 className="text-3xl md:text-5xl font-black text-white leading-[0.9] mb-2 uppercase italic">
                                    {activeCategory.product.name}
                                </h3>
                                <span className="text-linaclyn-red font-black tracking-[0.2em] text-[10px] uppercase mb-8">
                                    {activeCategory.product.tag}
                                </span>

                                <div className="flex items-baseline gap-2 mb-10">
                                    <span className="text-white/40 text-sm font-bold">R$</span>
                                    <span className="text-6xl font-black text-white tracking-tighter">
                                        {activeCategory.product.price}
                                    </span>
                                </div>

                                <Button className="w-full bg-linaclyn-red hover:bg-linaclyn-red-dark text-white h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(227,27,35,0.3)]">
                                    <Plus size={20} />
                                    Adicionar ao Carrinho
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}