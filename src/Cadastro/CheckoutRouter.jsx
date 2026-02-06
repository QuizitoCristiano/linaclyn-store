import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { MapPin, Truck, ShoppingBag, CreditCard, ArrowRight, ChevronLeft, Zap } from 'lucide-react';
import { db } from "@/services/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from 'sonner';
import SuccessModal from './SuccessModal';

export default function CheckoutRouter({ onNavigate }) {
    const { user } = useAuth();
    const { cartTotal, cartItems, clearCart } = useCart();

    const [showSuccess, setShowSuccess] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [step, setStep] = useState(user ? 'address' : 'identification');
    const [deliveryType, setDeliveryType] = useState('delivery');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '', nome: '', whatsapp: '', cep: '', rua: '', numero: '', bairro: '', cidade: ''
    });

    useEffect(() => {
        const loadUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setFormData(prev => ({
                        ...prev,
                        email: data.email || user.email || '',
                        nome: data.name || user.displayName || '',
                        whatsapp: data.whatsapp || ''
                    }));
                }
            }
        };
        loadUserData();
    }, [user]);

    const frete = deliveryType === 'priority' ? 15 : deliveryType === 'delivery' ? 7 : 0;
    const totalFinal = cartTotal + frete;

    const nextStep = () => {
        if (step === 'identification' && (!formData.email || !formData.nome)) {
            return toast.error("Preencha e-mail e nome para continuar!");
        }
        const steps = ['identification', 'address', 'shipping', 'payment'];
        const currentIndex = steps.indexOf(step);
        if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
    };

    const prevStep = () => {
        if (step === 'address' && !user) setStep('identification');
        else if (step === 'shipping') setStep('address');
        else if (step === 'payment') setStep('shipping');
    };

    const finalizarPedido = async (metodo) => {
        if (cartItems.length === 0) return toast.error("Seu carrinho está vazio!");
        setLoading(true);
        try {
            const orderId = `LINA-${Math.floor(1000 + Math.random() * 9000)}`;
            const orderData = {
                orderId, userId: user ? user.uid : 'guest', customer: formData,
                items: cartItems, subtotal: cartTotal, frete, total: totalFinal,
                deliveryType, paymentMethod: metodo, status: 'pendente',
                createdAt: new Date().toISOString(), serverTime: serverTimestamp()
            };
            await setDoc(doc(db, "orders", orderId), orderData);
            setLastOrder(orderData);
            setShowSuccess(true);
            if (clearCart) clearCart();
            toast.success("Pedido confirmado!");
        } catch (error) {
            toast.error("Erro ao processar pedido.");
        } finally {
            setLoading(false);
        }
    };

    // Estilo que se adapta: No light fica cinza claro com borda, no dark fica escuro.
    const inputStyle = "w-full p-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-300 dark:border-white/10 rounded-2xl outline-none focus:border-linaclyn-red transition-all placeholder:text-zinc-500";

    return (
        <>
            <div className="max-w-2xl mx-auto p-4 min-h-screen bg-background text-foreground transition-colors duration-300">
                {/* Barra de Progresso */}
                <div className="flex justify-between mb-8 px-2">
                    {['Identificação', 'Endereço', 'Entrega', 'Pagamento'].map((label, i) => (
                        <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-500 ${i <= ['identification', 'address', 'shipping', 'payment'].indexOf(step)
                            ? 'bg-linaclyn-red shadow-[0_0_10px_rgba(227,27,35,0.4)]' : 'bg-muted'
                            }`} />
                    ))}
                </div>

                <div className="bg-card rounded-3xl p-6 shadow-xl border border-border/50 backdrop-blur-sm">

                    {/* STEP 1: IDENTIFICAÇÃO */}
                    {step === 'identification' && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                            <div className="text-center">
                                <h2 className="text-2xl font-black italic uppercase">LINA<span className="text-linaclyn-red">CLYN</span> CHECKOUT</h2>
                                <p className="text-muted-foreground text-sm">Identifique-se para continuar</p>
                            </div>
                            <div className="space-y-4">
                                <input type="email" placeholder="Seu melhor e-mail" className={inputStyle}
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <input type="text" placeholder="Nome Completo" className={inputStyle}
                                    value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                            </div>
                            <button onClick={nextStep} className="w-full bg-linaclyn-red text-white p-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all">
                                CONTINUAR <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: ENDEREÇO */}
                    {step === 'address' && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                            <button onClick={prevStep} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"><ChevronLeft size={16} /> Voltar</button>
                            <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-linaclyn-red" /> Onde entregamos?</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="CEP" className={`${inputStyle} col-span-2`}
                                    value={formData.cep} onChange={(e) => setFormData({ ...formData, cep: e.target.value })} />
                                <input type="text" placeholder="Rua" className={`${inputStyle} col-span-2`}
                                    value={formData.rua} onChange={(e) => setFormData({ ...formData, rua: e.target.value })} />
                                <input type="text" placeholder="Número" className={inputStyle}
                                    value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} />
                                <input type="text" placeholder="Bairro" className={inputStyle}
                                    value={formData.bairro} onChange={(e) => setFormData({ ...formData, bairro: e.target.value })} />
                            </div>
                            <button onClick={nextStep} className="w-full bg-linaclyn-red text-white p-5 rounded-2xl font-black uppercase hover:opacity-90 transition-all shadow-lg shadow-linaclyn-red/20">Confirmar Endereço</button>
                        </div>
                    )}

                    {/* STEP 3: ENTREGA */}
                    {step === 'shipping' && (
                        <div className="space-y-4 animate-in slide-in-from-right">
                            <button onClick={prevStep} className="text-muted-foreground flex items-center gap-1 text-sm"><ChevronLeft size={16} /> Voltar</button>
                            <h2 className="text-xl font-bold">Escolha a velocidade:</h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'pickup', icon: ShoppingBag, title: 'Retirada', desc: 'Grátis • 30 min', price: 0 },
                                    { id: 'delivery', icon: Truck, title: 'Motoboy', desc: 'R$ 7,00 • 60 min', price: 7 },
                                    { id: 'priority', icon: Zap, title: 'TURBO', desc: 'R$ 15,00 • 15 min', price: 15, pulse: true }
                                ].map((type) => (
                                    <div key={type.id} onClick={() => setDeliveryType(type.id)}
                                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center group
                                            ${deliveryType === type.id
                                                ? 'border-linaclyn-red bg-linaclyn-red/5'
                                                : 'border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${deliveryType === type.id ? 'bg-linaclyn-red text-white' : 'bg-zinc-200 dark:bg-black text-zinc-500'}`}>
                                                <type.icon size={24} className={type.pulse && deliveryType === type.id ? 'animate-bounce' : ''} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{type.title}</p>
                                                <p className="text-xs text-muted-foreground">{type.desc}</p>
                                            </div>
                                        </div>
                                        <span className={`font-black ${deliveryType === type.id ? 'text-linaclyn-red' : 'text-foreground'}`}>
                                            {type.price === 0 ? 'GRÁTIS' : `R$ ${type.price.toFixed(2)}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={nextStep} className="w-full bg-linaclyn-red text-white p-5 rounded-2xl font-black uppercase mt-4 flex items-center justify-center gap-2">
                                PAGAMENTO <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* STEP 4: PAGAMENTO */}
                    {step === 'payment' && (
                        <div className="space-y-6 text-center animate-in zoom-in-95">
                            <button onClick={prevStep} className="text-muted-foreground flex items-center gap-1 text-sm"><ChevronLeft size={16} /> Voltar</button>
                            <div className="p-8 bg-zinc-100 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5">
                                <p className="text-muted-foreground text-sm font-bold mb-1 uppercase tracking-widest">Total</p>
                                <h2 className="text-5xl font-black italic">R$ {totalFinal.toFixed(2)}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => finalizarPedido('PIX')} disabled={loading}
                                    className="p-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-2xl font-black hover:opacity-90 active:scale-[0.95] transition-all uppercase">
                                    {loading ? '...' : 'PIX'}
                                </button>
                                <button onClick={() => finalizarPedido('CARTAO')} disabled={loading}
                                    className="p-5 bg-transparent border-2 border-zinc-900 dark:border-white rounded-2xl font-black hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black active:scale-[0.95] transition-all uppercase">
                                    CARTÃO
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showSuccess && lastOrder && (
                <SuccessModal orderData={lastOrder} onHighlightClose={() => { setShowSuccess(false); onNavigate('home'); }} />
            )}
        </>
    );
}