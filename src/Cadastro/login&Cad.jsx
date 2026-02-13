import React, { useState, useEffect } from 'react'; // Adicionado useEffect aqui
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, ArrowRight, LockKeyholeOpen, ChevronLeft, X } from "lucide-react";
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { toast } from 'sonner';

export default function AuthPage({ onClose }) {
    const [view, setView] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Novo estado para confirmação de senha
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);





    const [name, setName] = useState('');

    // Estados de Segurança
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimer, setLockTimer] = useState(0);

    const { login, register, loading, setLoading, resetPassword } = useAuth();

    // Lógica do Cronômetro de Bloqueio
    useEffect(() => {
        let timer;
        if (isLocked && lockTimer > 0) {
            timer = setInterval(() => {
                setLockTimer((prev) => prev - 1);
            }, 1000);
        } else if (lockTimer === 0) {
            setIsLocked(false);
            setAttempts(0);
        }
        return () => clearInterval(timer);
    }, [isLocked, lockTimer]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // LÓGICA REAL DE RECUPERAÇÃO DE SENHA

        // 1. LÓGICA REAL DE RECUPERAÇÃO DE SENHA (Mantenha esta)
        if (view === 'forgot-password') {
            if (!email.includes("@")) {
                toast.error("Insira um e-mail válido!");
                return;
            }

            setLoading(true);
            try {
                const sucesso = await resetPassword(email);
                if (sucesso) {
                    toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
                    setView('login');
                } else {
                    toast.error("Erro ao enviar e-mail. Verifique se o endereço está correto.");
                }
            } catch (error) {
                toast.error("Ocorreu um erro inesperado.");
            } finally {
                setLoading(false);
            }
            return;
        }


        if (isLocked) {
            toast.error(`Acesso bloqueado! Aguarde ${lockTimer}s.`);
            return;
        }


        // 1. Validação de E-mail
        if (!email.includes("@")) {
            toast.error("Insira um e-mail válido!");
            return;
        }

        // 2. Validações exclusivas de Registro (Cadastro)
        if (view === 'register') {
            if (password !== confirmPassword) {
                toast.error("As senhas não coincidem!");
                return;
            }

            // Regra: Mínimo 8 caracteres e pelo menos 1 número
            const basicSecurity = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
            if (!basicSecurity.test(password)) {
                toast.error("Senha muito simples! Use 8 caracteres e inclua pelo menos um número.");
                return;
            }
        }
        // 3. Tentativa de Autenticação





        let sucesso = false;
        if (view === 'login') {
            sucesso = await login(email, password);
        } else if (view === 'register') {
            sucesso = await register(name, email, password);
        }

        if (sucesso) {
            setAttempts(0);
            toast.success("Bem-vindo à LinaClyn!");
            onClose();
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= 3) {
                setIsLocked(true);
                setLockTimer(30);
                toast.error("Muitas tentativas! Bloqueado por 30 segundos.");
            } else {
                toast.error(`Dados incorretos! Tentativa ${newAttempts} de 3.`);
            }
        }
    };


    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black p-4 relative overflow-hidden">
            {loading && <LoadingOverlay />}

            <div className="absolute inset-0 opacity-40 bg-linaclyn-carousel blur-[80px] sm:blur-[120px] pointer-events-none" />

            <button
                onClick={() => onClose()}
                className="absolute top-6 right-6 z-50 p-2 text-white/50 hover:text-white transition-colors"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="z-10 w-full max-w-md bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-10 animate-scale-in shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase italic">
                        LINA<span className="text-linaclyn-red">CLYN</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {view === 'login' && "Domine sua performance."}
                        {view === 'register' && "Junte-se ao time LinaClyn."}
                        {view === 'forgot-password' && "Recupere seu acesso."}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* NOME: Só aparece no Registro */}
                    {view === 'register' && (
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-linaclyn-red transition-colors" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome completo"
                                className="w-full bg-black/40 border-2 border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-linaclyn-red transition-all"
                            />
                        </div>
                    )}

                    {/* E-MAIL: Sempre aparece */}
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-linaclyn-red transition-colors" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu melhor e-mail"
                            className="w-full bg-black/40 border-2 border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-linaclyn-red transition-all"
                        />
                    </div>

                    {/* BOTÃO ESQUECI SENHA: Só no Login */}
                    {view === 'login' && (
                        <div className="flex justify-end mt-1">
                            <button
                                type="button"
                                onClick={() => setView('forgot-password')}
                                className="text-xs text-muted-foreground hover:text-linaclyn-red transition-colors font-medium"
                            >
                                Esqueceu a senha?
                            </button>
                        </div>
                    )}

                    {/* CAMPOS DE SENHA: Só aparecem se NÃO for recuperação */}
                    {view !== 'forgot-password' && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Senha Principal */}
                            <div className="relative group flex-1">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-muted-foreground group-focus-within:text-linaclyn-red transition-colors"
                                >
                                    {showPassword ? <LockKeyholeOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                </button>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Sua senha"
                                    className="w-full bg-black/40 border-2 border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-linaclyn-red transition-all placeholder:text-gray-500"
                                />
                            </div>

                            {/* Confirmar Senha */}
                            {view === 'register' && (
                                <div className="relative group flex-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-muted-foreground group-focus-within:text-linaclyn-red transition-colors"
                                    >
                                        {showConfirmPassword ? <LockKeyholeOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                    </button>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirmar"
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-linaclyn-red transition-all placeholder:text-gray-500"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* BOTÃO PRINCIPAL DINÂMICO */}
                    <Button
                        type="submit"
                        disabled={loading || isLocked}
                        className={`w-full font-black py-7 rounded-xl transition-all flex items-center justify-center gap-2 text-base ${isLocked ? 'bg-gray-800' : 'bg-linaclyn-red hover:bg-linaclyn-red-dark text-white'}`}
                    >
                        {isLocked ? `BLOQUEADO (${lockTimer}s)` : (
                            <>
                                {view === 'login' && "ENTRAR"}
                                {view === 'register' && "CRIAR CONTA"}
                                {view === 'forgot-password' && "ENVIAR INSTRUÇÕES"}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center border-t border-white/10 pt-6">
                    <button
                        onClick={() => setView(view === 'login' || view === 'forgot-password' ? 'register' : 'login')}
                        className="text-white font-bold hover:text-linaclyn-red transition-colors underline"
                    >
                        {view === 'login' && "Ainda não é membro? Inscreva-se"}
                        {view === 'register' && "Já tem conta? Faça Login"}
                        {view === 'forgot-password' && "Lembrou a senha? Voltar ao login"}
                    </button>
                </div>
            </div>
        </div>
    );
}