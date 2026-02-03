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
    const { cartTotal, cartItems, clearCart } = useCart(); // Adicionei clearCart aqui

    const [showSuccess, setShowSuccess] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [step, setStep] = useState(user ? 'address' : 'identification');
    const [deliveryType, setDeliveryType] = useState('delivery');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        nome: '',
        whatsapp: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: ''
    });

    // Sincronia de Dados do Usuário
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

    // FUNÇÃO ÚNICA PARA FINALIZAR PEDIDO
    const finalizarPedido = async (metodo) => {
        if (cartItems.length === 0) return toast.error("Seu carrinho está vazio!");

        setLoading(true);
        try {
            const orderId = `LINA-${Math.floor(1000 + Math.random() * 9000)}`;

            const orderData = {
                orderId,
                userId: user ? user.uid : 'guest',
                customer: formData,
                items: cartItems,
                subtotal: cartTotal,
                frete: frete,
                total: totalFinal,
                deliveryType,
                paymentMethod: metodo,
                status: 'pendente',
                createdAt: new Date().toISOString(), // Usando ISO para o Modal ler fácil
                serverTime: serverTimestamp(),
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            };

            // 1. Salva no Firebase
            await setDoc(doc(db, "orders", orderId), orderData);

            // 2. Prepara o Modal de Sucesso
            setLastOrder(orderData);
            setShowSuccess(true);

            // 3. Limpa o carrinho
            if (clearCart) clearCart();

            toast.success("Pedido confirmado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao processar pedido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-4 min-h-screen bg-background text-foreground">
                {/* Barra de Progresso */}
                <div className="flex justify-between mb-8 px-2">
                    {['Identificação', 'Endereço', 'Entrega', 'Pagamento'].map((label, i) => (
                        <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-500 ${i <= ['identification', 'address', 'shipping', 'payment'].indexOf(step)
                            ? 'bg-linaclyn-red shadow-[0_0_10px_rgba(227,27,35,0.5)]' : 'bg-muted'
                            }`} />
                    ))}
                </div>

                <div className="bg-card rounded-3xl p-6 shadow-2xl border border-border/50 backdrop-blur-sm">
                    {/* STEP 1: IDENTIFICAÇÃO */}
                    {step === 'identification' && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                            <div className="text-center">
                                <h2 className="text-2xl font-black italic uppercase">LINA<span className="text-linaclyn-red">CLYN</span> CHECKOUT</h2>
                                <p className="text-muted-foreground text-sm">Identifique-se para continuar</p>
                            </div>
                            <div className="space-y-4">
                                <input type="email" placeholder="E-mail" className="w-full p-4 bg-secondary/50 border border-white/10 rounded-2xl outline-none"
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <input type="text" placeholder="Nome Completo" className="w-full p-4 bg-secondary/50 border border-white/10 rounded-2xl outline-none"
                                    value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                            </div>
                            <button onClick={nextStep} className="w-full bg-linaclyn-red text-white p-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                CONTINUAR <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: ENDEREÇO */}
                    {step === 'address' && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                            <button onClick={prevStep} className="text-muted-foreground flex items-center gap-1 text-sm"><ChevronLeft size={16} /> Voltar</button>
                            <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-linaclyn-red" /> Endereço de Entrega</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="CEP" className="col-span-2 p-4 bg-secondary/50 rounded-2xl border border-white/10 outline-none"
                                    value={formData.cep} onChange={(e) => setFormData({ ...formData, cep: e.target.value })} />
                                <input type="text" placeholder="Rua" className="col-span-2 p-4 bg-secondary/50 rounded-2xl border border-white/10 outline-none"
                                    value={formData.rua} onChange={(e) => setFormData({ ...formData, rua: e.target.value })} />
                                <input type="text" placeholder="Número" className="p-4 bg-secondary/50 rounded-2xl border border-white/10 outline-none"
                                    value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} />
                                <input type="text" placeholder="Bairro" className="p-4 bg-secondary/50 rounded-2xl border border-white/10 outline-none"
                                    value={formData.bairro} onChange={(e) => setFormData({ ...formData, bairro: e.target.value })} />
                            </div>
                            <button onClick={nextStep} className="w-full bg-linaclyn-red text-white p-5 rounded-2xl font-black uppercase">Confirmar Endereço</button>
                        </div>
                    )}

                    {/* STEP 3: LOGÍSTICA */}
                    {step === 'shipping' && (
                        <div className="space-y-4 animate-in slide-in-from-right">
                            <h2 className="text-xl font-bold">Método de Entrega:</h2>
                            {[
                                { id: 'pickup', icon: ShoppingBag, title: 'Retirada', desc: 'Grátis • 30 min', price: 0, color: 'text-blue-400' },
                                { id: 'delivery', icon: Truck, title: 'Motoboy Padrão', desc: 'R$ 7,00 • 60 min', price: 7, color: 'text-orange-400' },
                                { id: 'priority', icon: Zap, title: 'Entrega TURBO', desc: 'R$ 15,00 • 15 min', price: 15, color: 'text-yellow-400', pulse: true }
                            ].map((type) => (
                                <div key={type.id} onClick={() => setDeliveryType(type.id)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${deliveryType === type.id ? 'border-linaclyn-red bg-linaclyn-red/5' : 'border-white/5 bg-secondary/30'}`}>
                                    <div className="flex items-center gap-3">
                                        <type.icon className={`${type.color} ${type.pulse ? 'animate-pulse' : ''}`} />
                                        <div>
                                            <p className="font-bold">{type.title}</p>
                                            <p className="text-xs text-muted-foreground">{type.desc}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold">R$ {type.price.toFixed(2)}</span>
                                </div>
                            ))}
                            <button onClick={nextStep} className="w-full bg-linaclyn-red text-white p-5 rounded-2xl font-black uppercase mt-4">Próximo Passo</button>
                        </div>
                    )}

                    {/* STEP 4: PAGAMENTO */}
                    {step === 'payment' && (
                        <div className="space-y-6 text-center animate-in zoom-in-95">
                            <div className="p-6 bg-secondary/30 rounded-3xl border border-white/5">
                                <p className="text-muted-foreground text-sm font-bold mb-1">TOTAL A PAGAR</p>
                                <h2 className="text-4xl font-black text-white italic">R$ {totalFinal.toFixed(2)}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => finalizarPedido('PIX')} disabled={loading}
                                    className="p-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 disabled:opacity-50">
                                    {loading ? 'Processando...' : 'PIX (5% OFF)'}
                                </button>
                                <button onClick={() => finalizarPedido('CARTAO')} disabled={loading}
                                    className="p-4 bg-zinc-800 text-white rounded-2xl font-bold hover:bg-zinc-700 disabled:opacity-50 border border-white/10">
                                    CARTÃO
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DE SUCESSO COM CONFETE */}
            {showSuccess && lastOrder && (
                <SuccessModal
                    orderData={lastOrder}
                    onHighlightClose={() => {
                        setShowSuccess(false);
                        onNavigate('home');
                    }}
                />
            )}
        </>
    );
}