import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutEntrega({ total, onFinalize }) {
    const [formData, setFormData] = useState({
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
    });

    // Máscara de CEP automática
    const handleCepChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length <= 8) {
            value = value.replace(/(\={5})(\d)/, "$1-$2");
            setFormData({ ...formData, cep: value });
        }

        // Simulação: Se CEP tiver 8 dígitos, poderíamos buscar na API ViaCEP
        if (value.length === 8) {
            toast.info("Buscando endereço...");
            // Aqui entraria a lógica de fetch para preencher rua e bairro automaticamente
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.cep || !formData.rua || !formData.numero) {
            toast.error("Por favor, preencha os campos obrigatórios!");
            return;
        }

        toast.success("Endereço confirmado! Seguindo para o pagamento.");
        onFinalize(formData);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-white/10 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-linaclyn-red p-3 rounded-2xl">
                    <Truck className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Entrega</h2>
                    <p className="text-sm text-muted-foreground">Onde você quer receber seus produtos LinaClyn?</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CEP */}
                <div className="md:col-span-1">
                    <label className="text-xs font-bold uppercase mb-1 block dark:text-gray-400">CEP*</label>
                    <input
                        type="text"
                        value={formData.cep}
                        onChange={handleCepChange}
                        placeholder="00000-000"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-white outline-none focus:border-linaclyn-red transition-all"
                    />
                </div>

                {/* Rua */}
                <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase mb-1 block dark:text-gray-400">Rua/Avenida*</label>
                    <input
                        type="text"
                        value={formData.rua}
                        onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-white outline-none focus:border-linaclyn-red transition-all"
                    />
                </div>

                {/* Numero e Complemento */}
                <div className="md:col-span-1">
                    <label className="text-xs font-bold uppercase mb-1 block dark:text-gray-400">Número*</label>
                    <input
                        type="text"
                        value={formData.numero}
                        onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-white outline-none focus:border-linaclyn-red transition-all"
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="text-xs font-bold uppercase mb-1 block dark:text-gray-400">Complemento</label>
                    <input
                        type="text"
                        value={formData.complemento}
                        onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-white outline-none focus:border-linaclyn-red transition-all"
                    />
                </div>

                {/* Bairro e Cidade */}
                <div className="md:col-span-1">
                    <label className="text-xs font-bold uppercase mb-1 block dark:text-gray-400">Bairro*</label>
                    <input
                        type="text"
                        value={formData.bairro}
                        onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-white outline-none focus:border-linaclyn-red transition-all"
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="text-xs font-bold uppercase mb-1 block dark:text-gray-400">Cidade*</label>
                    <input
                        type="text"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-white outline-none focus:border-linaclyn-red transition-all"
                    />
                </div>

                <div className="md:col-span-2 mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-green-500">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Checkout Seguro</span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Total com Frete</p>
                            <p className="text-3xl font-black text-linaclyn-red italic">R$ {total}</p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-linaclyn-red hover:bg-linaclyn-red-dark text-white font-black py-8 rounded-2xl flex items-center justify-center gap-3 group transition-all"
                    >
                        CONFIRMAR E PAGAR
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Button>
                </div>
            </form>
        </div>
    );
}