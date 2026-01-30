

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Trash2, CreditCard, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function carrinho() {
    const {
        cartItems,
        isCartOpen,
        toggleCart,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        getCartTotal,
        isCheckingOut,
        handleFinalizarCompra
    } = useCart();

    if (!isCartOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-16">
                {/* Overlay usando as variáveis do seu CSS */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={toggleCart}
                />

                {/* Painel do Carrinho - Usando bg-background e border-border do seu sistema */}
                <div className="relative w-full sm:w-96 md:w-[450px] lg:w-[400px] h-[calc(100vh-4rem)] bg-background text-foreground shadow-2xl border-l border-border animate-scale-in">
                    <div className="flex flex-col h-full">

                        {/* Header com a cor Primária LinaClyn */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-linaclyn-red" />
                                <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tighter">
                                    | Minha Sacola <span className="text-linaclyn-red">LinaClyn</span>
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleCart}
                                className="hover:text-linaclyn-red transition-all uppercase text-[10px] font-bold tracking-widest"
                            >
                                Fechar
                            </Button>
                        </div>

                        {/* Lista de Itens */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-12 flex flex-col items-center justify-center">
                                    <div className="h-16 w-16 text-muted-foreground mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-border rounded-full">
                                        <CreditCard className="h-8 w-8" />
                                    </div>
                                    <p className="text-muted-foreground font-black italic uppercase text-xs tracking-widest">
                                        Sua sacola está vazia
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] mt-2">
                                        Adicione alguns produtos para começar
                                    </p>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <Card key={item.id} className="overflow-hidden bg-card border-border hover:border-linaclyn-red transition-all hover-lift">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                {/* Imagem */}
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden border border-border">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                    />
                                                </div>

                                                {/* Detalhes */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xs sm:text-sm font-black italic uppercase truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm font-bold text-linaclyn-red mt-1">
                                                        R$ {item.price}
                                                    </p>
                                                </div>

                                                {/* Ações e Quantidade */}
                                                <div className="flex flex-col items-end gap-2">
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-muted-foreground hover:text-linaclyn-red transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                    <div className="flex items-center gap-1 bg-muted rounded-full p-1 border border-border">
                                                        <button
                                                            onClick={() => decrementQuantity(item.id)}
                                                            className="w-6 h-6 flex items-center justify-center hover:text-linaclyn-red"
                                                        >
                                                            <Minus size={10} />
                                                        </button>
                                                        <span className="text-[10px] font-bold px-1">{item.quantity}</span>
                                                        <button
                                                            onClick={() => incrementQuantity(item.id)}
                                                            className="w-6 h-6 flex items-center justify-center bg-linaclyn-red text-white rounded-full hover:bg-linaclyn-red-dark"
                                                        >
                                                            <Plus size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Footer com Variáveis do Sistema */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-border p-6 bg-card space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black uppercase italic tracking-widest text-muted-foreground">Subtotal:</span>
                                    <span className="text-xl font-bold text-foreground">
                                        {getCartTotal().toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </span>
                                </div>

                                <Button
                                    onClick={handleFinalizarCompra}
                                    disabled={isCheckingOut}
                                    className="w-full bg-linaclyn-red hover:bg-linaclyn-red-dark text-primary-foreground font-black italic uppercase tracking-widest text-xs py-7 rounded-radius shadow-lg transition-all active:scale-95"
                                >
                                    {isCheckingOut ? "Processando..." : "Finalizar Compra"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}