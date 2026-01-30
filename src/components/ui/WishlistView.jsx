import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Trash2, Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function WishlistItem() {
    const {
        favoriteItem,
        isWishlistOpen,
        closefavoriteItem,
        removeFromWishlist,
        addToCart,
    } = useCart();

    if (!isWishlistOpen) return null;

    const itensValidos = Array.isArray(favoriteItem) ? favoriteItem : [];

    return (
        <>
            <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-16">
                {/* Overlay com Backdrop Blur do seu sistema */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={closefavoriteItem}
                />

                {/* Painel Wishlist - Estilo Esportivo Elite */}
                <div className="relative w-full sm:w-96 md:w-[450px] lg:w-[400px] h-[calc(100vh-4rem)] bg-background text-foreground shadow-2xl border-l border-border animate-scale-in">
                    <div className="flex flex-col h-full">

                        {/* Header com Ícone de Coração LinaClyn */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-linaclyn-red/10 rounded-lg">
                                    <Heart className="w-5 h-5 text-linaclyn-red fill-linaclyn-red" />
                                </div>
                                <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tighter">
                                    | Meus <span className="text-linaclyn-red">Favoritos</span>
                                </h2>

                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={closefavoriteItem}
                                className="hover:text-linaclyn-red transition-all uppercase text-[10px] font-bold tracking-widest"
                            >
                                Fechar
                            </Button>
                        </div>

                        {/* Lista de Favoritos */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background custom-scrollbar">
                            {itensValidos.length === 0 ? (
                                <div className="text-center py-12 flex flex-col items-center justify-center">
                                    <div className="h-16 w-16 text-muted-foreground mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-border rounded-full opacity-50">
                                        <Heart className="h-8 w-8" />
                                    </div>
                                    <p className="text-muted-foreground font-black italic uppercase text-xs tracking-widest">
                                        Sua lista está vazia
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] mt-2">
                                        Favorite os produtos que você amou
                                    </p>
                                </div>
                            ) : (
                                itensValidos.map((item) => (
                                    <Card key={item.id} className="overflow-hidden bg-card border-border hover:border-linaclyn-red/50 transition-all hover-lift">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                {/* Imagem do Produto Favoritado */}
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden border border-border">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                                    />
                                                </div>

                                                {/* Detalhes e Nome Itálico */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xs sm:text-sm font-black italic uppercase truncate leading-tight">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm font-bold text-linaclyn-red mt-1">
                                                        R$ {item.price}
                                                    </p>

                                                    {/* Botão para mover para o carrinho direto daqui */}
                                                    <button
                                                        onClick={() => {
                                                            addToCart(item);
                                                            removeFromWishlist(item.id);
                                                        }}
                                                        className="mt-2 flex items-center gap-1 text-[9px] font-black text-foreground/60 hover:text-linaclyn-red uppercase tracking-widest transition-all"
                                                    >
                                                        <ShoppingCart size={12} /> Mover p/ Sacola
                                                    </button>
                                                </div>

                                                {/* Ação de Remover dos Favoritos */}
                                                <div className="flex flex-col items-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFromWishlist(item.id)}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Footer da Wishlist */}
                        {itensValidos.length > 0 && (
                            <div className="border-t border-border p-6 bg-card">
                                <Button
                                    onClick={closefavoriteItem}
                                    className="w-full bg-foreground text-background hover:bg-linaclyn-red hover:text-white font-black italic uppercase tracking-widest text-xs py-7 rounded-radius shadow-lg transition-all flex items-center justify-center gap-2 group"
                                >
                                    Continuar Comprando
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}