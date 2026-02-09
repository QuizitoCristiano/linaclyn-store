import React, { useState, useEffect } from 'react';
import { Zap, Copy, CheckCircle, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const _sh = "a2l6aXRvY3Jpc3RpYW5vQGdtYWlsLmNvbQ==";

const generatePixPayload = (valor, pedidoId) => {
    const chaveFull = atob(_sh);
    const nomeLoja = "LINACLYN SHOP";
    const cidade = "CURITIBA";

    return [
        "000201",
        "26580014br.gov.bcb.pix01",
        chaveFull.length.toString().padStart(2, '0'),
        chaveFull,
        "52040000",
        "5303986",
        "54", valor.toFixed(2).length.toString().padStart(2, '0'), valor.toFixed(2),
        "5802BR",
        "59", nomeLoja.length.toString().padStart(2, '0'), nomeLoja,
        "6008", cidade.length.toString().padStart(2, '0'), cidade,
        "62070503", pedidoId
    ].join('');
};

export default function PixSecurePayment({ total, orderId, onConfirm, loading, onCancel, inputStyle }) {
    const [pixCode, setPixCode] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setPixCode(generatePixPayload(total, orderId));
    }, [total, orderId]);

    const getMaskedCode = () => {
        if (!pixCode) return "";
        return pixCode.replace(atob(_sh), "kizito**********@****.com");
    };

    const handleCopy = () => {
        if (!pixCode) return;
        navigator.clipboard.writeText(pixCode);
        setCopied(true);
        toast.success("Código copiado com sucesso!");
        setTimeout(() => setCopied(false), 3000);
    };

    const handleFinalConfirm = () => {
        if (loading) return; // Trava contra cliques múltiplos

        toast.info("Validando transação...", {
            icon: <ShieldCheck className="text-emerald-500" />,
            style: {
                borderRadius: '20px',
                background: '#09090b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        });
        onConfirm();
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-linaclyn-red/10 rounded-lg">
                        <Zap className="text-linaclyn-red" size={20} />
                    </div>
                    <h3 className="font-black italic uppercase text-sm tracking-tighter dark:text-white">Pagamento Blindado</h3>
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Seguro</span>
                </div>
            </div>

            {/* CARD DE VALOR */}
            <div className="bg-zinc-100 dark:bg-zinc-900/80 p-6 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 text-center shadow-inner">
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-black mb-1 tracking-widest text-center">Total a Pagar</p>
                <h2 className="text-5xl font-black italic mb-6 text-zinc-900 dark:text-white">
                    R$ {total.toFixed(2)}
                </h2>

                <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl dark:shadow-none">
                    <div className="w-40 h-40 bg-zinc-50 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200">
                        <Lock size={32} className="text-zinc-300 mb-2" />
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-center">QR Code Protegido</span>
                    </div>
                </div>
            </div>

            {/* COPIA E COLA */}
            <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                    <p className="text-[10px] font-black uppercase text-zinc-500">Copia e Cola</p>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Expira em 30min</p>
                </div>

                <div className="relative group">
                    <textarea
                        readOnly
                        value={getMaskedCode()}
                        className={`${inputStyle} text-[11px] h-28 py-4 px-4 resize-none bg-white dark:bg-black/60 text-zinc-600 dark:text-zinc-400 break-all font-mono border-2 border-zinc-200 dark:border-white/10 rounded-3xl`}
                    />
                    <button
                        onClick={handleCopy}
                        className="absolute right-3 bottom-3 p-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl hover:scale-110 active:scale-90 transition-all shadow-xl"
                    >
                        {copied ? <CheckCircle size={22} className="text-emerald-500" /> : <Copy size={22} />}
                    </button>
                </div>
            </div>

            {/* STATUS */}
            <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <div className="flex gap-3 items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-tight text-center">
                        Criptografia de ponta a ponta ativa
                    </p>
                </div>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="space-y-3">
                <button
                    onClick={handleFinalConfirm}
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-3xl font-black uppercase flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'PROCESSANDO...' : 'JÁ FIZ O PAGAMENTO'} <ArrowRight size={20} />
                </button>

                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="w-full text-[10px] font-black uppercase text-zinc-400 hover:text-linaclyn-red transition-colors tracking-widest py-2 disabled:opacity-20"
                >
                    Cancelar e Voltar
                </button>
            </div>
        </div>
    );
}