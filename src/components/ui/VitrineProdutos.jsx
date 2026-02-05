import React from 'react';
import { ShoppingCart, Star, Eye, Package } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

export function VitrineProdutos() {
    const { products, loading } = useProducts();

    if (loading) return (
        <div className="flex items-center justify-center p-10">
            <div className="text-foreground animate-pulse font-black uppercase italic tracking-tighter text-lg">
                Carregando...
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 bg-background transition-colors duration-500">
            {products.map((p) => (
                <div key={p.id} className="group relative bg-card border border-border rounded-[1.5rem] overflow-hidden hover:border-red-600/50 transition-all duration-300 flex flex-col shadow-sm">

                    {/* TAG DE CATEGORIA - BEM PEQUENA */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-600 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full italic tracking-widest shadow-md">
                            {p.categoria || "ELITE"}
                        </span>
                    </div>

                    {/* AREA DA IMAGEM - REDUZIDA (h-40 em vez de h-72) */}
                    <div className="relative h-40 overflow-hidden bg-muted/20 flex items-center justify-center border-b border-border/30">
                        {p.img ? (
                            <img
                                src={p.img}
                                alt={p.nome}
                                className="w-full h-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="opacity-5 text-xl font-black italic uppercase select-none">LinaClyn</div>
                        )}
                    </div>

                    {/* INFO DO PRODUTO - COMPACTA */}
                    <div className="p-3 flex-grow flex flex-col justify-between gap-2">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-card-foreground font-black uppercase italic text-[11px] leading-tight tracking-tight line-clamp-1">
                                    {p.nome}
                                </h3>
                                <div className="flex items-center gap-0.5 text-yellow-500">
                                    <Star className="w-2.5 h-2.5 fill-yellow-500" />
                                    <span className="text-[9px] font-bold">5.0</span>
                                </div>
                            </div>

                            {/* DESCRIÇÃO - MINÚSCULA */}
                            <p className="text-muted-foreground text-[9px] uppercase font-bold leading-tight line-clamp-1 italic opacity-60 mt-1">
                                {p.descricao}
                            </p>
                        </div>

                        {/* RODAPÉ - PREÇO E BOTÕES SLIM */}
                        <div className="pt-2">
                            <div className="flex flex-col mb-2">
                                <span className="text-card-foreground font-black text-sm italic">
                                    R$ {parseFloat(p.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <div className="flex gap-1.5">
                                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white h-8 rounded-lg flex items-center justify-center gap-1 transition-all active:scale-95 shadow-md shadow-red-600/10">
                                    <ShoppingCart className="w-3 h-3" />
                                    <span className="text-[8px] font-black uppercase italic">Comprar</span>
                                </button>

                                <button className="w-8 h-8 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg flex items-center justify-center transition-all border border-border">
                                    <Eye className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}