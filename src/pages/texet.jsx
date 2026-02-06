import React, { useState } from 'react';
import { ShoppingCart, Star, Heart, X } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

export function VitrineProdutos() {
    const { products, loading } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);

    if (loading) return (
        <div className="flex items-center justify-center p-10">
            <div className="text-foreground animate-pulse font-black uppercase italic tracking-tighter text-lg">
                Carregando Performance...
            </div>
        </div>
    );

    return (
        <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 bg-background transition-colors duration-500">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="group relative bg-card border border-red-600/20 rounded-[1.5rem] overflow-hidden hover:border-red-600 transition-all duration-500 flex flex-col shadow-lg shadow-red-600/5 hover:shadow-red-600/20"
                    >

                        {/* ÍCONE DE FAVORITO / TOPO */}
                        <div className="absolute top-3 right-3 z-20">
                            <button className="bg-background/80 backdrop-blur-md p-1.5 rounded-full text-muted-foreground hover:text-red-600 transition-colors shadow-sm border border-white/5">
                                <Heart className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* TAG DE CATEGORIA */}
                        <div className="absolute top-3 left-3 z-10">
                            <span className="bg-red-600 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full italic tracking-widest shadow-lg">
                                {p.categoria || "ELITE"}
                            </span>
                        </div>

                        {/* AREA CLICÁVEL (Imagem + Info) */}
                        <div
                            onClick={() => setSelectedProduct(p)}
                            className="cursor-pointer flex flex-col flex-grow"
                        >
                            {/* IMAGEM COM TRANSIÇÃO SUAVE */}
                            <div className="relative h-44 overflow-hidden bg-muted/10 flex items-center justify-center border-b border-red-600/10">
                                {p.img ? (
                                    <img
                                        src={p.img}
                                        alt={p.nome}
                                        className="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                ) : (
                                    <div className="opacity-5 text-xl font-black italic">LinaClyn</div>
                                )}
                            </div>

                            {/* TEXTOS - CLICÁVEIS */}
                            <div className="p-3 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-card-foreground font-black uppercase italic text-[10px] leading-tight tracking-tight line-clamp-2">
                                        {p.nome}
                                    </h3>
                                    <div className="flex items-center gap-0.5 text-yellow-500 shrink-0">
                                        <Star className="w-2.5 h-2.5 fill-yellow-500" />
                                        <span className="text-[9px] font-bold">5.0</span>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-[9px] uppercase font-bold leading-tight line-clamp-1 italic opacity-60">
                                    {p.descricao}
                                </p>
                            </div>
                        </div>

                        {/* BOTÃO COMPRAR (FIXO NA BASE) */}
                        <div className="p-3 pt-0 mt-auto">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-card-foreground font-black text-xs italic">
                                    R$ {parseFloat(p.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white h-8 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-red-600/30">
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span className="text-[8px] font-black uppercase italic">Adicionar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}