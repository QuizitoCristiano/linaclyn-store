import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CreditCard, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function CardSecureForm({ total, onConfirm, loading, inputStyle, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        if (name.length < 5) {
            return toast.error("Digite o nome completo conforme o cartão.");
        }

        const cardElement = elements.getElement(CardElement);

        // AQUI A MÁGICA: O dado do cartão vira um Token Seguro na Stripe
        const { error, token } = await stripe.createToken(cardElement, { name });

        if (error) {
            toast.error(error.message);
        } else {
            // Enviamos apenas o TOKEN para o seu Firebase. Nada de números reais!
            onConfirm(token);
        }
    };

    // Estilização para o campo da Stripe "casar" com seu design
    const cardStyle = {
        style: {
            base: {
                color: "#FFFFFF",
                fontFamily: 'inherit',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": { color: "#71717a" },
            },
            invalid: { color: "#ef4444", iconColor: "#ef4444" },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4">
                <h3 className="font-black italic uppercase flex items-center gap-2 text-sm">
                    <ShieldCheck className="text-linaclyn-red" size={20} />
                    Pagamento Blindado
                </h3>
                <Lock size={16} className="text-muted-foreground opacity-50" />
            </div>

            <div className="space-y-4">
                {/* NOME DO TITULAR (Pode ficar no State) */}
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-zinc-500 ml-1">Titular do Cartão</p>
                    <input
                        type="text"
                        placeholder="NOME IMPRESSO NO CARTÃO"
                        className={`${inputStyle} uppercase`}
                        value={name}
                        onChange={(e) => setName(e.target.value.toUpperCase())}
                        required
                    />
                </div>

                {/* CAMPO ÚNICO E SEGURO DA STRIPE (Número, Validade e CVV tudo em um) */}
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-zinc-500 ml-1">Dados do Cartão</p>
                    <div className={`${inputStyle} py-4 bg-white dark:bg-black/60 border-2 border-zinc-200 dark:border-white/10 rounded-3xl`}>
                        <CardElement options={cardStyle} />
                    </div>
                </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-white/5">
                <p className="text-[10px] text-muted-foreground leading-relaxed uppercase font-bold tracking-tighter text-center">
                    Criptografia SSL de 256 bits ativa. Os dados sensíveis são processados diretamente pela Stripe® e tokenizados instantaneamente.
                </p>
            </div>

            <div className="space-y-3">
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full bg-linaclyn-red text-white p-6 rounded-3xl font-black uppercase flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-lg shadow-linaclyn-red/20 disabled:opacity-50"
                >
                    {loading ? 'AUTORIZANDO...' : `CONFIRMAR R$ ${total.toFixed(2)}`} <ArrowRight size={20} />
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full text-[10px] font-black uppercase text-zinc-400 hover:text-foreground transition-colors tracking-widest"
                >
                    Escolher outro método
                </button>
            </div>
        </form>
    );
}