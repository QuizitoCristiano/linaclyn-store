import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Trash2, CreditCard, Plus, Minus, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ShoppingCart() {
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
        {/* Overlay com o blur tecnológico da LinaClyn */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={toggleCart}
        />

        {/* Painel Lateral - Usando bg-background e border-border do seu CSS */}
        <div className="relative w-full sm:w-96 md:w-[450px] lg:w-[400px] h-[calc(100vh-4rem)] bg-background border-l border-border shadow-2xl animate-scale-in">
          <div className="flex flex-col h-full">

            {/* Header: Substituindo o roxo pelo estilo LinaClyn */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-linaclyn-red" />
                <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tighter">
                  | Minha Sacola Lina<span className="text-linaclyn-red">Clyn</span>
                </h2>

              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCart}
                className="hover:text-linaclyn-red font-bold uppercase text-[10px] tracking-widest"
              >
                Fechar
              </Button>
            </div>

            {/* Lista de Produtos (Baseado no layout da imagem que você enviou) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="h-16 w-16 text-muted-foreground mb-4 flex items-center justify-center border-2 border-dashed border-border rounded-full">
                    <CreditCard className="h-8 w-8" />
                  </div>
                  <p className="text-muted-foreground font-black italic uppercase text-xs tracking-widest">Sua sacola está vazia</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-2">Adicione performance ao seu carrinho</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <Card key={item.id} className="bg-card border-border overflow-hidden hover-lift hover:border-linaclyn-red/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Imagem à Esquerda (Como na sua imagem de referência) */}
                        <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-xl overflow-hidden border border-border">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                          />
                        </div>

                        {/* Detalhes Centralizados */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-black italic uppercase truncate text-foreground">
                            {item.name}
                          </h3>
                          <div className="mt-1 space-y-0.5">
                            <p className="text-[11px] font-bold text-linaclyn-red">
                              R$ {typeof item.price === 'number' ? item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : item.price}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">
                              Qtd: {item.quantity}
                            </p>
                          </div>
                        </div>

                        {/* Controles à Direita */}
                        <div className="flex flex-col items-end gap-3">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-linaclyn-red transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>

                          {/* Seleção de Quantidade Estilo Sport */}
                          <div className="flex items-center gap-1 bg-background border border-border rounded-full p-1">
                            <button
                              onClick={() => decrementQuantity(item.id)}
                              className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              <Minus size={12} />
                            </button>
                            <button
                              onClick={() => incrementQuantity(item.id)}
                              className="w-6 h-6 flex items-center justify-center bg-linaclyn-red text-white rounded-full hover:bg-linaclyn-red-dark transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Footer: Resumo e Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-border p-6 bg-card space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase italic tracking-widest text-muted-foreground">Total da Ordem:</span>
                  <span className="text-xl font-black text-foreground italic">
                    {getCartTotal().toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>

                <Button
                  onClick={handleFinalizarCompra}
                  disabled={isCheckingOut}
                  className="w-full bg-linaclyn-red hover:bg-linaclyn-red-dark text-white font-black italic uppercase tracking-widest text-xs py-7 rounded-radius shadow-[0_10px_20px_rgba(227,27,35,0.2)] transition-all group"
                >
                  <div className="flex items-center gap-2">
                    {isCheckingOut ? "Processando Ordem..." : "Finalizar Compra"}
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}