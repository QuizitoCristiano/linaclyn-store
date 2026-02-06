import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { MapPin, Truck, ShoppingBag, CreditCard, ArrowRight, ChevronLeft, Zap } from 'lucide-react';
import { db } from "@/services/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from 'sonner';
import SuccessModalIem from './SuccessModal';
import CardSecureForm from './CardSecureForm';
import PixSecurePayment from './PixSecurePayment';

// --- FUNÇÕES DE SEGURANÇA E MÁSCARA (FORA DO COMPONENTE) ---
const formatCPF = (v) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").substring(0, 14);
const formatCEP = (v) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
const formatPhone = (v) => v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);

export default function CheckoutRouter({ onNavigate }) {
    const [showCardForm, setShowCardForm] = useState(false);
    const [showPixPayment, setShowPixPayment] = useState(false);
    const { user } = useAuth();
    const { cartTotal, cartItems, clearCart } = useCart();

    const [showSuccess, setShowSuccess] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [step, setStep] = useState(user ? 'address' : 'identification');
    const [deliveryType, setDeliveryType] = useState('delivery');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '', nome: '', cpf: '', whatsapp: '',
        cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '', complemento: ''
    });




    // --- CARREGAMENTO ROBUSTO DE DADOS ---
    useEffect(() => {
        const loadUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const d = userDoc.data();
                    setFormData(prev => ({
                        ...prev,
                        email: d.email || user.email || '',
                        nome: d.name || d.nome || user.displayName || '',
                        whatsapp: d.whatsapp ? formatPhone(d.whatsapp) : '',
                        cpf: d.cpf ? formatCPF(d.cpf) : '',
                        cep: d.cep ? formatCEP(d.cep) : '',
                        rua: d.rua || '',
                        numero: d.numero || '',
                        bairro: d.bairro || '',
                        cidade: d.cidade || '',
                        uf: d.uf || '',
                        complemento: d.complemento || ''
                    }));
                }
            }
        };
        loadUserData();
    }, [user]);

    const frete = deliveryType === 'priority' ? 15 : deliveryType === 'delivery' ? 7 : 0;
    const totalFinal = cartTotal + frete;

    // --- BUSCA DE CEP COM HIGIENE DE DADOS ---
    const checkCEP = async (cepValue) => {
        const cleanCEP = cepValue.replace(/\D/g, "");
        if (cleanCEP.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        rua: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        uf: data.uf
                    }));
                    toast.success("Endereço localizado!");
                }
            } catch (e) { toast.error("Erro ao buscar CEP."); }
        }
    };

    const nextStep = () => {
        if (step === 'identification') {
            if (!formData.email.includes('@')) return toast.error("E-mail inválido!");
            if (formData.nome.length < 3) return toast.error("Nome muito curto!");
            if (formData.cpf.replace(/\D/g, "").length !== 11) return toast.error("CPF deve ter 11 dígitos!");
            if (formData.whatsapp.replace(/\D/g, "").length < 10) return toast.error("WhatsApp inválido!");
        }
        if (step === 'address' && (!formData.cep || !formData.numero || !formData.rua)) {
            return toast.error("Preencha o endereço completo!");
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
        if (cartItems.length === 0) return toast.error("Carrinho vazio!");

        // VALIDAÇÃO RIGOROSA ANTES DE QUALQUER COISA
        if (metodo === 'CARTAO') {
            if (!formData.cardNumber || formData.cardNumber.length < 16) return toast.error("Número de cartão inválido!");
            if (!formData.cardExpiry || formData.cardExpiry.length < 5) return toast.error("Validade inválida!");
            if (!formData.cardCVV || formData.cardCVV.length < 3) return toast.error("CVV inválido!");
        }

        setLoading(true);

        try {
            const orderId = `LINA-${Math.floor(1000 + Math.random() * 9000)}`;

            // 1. CRIAMOS O PEDIDO (SEM OS DADOS SENSÍVEIS DO CARTÃO)
            const orderData = {
                orderId,
                userId: user ? user.uid : formData.email.toLowerCase(),
                customer: {
                    nome: formData.nome,
                    email: formData.email,
                    cpf: formData.cpf.replace(/\D/g, ""), // Salva apenas números
                    whatsapp: formData.whatsapp.replace(/\D/g, ""),
                    endereco: {
                        cep: formData.cep,
                        rua: formData.rua,
                        numero: formData.numero,
                        bairro: formData.bairro,
                        complemento: formData.complemento
                    }
                },
                items: cartItems,
                total: totalFinal,
                metodoPagamento: metodo,
                // AQUI É A SEGURANÇA: Salvamos apenas os 4 últimos dígitos se for cartão
                cardFinal: metodo === 'CARTAO' ? formData.cardNumber.slice(-4) : null,
                status: 'processando',
                createdAt: serverTimestamp()
            };

            // 2. ENVIAR PARA O FIREBASE
            await setDoc(doc(db, "orders", orderId), orderData);

            // 3. SE FOR CARTÃO, SIMULAMOS A TOKENIZAÇÃO (Onde entraria o Gateway)
            if (metodo === 'CARTAO') {
                await new Promise(res => setTimeout(res, 2000)); // Simulando criptografia JWT/Gateway
            }

            setLastOrder(orderData);
            setShowSuccess(true); // <--- AQUI SOLTA OS CONFETES!
            if (clearCart) clearCart();
            toast.success("Pagamento autorizado com sucesso!");

        } catch (error) {
            console.error("Security Error:", error);
            toast.error("Erro crítico de segurança. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    // const finalizarPedido = async (metodo) => {
    //     if (cartItems.length === 0) return toast.error("Carrinho vazio!");
    //     setLoading(true);
    //     try {
    //         const orderId = `LINA-${Math.floor(1000 + Math.random() * 9000)}`;
    //         const userId = user ? user.uid : formData.email.toLowerCase().trim();

    //         // SEGURANÇA: Salvar dados limpos (sem máscaras) no banco
    //         const secureData = {
    //             ...formData,
    //             cpf: formData.cpf.replace(/\D/g, ""),
    //             whatsapp: formData.whatsapp.replace(/\D/g, ""),
    //             cep: formData.cep.replace(/\D/g, ""),
    //             updatedAt: serverTimestamp()
    //         };

    //         await setDoc(doc(db, "users", userId), secureData, { merge: true });

    //         const orderData = {
    //             orderId, userId,
    //             customer: secureData,
    //             items: cartItems,
    //             subtotal: cartTotal,
    //             frete, total: totalFinal,
    //             deliveryType, paymentMethod: metodo,
    //             status: 'pendente',
    //             createdAt: new Date().toISOString()
    //         };

    //         await setDoc(doc(db, "orders", orderId), orderData);
    //         setLastOrder(orderData);
    //         setShowSuccess(true);
    //         if (clearCart) clearCart();
    //     } catch (error) { toast.error("Erro na transação."); } finally { setLoading(false); }
    // };

    const inputStyle = "w-full p-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-300 dark:border-white/10 rounded-2xl outline-none focus:border-linaclyn-red transition-all placeholder:text-zinc-500";

    return (
        <>
            <div className="max-w-2xl mx-auto p-4 min-h-screen bg-background text-foreground transition-colors duration-300">
                {/* Barra de Progresso */}
                <div className="flex justify-between mb-8 px-2">
                    {['Identificação', 'Endereço', 'Entrega', 'Pagamento'].map((label, i) => (
                        <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-500 ${i <= ['identification', 'address', 'shipping', 'payment'].indexOf(step) ? 'bg-linaclyn-red shadow-[0_0_10px_rgba(227,27,35,0.4)]' : 'bg-muted'}`} />
                    ))}
                </div>

                <div className="bg-card rounded-3xl p-6 shadow-xl border border-border/50 backdrop-blur-sm">
                    {/* STEP 1: IDENTIFICAÇÃO */}
                    {step === 'identification' && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                            <div className="text-center">
                                <h2 className="text-2xl font-black italic uppercase">LINA<span className="text-linaclyn-red">CLYN</span> CHECKOUT</h2>
                                <p className="text-muted-foreground text-sm">{user ? `Olá, ${formData.nome}!` : 'Identifique-se para continuar'}</p>
                            </div>
                            <div className="space-y-4">
                                <input type="email" placeholder="E-mail" className={inputStyle} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!!user} />
                                <input type="text" placeholder="Nome Completo" className={inputStyle} value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="CPF" className={inputStyle} value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })} />
                                    <input type="tel" placeholder="WhatsApp" className={inputStyle} value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })} />
                                </div>
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
                            <div className="grid grid-cols-4 gap-4">
                                <input type="text" placeholder="CEP" className={`${inputStyle} col-span-4`} value={formData.cep} onChange={(e) => { const v = formatCEP(e.target.value); setFormData({ ...formData, cep: v }); if (v.length === 9) checkCEP(v); }} />
                                <input type="text" placeholder="Rua" className={`${inputStyle} col-span-3`} value={formData.rua} onChange={(e) => setFormData({ ...formData, rua: e.target.value })} />
                                <input type="text" placeholder="Nº" className={inputStyle} value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} />
                                <input type="text" placeholder="Bairro" className={`${inputStyle} col-span-2`} value={formData.bairro} onChange={(e) => setFormData({ ...formData, bairro: e.target.value })} />
                                <input type="text" placeholder="Complemento" className={`${inputStyle} col-span-2`} value={formData.complemento} onChange={(e) => setFormData({ ...formData, complemento: e.target.value })} />
                                <input type="text" placeholder="Cidade" className={`${inputStyle} col-span-3`} value={formData.cidade} readOnly />
                                <input type="text" placeholder="UF" className={inputStyle} value={formData.uf} readOnly />
                            </div>
                            <button onClick={nextStep} className="w-full bg-linaclyn-red text-white p-5 rounded-2xl font-black uppercase hover:opacity-90 transition-all shadow-lg shadow-linaclyn-red/20">Confirmar Endereço</button>
                        </div>
                    )}

                    {/* ... STEPS 3 (Shipping) e 4 (Payment) seguem a mesma lógica visual do seu original ... */}
                    {/* (Omitidos aqui por brevidade, mas devem permanecer iguais no seu código para manter o estilo) */}

                    {/* STEP 3: ENTREGA (Manter como o seu) */}
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
                                            ${deliveryType === type.id ? 'border-linaclyn-red bg-linaclyn-red/5' : 'border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50'}`}>
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

                    {/* STEP 4: PAGAMENTO (Manter como o seu) */}
                    {step === 'payment' && (
                        <div className="space-y-6">
                            {(() => {
                                // PORTA FECHADA: Se estiver carregando o pedido final, 
                                // desmontamos tudo para evitar cliques duplos ou interceptação.
                                if (loading) {
                                    return (
                                        <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
                                            <ShieldCheck className="text-linaclyn-red animate-bounce" size={48} />
                                            <p className="font-black uppercase text-xs tracking-widest">Criptografando Transação...</p>
                                        </div>
                                    );
                                }

                                // JANELA 1: Escolha de Método (Só existe se nada mais estiver aberto)
                                if (!showCardForm && !showPixPayment) {
                                    return (
                                        <div className="space-y-6 text-center animate-in fade-in duration-500">
                                            <button onClick={prevStep} className="text-muted-foreground flex items-center gap-1 text-sm">
                                                <ChevronLeft size={16} /> Voltar
                                            </button>
                                            <div className="p-8 bg-zinc-100 dark:bg-zinc-900/50 rounded-3xl border border-border">
                                                <p className="text-muted-foreground text-xs font-black uppercase mb-1">Total Seguro</p>
                                                <h2 className="text-5xl font-black italic">R$ {totalFinal.toFixed(2)}</h2>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => setShowPixPayment(true)}
                                                    className="p-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-2xl font-black uppercase hover:scale-[1.02] transition-all"
                                                >
                                                    PIX
                                                </button>
                                                <button
                                                    onClick={() => setShowCardForm(true)}
                                                    className="p-5 border-2 border-zinc-900 dark:border-white rounded-2xl font-black uppercase hover:scale-[1.02] transition-all"
                                                >
                                                    CARTÃO
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }

                                // JANELA 2: PIX (Isolamento total de variáveis)
                                if (showPixPayment) {
                                    return (
                                        <PixSecurePayment
                                            total={totalFinal}
                                            orderId={`LINA-${Date.now()}`} // ID baseado em tempo real para unicidade
                                            inputStyle={inputStyle}
                                            loading={loading}
                                            onCancel={() => setShowPixPayment(false)}
                                            onConfirm={() => finalizarPedido('PIX')}
                                        />
                                    );
                                }

                                // JANELA 3: CARTÃO (Dados sensíveis morrem aqui)
                                if (showCardForm) {
                                    return (
                                        <CardSecureForm
                                            inputStyle={inputStyle}
                                            loading={loading}
                                            onCancel={() => setShowCardForm(false)}
                                            onConfirm={() => finalizarPedido('CARTAO')}
                                        />
                                    );
                                }
                            })()}
                        </div>
                    )}
                </div>
            </div>

            {showSuccess && lastOrder && (
                <SuccessModalIem orderData={lastOrder} onHighlightClose={() => { setShowSuccess(false); onNavigate('home'); }} />
            )}
        </>
    );
}