import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShoppingBag, ArrowRight, Download } from 'lucide-react';

export default function SuccessModalIem({ orderData, onHighlightClose }) {

    useEffect(() => {
        let isAlive = true;
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#e31b23', '#ffffff', '#000000'];

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            zIndex: 200
        });

        const frame = () => {
            if (!isAlive) return;
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
        return () => { isAlive = false; };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 print:p-0 print:bg-white">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[32px] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 print:shadow-none print:border-none">

                {/* Header - Vermelho LinaClyn */}
                <div className="bg-linaclyn-red p-8 text-center text-white print:bg-black print:text-white">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce print:hidden">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Pedido Confirmado!</h2>
                    <p className="text-white/80 text-sm">Obrigado por escolher a LinaClyn</p>
                </div>

                {/* Detalhes do Recibo */}
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-zinc-100 dark:border-white/5 pb-4">
                        <span className="text-zinc-500 dark:text-muted-foreground uppercase font-bold text-[10px] tracking-widest">ID DO PEDIDO</span>
                        <span className="font-mono font-bold text-linaclyn-red print:text-black">
                            {orderData?.orderId}
                        </span>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar print:max-h-none">
                        {orderData?.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-zinc-600 dark:text-muted-foreground">
                                    {item.quantity}x {item.name}
                                </span>
                                <span className="font-bold text-zinc-900 dark:text-white">
                                    R$ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-dashed border-zinc-200 dark:border-white/20">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-zinc-900 dark:text-white">Total Pago</span>
                            <span className="text-2xl font-black text-linaclyn-red italic print:text-black">
                                R$ {Number(orderData?.total).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Banner Informativo */}
                    <div className="bg-zinc-100 dark:bg-white/5 p-4 rounded-2xl text-[11px] text-zinc-600 dark:text-muted-foreground flex gap-3 italic print:bg-zinc-50">
                        <ShoppingBag size={16} className="shrink-0 text-linaclyn-red print:text-black" />
                        Seu pedido está em processamento. Você receberá o código de rastreio em breve.
                    </div>
                </div>

                {/* Ações - Escondidas na Impressão */}
                <div className="p-6 pt-0 space-y-3 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="w-full py-4 flex items-center justify-center gap-2 text-sm font-bold text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-all border border-zinc-200 dark:border-white/5"
                    >
                        <Download size={18} /> Salvar Comprovante (PDF)
                    </button>

                    <button
                        onClick={onHighlightClose}
                        className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Voltar para a Loja <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}