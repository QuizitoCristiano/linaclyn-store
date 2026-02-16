import React, { useState, useMemo } from 'react';
import { Heart, ShoppingCart, Star, X } from 'lucide-react'; // Adicionado X para o fechar
import { useProducts } from '@/context/ProductContext';
import { CategoriesSection } from './CategoriesSection';
import { useCart } from '@/context/CartContext';
import { Item } from '@radix-ui/react-dropdown-menu';

export function PaginaVitrineDinamica() {
    const { products, loading } = useProducts();
    const [filter, setFilter] = useState('TODAS');
    const [selectedProduct, setSelectedProduct] = useState(null);
    // Pegando as funções e estados do seu CartProvider
    const {
        addToCart,
        toggleFavorite,
        favoriteItem,
        removeFromWishlist
    } = useCart();
    // Função para verificar se está favoritado
    const isFavorite = (id) => favoriteItem.some(item => item.id === id);


    // Função de compra: Adiciona ao carrinho e remove dos favoritos
    const addCarinho = (products, e) => {
        if (e) e.stopPropagation();

        // 1. Adiciona ao carrinho (sua função já tem o toast)
        addToCart(products);

        // 2. Remove dos favoritos se ele estiver lá
        if (isFavorite(products.id)) {
            removeFromWishlist(products.id);
        }
    };




    const filteredProducts = useMemo(() => {
        if (!products) return [];
        if (filter === 'TODAS') return products;
        return products.filter(p => p.categoria?.toUpperCase() === filter.toUpperCase());
    }, [products, filter]);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="text-red-600 animate-pulse font-black uppercase italic text-xl">
                Carregando LinaClyn...
            </div>
        </div>
    );

    return (
        <div className="bg-background min-h-screen transition-colors duration-500">

            {/* SEÇÃO DE CATEGORIAS VISUAL ELITE */}
            <CategoriesSection
                activeFilter={filter}
                onFilterChange={(newFilter) => setFilter(newFilter)}
            />






            {/* VITRINE FILTRADA */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                {filteredProducts.map((p) => (
                    <div
                        key={p.id}
                        className="group relative bg-card border border-red-600/20 rounded-[1.5rem] overflow-hidden hover:border-red-600 transition-all duration-500 flex flex-col shadow-lg"
                    >


                        {/* ÍCONE DE FAVORITO CONECTADO AO CONTEXTO */}
                        <div className="absolute top-3 right-3 z-20">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(p);
                                }}
                                className={`backdrop-blur-md p-1.5 rounded-full transition-all border border-white/5 active:scale-90 ${isFavorite(p.id)
                                    ? "bg-red-600 text-white border-red-600"
                                    : "bg-background/80 text-muted-foreground hover:text-red-600"
                                    }`}
                            >
                                <Heart className={`w-3.5 h-3.5 ${isFavorite(p.id) ? "fill-current" : ""}`} />
                            </button>
                        </div>



                        {/* AREA CLICÁVEL - Abre o Modal */}
                        <div onClick={() => setSelectedProduct(p)} className="cursor-pointer flex flex-col flex-grow">
                            <div className="relative h-44 overflow-hidden bg-muted/10 flex items-center justify-center border-b border-red-600/10">
                                <img src={p.img} alt={p.nome} className="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-700" />
                            </div>

                            <div className="p-3 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-card-foreground font-black uppercase italic text-[10px] line-clamp-2">{p.nome}</h3>
                                    <div className="flex items-center gap-0.5 text-yellow-500 shrink-0">
                                        <Star className="w-2.5 h-2.5 fill-yellow-500" />
                                        <span className="text-[9px] font-bold">5.0</span>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-[9px] uppercase font-bold italic opacity-60 line-clamp-1">
                                    {p.descricao}
                                </p>
                            </div>
                        </div>

                        {/* PREÇO E BOTÃO RÁPIDO */}
                        <div className="p-3 pt-0 mt-auto">
                            <span className="text-card-foreground font-black text-xs italic block mb-2">
                                R$ {parseFloat(p.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <button
                                onClick={(e) => addCarinho(p, e)}
                                className="w-full bg-red-600 hover:bg-red-700 text-white h-8 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-[8px] font-black uppercase italic">
                                <ShoppingCart className="w-3.5 h-3.5" /> Adicionar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL PADRONIZADO LINA CLYN - RED TECH */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card border border-red-600/40 w-full max-w-[400px] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(220,38,38,0.5)] animate-in zoom-in-95">
                        <div className="relative p-8">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 text-muted-foreground hover:text-red-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-500" />
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">(Aprovado)</span>
                            </div>

                            <div className="aspect-square w-48 mx-auto mb-6 bg-muted/20 rounded-[2rem] flex items-center justify-center p-6 border border-red-600/10">
                                <img src={selectedProduct.img} alt={selectedProduct.nome} className="max-w-full max-h-full object-contain transform hover:scale-110 transition-transform duration-500" />
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="space-y-1">
                                    <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em]">{selectedProduct.categoria || "PERFORMANCE"}</span>
                                    <h2 className="text-card-foreground font-black uppercase italic text-2xl leading-none tracking-tighter">
                                        {selectedProduct.nome}
                                    </h2>
                                </div>

                                <p className="text-muted-foreground text-xs font-medium leading-relaxed italic bg-muted/10 p-4 rounded-2xl border border-red-600/10">
                                    {selectedProduct.descricao}
                                </p>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Valor Investido</span>
                                        <span className="text-2xl font-black italic text-card-foreground">
                                            R$ {parseFloat(selectedProduct.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => addCarinho(selectedProduct, e)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 h-12 rounded-2xl flex items-center gap-3 transition-all active:scale-95 font-black uppercase italic text-xs shadow-xl shadow-red-600/40">
                                        <ShoppingCart className="w-4 h-4" />
                                        Comprar Agora
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}