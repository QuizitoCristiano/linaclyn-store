import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, ArrowRight, LockKeyholeOpen, ChevronLeft, X, Eye, EyeOff } from "lucide-react";
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { toast } from 'sonner';

// ou salve um arquivo
export default function AuthPage({ onClose }) {
    const [view, setView] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    // Estados para mostrar/esconder senha
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Estados de Segurança
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimer, setLockTimer] = useState(0);

    const { login, register, loading, setLoading, resetPassword } = useAuth();

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

        if (view === 'forgot-password') {
            if (!email.includes("@")) return toast.error("Insira um e-mail válido!");
            setLoading(true);
            try {
                const sucesso = await resetPassword(email);
                if (sucesso) {
                    toast.success("E-mail de recuperação enviado!");
                    setView('login');
                }
            } finally {
                setLoading(false);
            }
            return;
        }

        if (isLocked) return toast.error(`Bloqueado! Aguarde ${lockTimer}s.`);

        if (view === 'register') {
            if (password !== confirmPassword) return toast.error("As senhas não coincidem!");
            if (password.length < 8) return toast.error("A senha deve ter no mínimo 8 caracteres.");
        }

        let sucesso = false;
        if (view === 'login') {
            sucesso = await login(email, password);
        } else if (view === 'register') {
            sucesso = await register(name, email, password);
        }

        if (sucesso) {
            toast.success("Acesso autorizado!");
            onClose();
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            if (newAttempts >= 3) {
                setIsLocked(true);
                setLockTimer(30);
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black p-4 relative overflow-hidden font-sans">
            {loading && <LoadingOverlay />}

            {/* Glow de fundo Imagin Maker */}
            <div className="absolute inset-0 opacity-20 bg-[#c8a24d] blur-[120px] pointer-events-none rounded-full w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <div className="z-10 w-full max-w-md bg-black/60 backdrop-blur-2xl border border-[#c8a24d]/20 rounded-3xl p-6 sm:p-10 animate-in fade-in zoom-in duration-300 shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                        IMAGIN<span className="text-[#c8a24d]">MAKER</span>
                    </h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mt-2">
                        {view === 'login' ? "Área de Acesso" : view === 'register' ? "Novo Registro" : "Recuperar Conta"}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {view === 'register' && (
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                            <input
                                type="text" required value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome completo"
                                className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 pl-12 text-white focus:border-[#c8a24d] outline-none transition-all"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                        <input
                            type="email" required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail"
                            className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 pl-12 text-white focus:border-[#c8a24d] outline-none transition-all"
                        />
                    </div>

                    {view !== 'forgot-password' && (
                        <div className="space-y-4">
                            {/* Input de Senha Principal */}
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Sua senha"
                                    className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 pl-12 text-white focus:border-[#c8a24d] outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#c8a24d] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {view === 'register' && (
                                <div className="relative">
                                    <LockKeyholeOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirmar senha"
                                        className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 pl-12 text-white focus:border-[#c8a24d] outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#c8a24d] transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'login' && (
                        <div className="flex justify-end">
                            <button type="button" onClick={() => setView('forgot-password')} className="text-[10px] text-zinc-500 hover:text-[#c8a24d] uppercase tracking-widest transition-colors">
                                Esqueceu a senha?
                            </button>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading || isLocked}
                        className={`w-full font-bold py-7 rounded-xl transition-all flex items-center justify-center gap-2 text-sm tracking-widest ${isLocked ? 'bg-zinc-800' : 'bg-[#c8a24d] hover:bg-[#b38f40] text-black shadow-[0_10px_20px_rgba(200,162,77,0.2)]'}`}
                    >
                        {isLocked ? `BLOQUEADO (${lockTimer}s)` : (
                            <>
                                {view === 'login' ? "ENTRAR" : view === 'register' ? "CRIAR CONTA" : "ENVIAR"}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <button
                        onClick={() => setView(view === 'login' ? 'register' : 'login')}
                        className="text-[11px] text-zinc-400 font-bold hover:text-[#c8a24d] transition-colors uppercase tracking-widest"
                    >
                        {view === 'login' ? "Ainda não é membro? Inscreva-se" : "Já tem conta? Faça Login"}
                    </button>
                </div>
            </div>
        </div>
    );
}