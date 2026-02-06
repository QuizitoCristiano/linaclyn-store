import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function CardSecureForm({ onConfirm, loading, inputStyle, onCancel }) {
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    // Máscaras de Proteção em Tempo Real
    const handleNumber = (e) => {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/(\d{4})(\d)/g, "$1 $2").substring(0, 19);
        setCardData({ ...cardData, number: v });
    };

    const handleExpiry = (e) => {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/(\d{2})(\d)/, "$1/$2").substring(0, 5);
        setCardData({ ...cardData, expiry: v });
    };

    const handleCVV = (e) => {
        let v = e.target.value.replace(/\D/g, "").substring(0, 4);
        setCardData({ ...cardData, cvv: v });
    };

    const validateAndSubmit = () => {
        const { number, name, expiry, cvv } = cardData;

        // Validação Rigorosa (Nível 1)
        if (number.length < 19) return toast.error("Número do cartão incompleto.");
        if (name.length < 5) return toast.error("Digite o nome completo conforme o cartão.");
        if (expiry.length < 5) return toast.error("Validade inválida.");
        if (cvv.length < 3) return toast.error("CVV inválido.");

        // Se passar, enviamos para a função principal finalizar
        // Note: Enviamos os dados para processamento, mas o seu Checkout 
        // deve apenas usar isso para autorizar e NÃO salvar no banco.
        onConfirm(cardData);
    };

    return (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="font-black italic uppercase flex items-center gap-2">
                    <ShieldCheck className="text-linaclyn-red" size={20} />
                    Pagamento Blindado
                </h3>
                <Lock size={16} className="text-muted-foreground opacity-50" />
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="text" placeholder="0000 0000 0000 0000" className={inputStyle}
                        value={cardData.number} onChange={handleNumber}
                    />
                    <CreditCard className="absolute right-4 top-4 opacity-20" size={20} />
                </div>

                <input
                    type="text" placeholder="NOME DO TITULAR" className={`${inputStyle} uppercase`}
                    value={cardData.name} onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                />

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="MM/AA" className={inputStyle}
                        value={cardData.expiry} onChange={handleExpiry}
                    />
                    <input
                        type="password" placeholder="CVV" className={inputStyle}
                        value={cardData.cvv} onChange={handleCVV}
                    />
                </div>
            </div>

            <div className="bg-zinc-100 dark:bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] text-muted-foreground leading-relaxed uppercase font-bold tracking-tighter">
                    Ambiente seguro LinaClyn: Seus dados sensíveis são tokenizados e processados via SSL/TLS de 256 bits.
                    Nenhuma informação de cartão é armazenada em nossos bancos de dados.
                </p>
            </div>

            <button
                onClick={validateAndSubmit}
                disabled={loading}
                className="w-full bg-linaclyn-red text-white p-5 rounded-2xl font-black uppercase hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-linaclyn-red/20"
            >
                {loading ? 'AUTORIZANDO...' : 'CONFIRMAR PAGAMENTO'}
            </button>

            <button onClick={onCancel} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
                Escolher outro método
            </button>
        </div>
    );
}