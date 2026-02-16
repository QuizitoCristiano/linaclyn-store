import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, CreditCard, Plus, Minus, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Carrinho() {
  const navigate = useNavigate();

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
    <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-16">
      {/* Overlay Tecnológico */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={toggleCart}
      />

      {/* Painel Lateral LinaClyn */}
      <div className="relative w-full sm:w-96 md:w-[450px] lg:w-[400px] h-[calc(100vh-4rem)] bg-background border-l border-border shadow-2xl animate-scale-in flex flex-col">

        {/* Header com Identidade da Marca */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-linaclyn-red/10 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-linaclyn-red" />
            </div>
            <h2 className="text-base sm:text-lg font-black italic uppercase tracking-tighter">
              | Minha Sacola Lina<span className="text-linaclyn-red">Clyn</span>
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCart}
            className="hover:text-linaclyn-red font-bold uppercase text-[10px] tracking-widest transition-colors"
          >
            Fechar
          </Button>
        </div>

        {/* Lista de Produtos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center opacity-50">
              <div className="h-16 w-16 text-muted-foreground mb-4 flex items-center justify-center border-2 border-dashed border-border rounded-full">
                <CreditCard className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground font-black italic uppercase text-xs tracking-widest">Sua sacola está vazia</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-2">O seu próximo treino começa aqui</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id} className="bg-card border-border overflow-hidden hover:border-linaclyn-red/30 transition-all group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Imagem do Produto */}
                    <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-xl overflow-hidden border border-border">
                      <img
                        src={item.image || item.img}
                        alt={item.name || item.nome}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>

                    {/* Detalhes do Produto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[11px] font-black italic uppercase truncate text-foreground leading-tight">
                        {item.name || item.nome}
                      </h3>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs font-bold text-linaclyn-red">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price || item.preco)}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">
                          Subtotal: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.price || item.preco) * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Controles de Quantidade (Estilo Sport Elite) */}
                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-linaclyn-red transition-colors p-1"
                        title="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden shadow-sm">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors border-r border-border"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-8 text-center text-[10px] font-black italic">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="w-7 h-7 flex items-center justify-center bg-linaclyn-red text-white hover:bg-linaclyn-red-dark transition-colors"
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

        {/* Footer: Resumo e Botão de Ação */}
        {cartItems.length > 0 && (
          <div className="border-t border-border p-6 bg-card space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase italic tracking-[0.2em] text-muted-foreground">Valor Total</span>
                <span className="text-2xl font-black text-foreground italic tracking-tighter leading-none">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getCartTotal())}
                </span>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Tributos inclusos</span>
            </div>


            {/* NO SEU BOTÃO DE FINALIZAR PEDIDO (Lá embaixo no código): */}
            <Button
              onClick={() => handleFinalizarCompra(navigate)} // <--- PASSE O NAVIGATE AQUI
              disabled={isCheckingOut}
              className="w-full bg-linaclyn-red hover:bg-linaclyn-red-dark text-white font-black italic uppercase tracking-widest text-[11px] py-7 rounded-lg shadow-lg transition-all group active:scale-95"
            >
              <div className="flex items-center gap-2">
                {isCheckingOut ? "Processando..." : "Finalizar Pedido"}
                {!isCheckingOut && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}