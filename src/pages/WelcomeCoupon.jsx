import React, { useState, useEffect } from 'react';
import { Ticket, X, Zap, Check, Copy } from 'lucide-react';

export function WelcomeCoupon() {
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("lina_cart") || "[]");
        const alreadyClosed = sessionStorage.getItem("lina_coupon_closed");
        if (cart.length === 0 && !alreadyClosed) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText("LINA10");
        setCopied(true);
        // O "Alerta" bonito some sozinho após 3 segundos
        setTimeout(() => setCopied(false), 3000);
    };

    const closeCoupon = () => {
        setIsVisible(false);
        sessionStorage.setItem("lina_coupon_closed", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[200] max-w-[320px] animate-in slide-in-from-left-full duration-700">

            {/* Notificação flutuante que não atrapalha o design */}
            {copied && (
                <div className="absolute -top-12 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-red-600/40">
                        Copiado com Sucesso!
                    </div>
                </div>
            )}

            <div className="relative bg-white dark:bg-zinc-950 border border-red-600/20 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(220,38,38,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md">

                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/10 dark:bg-red-600/20 blur-[50px] rounded-full" />

                <button onClick={closeCoupon} className="absolute top-4 right-4 text-zinc-400 hover:text-red-600 transition-colors z-10">
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-600/40">
                        <Zap className="w-5 h-5 text-white fill-current" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Oferta de Elite</span>
                </div>

                <h3 className="text-zinc-900 dark:text-white font-black italic text-xl leading-tight uppercase tracking-tighter mb-2">
                    PRIMEIRO <br /> <span className="text-red-600">INVESTIMENTO</span>
                </h3>

                <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-medium uppercase leading-relaxed mb-6">
                    Use o código abaixo e garanta <span className="text-zinc-900 dark:text-white font-bold">10% OFF</span> em qualquer equipamento.
                </p>

                {/* Área do Cupom - Design Original com Hover de Elite */}
                <div
                    className="group relative cursor-pointer"
                    onClick={() => {
                        navigator.clipboard.writeText("LINA10");
                        setCopied(true); // Ativa o nosso aviso bonito (toast)
                        setTimeout(() => setCopied(false), 3000); // Some sozinho
                    }}
                >
                    {/* O Brilho que você gostou (Sutil e Elegante) */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative flex items-center justify-between bg-zinc-100 dark:bg-black px-4 py-3 rounded-xl border border-black/5 dark:border-white/5">
                        <span className="text-zinc-900 dark:text-white font-black tracking-[0.3em] text-sm">
                            {copied ? "COPIADO!" : "LINA10"}
                        </span>

                        {/* Ícone que reage à cópia */}
                        {copied ? (
                            <Check className="w-4 h-4 text-red-600 animate-in zoom-in" />
                        ) : (
                            <Ticket className="w-4 h-4 text-red-600" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}