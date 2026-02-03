import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShoppingBag, ArrowRight, Download } from 'lucide-react';

export default function SuccessModal({ orderData, onHighlightClose }) {

    useEffect(() => {
        // Dispara os confetes com as cores da LinaClyn!
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#e31b23', '#ffffff', '#000000'];

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < animationEnd) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-md rounded-[32px] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header do Recibo */}
                <div className="bg-linaclyn-red p-8 text-center text-white">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Pedido Confirmado!</h2>
                    <p className="text-white/80 text-sm">Obrigado por escolher a LinaClyn</p>
                </div>

                {/* Detalhes do Recibo */}
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                        <span className="text-muted-foreground uppercase font-bold text-[10px] tracking-widest">Número do Pedido</span>
                        <span className="font-mono font-bold text-linaclyn-red">{orderData.orderId}</span>
                    </div>

                    <div className="space-y-2">
                        {orderData.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                                <span className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-dashed border-white/20">
                        <div className="flex justify-between items-center">
                            <span className="font-bold">Total Pago</span>
                            <span className="text-2xl font-black text-linaclyn-red italic">R$ {orderData.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="bg-secondary/50 p-4 rounded-2xl text-xs text-muted-foreground flex gap-3 italic">
                        <ShoppingBag size={16} className="shrink-0" />
                        Seu pedido foi enviado para nossa equipe de logística. Você receberá atualizações via WhatsApp.
                    </div>
                </div>

                {/* Ações */}
                <div className="p-6 pt-0 space-y-3">
                    <button
                        onClick={() => window.print()}
                        className="w-full py-4 flex items-center justify-center gap-2 text-sm font-bold hover:bg-white/5 rounded-2xl transition-all border border-white/5"
                    >
                        <Download size={18} /> Salvar Comprovante
                    </button>

                    <button
                        onClick={onHighlightClose}
                        className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Voltar para a Loja <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}