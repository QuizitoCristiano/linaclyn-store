import React from 'react';
import { ShoppingBag, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function WishlistSidebar() {
    const {
        favoriteItem,
        removeFromWishlist,
        addToCart,
        isWishlistOpen,
        closefavoriteItem
    } = useCart();

    const handleMoveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id);
    };

    if (!isWishlistOpen) return null;

    return (
        /* Ajustado: bg-card e border-border para seguir o tema */
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-[#0a0a0a] border-l border-zinc-200 dark:border-white/5 z-[150] shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">

                {/* HEADER - Cores adaptáveis */}
                <div className="p-6 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between bg-zinc-50 dark:bg-[#0f0f0f]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-600/10 rounded-lg">
                            <ShoppingBag className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-lg font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white">
                            MEUS <span className="text-red-600">FAVORITOS</span>
                        </h2>
                    </div>
                    <button
                        onClick={closefavoriteItem}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-white/50 hover:text-red-600 transition-colors"
                    >
                        FECHAR
                    </button>
                </div>

                {/* LISTA DE PRODUTOS */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#0a0a0a]">
                    {favoriteItem.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 italic text-center p-10">
                            <p className="font-black uppercase text-xs tracking-widest text-zinc-500 dark:text-white">Sua lista está vazia</p>
                        </div>
                    ) : (
                        favoriteItem.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-zinc-50 dark:bg-[#151515] border border-zinc-200 dark:border-white/5 p-4 rounded-[1.8rem] flex items-center gap-4 hover:border-red-600/20 transition-all"
                            >
                                {/* BOX DA IMAGEM */}
                                <div className="w-20 h-20 bg-white dark:bg-black rounded-[1.2rem] overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-white/5 relative">
                                    {item.img ? (
                                        <img
                                            src={item.img}
                                            alt={item.nome}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[8px] font-black opacity-20 uppercase italic text-zinc-900 dark:text-white">S/ Foto</div>
                                    )}
                                </div>

                                {/* INFO PRODUTO */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black uppercase italic text-[11px] leading-tight text-zinc-800 dark:text-white/90 tracking-tight">
                                        {item.nome || "PRODUTO LINACLYN"}
                                    </h4>
                                    <p className="text-red-600 font-black italic text-[13px] mt-1">
                                        R$ {parseFloat(item.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                {/* AÇÕES */}
                                <div className="flex flex-col gap-1.5">
                                    <button
                                        onClick={() => handleMoveToCart(item)}
                                        className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all active:scale-90 shadow-lg shadow-red-600/10"
                                    >
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="p-2.5 bg-zinc-200 dark:bg-white/5 hover:bg-zinc-300 dark:hover:bg-white/10 text-zinc-500 dark:text-white/40 hover:text-red-600 transition-all rounded-full"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* FOOTER - Mantendo sua frase favorita com cor adaptável */}
                <div className="p-6 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#0f0f0f]">
                    <p className="text-[9px] text-zinc-500 dark:text-white/30 text-center uppercase font-bold italic leading-relaxed px-4">
                        "Coisas boas acontecem com aqueles que todos esperam, só o que os apressados deixaram para trás"
                    </p>
                </div>
            </div>
        </div>
    );
}