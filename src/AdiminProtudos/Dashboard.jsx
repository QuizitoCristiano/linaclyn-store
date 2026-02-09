import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, Plus, Search, Trash2, Tag, DollarSign, X, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard({ onLogout }) {
    const { user } = useAuth();

    // Estados
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Geral');
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [timeFilter, setTimeFilter] = useState('mes');

    // 1. Carregar dados (Persistência por E-mail do Usuário)
    useEffect(() => {
        if (user?.email) {
            const saved = localStorage.getItem(`expenses_${user.email}`);
            if (saved) setExpenses(JSON.parse(saved));
        }
    }, [user?.email]);

    // 2. Salvar dados automaticamente
    useEffect(() => {
        if (user?.email) {
            localStorage.setItem(`expenses_${user.email}`, JSON.stringify(expenses));
        }
    }, [expenses, user?.email]);

    // 3. Adicionar Despesa com Validação
    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!description || !amount || parseFloat(amount) <= 0) {
            toast.error("Preencha a descrição e um valor válido!");
            return;
        }

        const newExpense = {
            id: Date.now(),
            description: description.trim(),
            amount: parseFloat(amount),
            category,
            date: new Date().toLocaleDateString('pt-BR')
        };

        setExpenses(prev => [newExpense, ...prev]);
        setDescription('');
        setAmount('');
        toast.success("Registro adicionado com sucesso!");
    };

    // 4. Lógica de Filtro Inteligente (Performance otimizada com useMemo)
    const filteredExpenses = useMemo(() => {
        return expenses.filter(exp => {
            const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exp.category.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            const [day, month, year] = exp.date.split('/').map(Number);
            const expDate = new Date(year, month - 1, day);
            const today = new Date();

            // Zerar horas para comparação justa
            today.setHours(0, 0, 0, 0);
            expDate.setHours(0, 0, 0, 0);

            if (timeFilter === 'dia') return expDate.getTime() === today.getTime();

            if (timeFilter === 'semana') {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                return expDate >= sevenDaysAgo && expDate <= today;
            }

            if (timeFilter === 'mes') {
                return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
            }

            return true; // tudo
        });
    }, [expenses, searchTerm, timeFilter]);

    // 5. Cálculo do Total Filtrado
    const totalFiltrado = useMemo(() => {
        return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    }, [filteredExpenses]);

    // 6. Exportação para CSV (Excel)
    const exportToExcel = () => {
        if (filteredExpenses.length === 0) {
            toast.error("Nada para exportar neste filtro!");
            return;
        }

        let csvContent = "\uFEFFData,Descricao,Categoria,Valor (R$)\n"; // \uFEFF para Excel ler acentos
        filteredExpenses.forEach(exp => {
            csvContent += `${exp.date},${exp.description},${exp.category},${exp.amount.toFixed(2).replace('.', ',')}\n`;
        });

        csvContent += `\n,TOTAL FILTRADO,,${totalFiltrado.toFixed(2).replace('.', ',')}`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `LinaClyn_Relatorio_${timeFilter}_2026.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Relatório gerado!");
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 p-4 sm:p-8 transition-colors duration-300">
            {/* Header */}
            <div className="max-w-5xl mx-auto flex justify-between items-center mb-10 border-b border-slate-100 dark:border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase">
                        LINA<span className="text-red-600">CLYN</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Performance Control • 2026</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold">{user?.name || 'Administrador'}</p>
                        <p className="text-[10px] text-slate-400">{user?.email}</p>
                    </div>
                    <button onClick={onLogout} className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-red-500/10 rounded-xl transition-all border dark:border-white/5 text-slate-400 hover:text-red-500">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Lateral Esquerda: Input */}
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm">
                        <h2 className="text-[10px] font-black mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400">
                            <Plus className="text-red-600 w-3.5 h-3.5" /> Nova Despesa
                        </h2>
                        <form onSubmit={handleAddExpense} className="space-y-4">
                            <input
                                type="text" placeholder="Ex: Suplementos, Energia..."
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white dark:bg-black border dark:border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-red-600"
                            />
                            <input
                                type="number" step="0.01" placeholder="Valor R$"
                                value={amount} onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white dark:bg-black border dark:border-white/10 rounded-xl p-3.5 text-sm font-bold outline-none focus:border-red-600"
                            />
                            <select
                                value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white dark:bg-black border dark:border-white/10 rounded-xl p-3.5 text-sm outline-none"
                            >
                                <option value="Geral">Geral</option>
                                <option value="Saúde">Saúde/Suplementos</option>
                                <option value="Fixo">Gastos Fixos</option>
                                <option value="Treino">Equipamentos/Treino</option>
                            </select>
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">
                                Salvar Registro
                            </button>
                        </form>
                    </div>

                    {/* Resumo Card */}
                    <div className="bg-red-600 p-6 rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.4)] relative overflow-hidden transition-all border border-red-500">
                        <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                            Total Filtrado
                        </p>
                        <h3 className="text-3xl font-black italic mt-1 text-white drop-shadow-md">
                            R$ {totalFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        {/* Detalhe de brilho interno */}
                        <div className="absolute -right-2 -top-2 w-16 h-16 bg-white/10 rounded-full blur-2xl" />
                    </div>

                    <button onClick={exportToExcel} className="w-full bg-white dark:bg-zinc-800 border dark:border-zinc-700 py-3.5 rounded-xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-slate-50">
                        <DollarSign className="w-4 h-4" /> Exportar CSV
                    </button>
                </div>

                {/* Direita: Lista */}
                <div className="md:col-span-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-zinc-900/40 p-3 rounded-2xl border dark:border-white/10">
                        <div className="flex gap-1 bg-white dark:bg-black p-1 rounded-xl border dark:border-white/5">
                            {['dia', 'semana', 'mes', 'tudo'].map((f) => (
                                <button
                                    key={f} onClick={() => setTimeFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${timeFilter === f ? 'bg-red-600 text-white' : 'text-slate-400'}`}
                                >
                                    {f === 'dia' ? 'Hoje' : f}
                                </button>
                            ))}
                        </div>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text" placeholder="Buscar..."
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-black border dark:border-white/10 rounded-xl py-2 pl-10 text-xs outline-none focus:border-red-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredExpenses.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed dark:border-white/5 rounded-3xl opacity-40">
                                <p className="text-xs font-bold uppercase tracking-widest">Sem registros</p>
                            </div>
                        ) : (
                            filteredExpenses.map(exp => (
                                <div key={exp.id} className="group bg-white dark:bg-zinc-900/30 border dark:border-white/5 p-4 rounded-2xl flex justify-between items-center hover:border-red-600/30 transition-all relative">
                                    {deletingId === exp.id ? (
                                        <div className="absolute inset-0 bg-red-600 text-white rounded-2xl flex items-center justify-between px-6 z-20 animate-in fade-in duration-200">
                                            <p className="font-bold text-[10px] uppercase">Confirmar exclusão?</p>
                                            <div className="flex gap-4">
                                                <button onClick={() => setDeletingId(null)} className="text-[10px] font-black uppercase">Não</button>
                                                <button onClick={() => {
                                                    setExpenses(prev => prev.filter(e => e.id !== exp.id));
                                                    setDeletingId(null);
                                                    toast.error("Removido.");
                                                }} className="bg-white text-red-600 px-4 py-2 rounded-lg font-black text-[10px] uppercase">Sim, apagar</button>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 dark:bg-black p-3 rounded-xl text-red-600">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{exp.description}</p>
                                            <div className="flex gap-2 text-[9px] font-bold uppercase text-slate-500">
                                                <span className="text-red-500/80">{exp.category}</span>
                                                <span>•</span>
                                                <span>{exp.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-black text-sm">R$ {exp.amount.toFixed(2)}</p>
                                        <button onClick={() => setDeletingId(exp.id)} className="text-slate-300 hover:text-red-600 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}