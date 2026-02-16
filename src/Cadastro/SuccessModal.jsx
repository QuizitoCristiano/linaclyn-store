import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShoppingBag, ArrowRight, Download, ShieldCheck } from 'lucide-react';

export default function SuccessModalIem({ orderData, onHighlightClose }) {


    // Movemos o useEffect para CIMA do return antecipado
    useEffect(() => {
        // Só executa a animação se houver dados
        if (!orderData) return;

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
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
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
    }, [orderData]); // Adicionamos orderData como dependência por segurança

    // Agora sim, o return antecipado para o JSX (isso é permitido)
    if (!orderData || !orderData.items) return null;


    const handleCloseSuccess = () => {
        setShowSuccess(false);
        navigate('/')
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 print:p-0 print:bg-white">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[32px] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 print:shadow-none print:border-none">

                {/* Header - Vermelho LinaClyn com Badge de Segurança */}
                <div className="bg-linaclyn-red p-8 text-center text-white relative">
                    <div className="absolute top-4 right-4 text-white/20 print:hidden">
                        <ShieldCheck size={20} />
                    </div>
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce print:hidden">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Pedido Confirmado!</h2>
                    <p className="text-white/80 text-sm">Sua transação foi processada com segurança.</p>
                </div>

                {/* Detalhes do Recibo */}
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-zinc-100 dark:border-white/5 pb-4">
                        <span className="text-zinc-500 uppercase font-bold text-[10px] tracking-widest">AUTENTICAÇÃO</span>
                        <span className="font-mono font-bold text-linaclyn-red">
                            {String(orderData.orderId).toUpperCase()}
                        </span>
                    </div>

                    {/* Lista de Itens Blindada */}
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar print:max-h-none">
                        {orderData.items.map((item, idx) => {
                            const itemPrice = Number(item.price || 0);
                            const itemQty = Number(item.quantity || 0);
                            return (
                                <div key={idx} className="flex justify-between text-sm animate-in slide-in-from-bottom-2 duration-300" style={{ delay: `${idx * 100}ms` }}>
                                    <span className="text-zinc-600 dark:text-zinc-400">
                                        {itemQty}x {item.name || item.nome}
                                    </span>
                                    <span className="font-bold text-zinc-900 dark:text-white">
                                        R$ {(itemPrice * itemQty).toFixed(2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-dashed border-zinc-200 dark:border-white/20">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-zinc-900 dark:text-white">Total Final</span>
                            <span className="text-2xl font-black text-linaclyn-red italic">
                                R$ {Number(orderData.total || 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="bg-zinc-100 dark:bg-white/5 p-4 rounded-2xl text-[11px] text-zinc-600 dark:text-zinc-400 flex gap-3 italic">
                        <ShoppingBag size={16} className="shrink-0 text-linaclyn-red" />
                        A confirmação foi enviada para o seu e-mail. Guarde o ID do pedido para suporte.
                    </div>
                </div>

                <div className="p-6 pt-0 space-y-3 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="w-full py-4 flex items-center justify-center gap-2 text-sm font-bold text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-all border border-zinc-200 dark:border-white/10"
                    >
                        <Download size={18} /> Gerar Recibo PDF
                    </button>

                    <button
                        onClick={onHighlightClose}
                        className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                    >
                        Concluir <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}