import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Search, Trash2, Tag, DollarSign, X, Sun, Moon } from 'lucide-react'; import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
export default function AdminDashboard({ onLogout }) {

    const { user } = useAuth();


    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Geral');
    const [searchTerm, setSearchTerm] = useState('');

    const [deletingId, setDeletingId] = useState(null);
    const [timeFilter, setTimeFilter] = useState('mes'); // Opções: 'dia', 'semana', 'mes', 'tudo'

    // Carregar despesas do LocalStorage ao abrir
    useEffect(() => {
        const saved = localStorage.getItem(`expenses_${user.email}`);
        if (saved) setExpenses(JSON.parse(saved));
    }, [user.email]);

    // Salvar sempre que a lista mudar
    useEffect(() => {
        localStorage.setItem(`expenses_${user.email}`, JSON.stringify(expenses));
    }, [expenses, user.email]);

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!description || !amount) return;

        const newExpense = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            category,
            date: new Date().toLocaleDateString('pt-BR')
        };

        setExpenses([newExpense, ...expenses]);
        setDescription('');
        setAmount('');
        toast.success("Despesa adicionada!");
    };

    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);



    const exportToExcel = () => {
        if (expenses.length === 0) {
            toast.error("Não há despesas para exportar!");
            return;
        }

        // Cabeçalho do CSV
        let csvContent = "Data,Descricao,Categoria,Valor (R$)\n";

        // Linhas de dados
        expenses.forEach(exp => {
            csvContent += `${exp.date},${exp.description},${exp.category},${exp.amount.toFixed(2)}\n`;
        });

        // Adiciona o Total no final
        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        csvContent += `\n,TOTAL,,${total.toFixed(2)}`;

        // Criar o arquivo e baixar
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-16;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `LinaClyn_Despesas_${new Date().getMonth() + 1}_2026.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Relatório Excel gerado!");
    };


    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exp.category.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Lógica de Datas
        const expDateParts = exp.date.split('/'); // Formato DD/MM/AAAA
        const expDate = new Date(expDateParts[2], expDateParts[1] - 1, expDateParts[0]);
        const today = new Date();

        if (timeFilter === 'dia') {
            return expDate.toDateString() === today.toDateString();
        }

        if (timeFilter === 'semana') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            return expDate >= sevenDaysAgo && expDate <= today;
        }

        if (timeFilter === 'mes') {
            return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
        }

        return true; // Para 'tudo'
    });


    const clearFilters = () => {
        setSearchTerm('');
        setTimeFilter('mes'); // Volta para o padrão mensal
        toast.info("Filtros limpos!");
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 p-4 sm:p-8 font-sans transition-colors duration-300">

            {/* Header Principal - Mais Limpo */}
            <div className="max-w-5xl mx-auto flex justify-between items-center mb-10 border-b border-slate-100 dark:border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter">
                        LINA<span className="text-linaclyn-red">CLYN</span>
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                        Performance Control • 2026
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold leading-none">{user.name || 'Atleta'}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">{user.email}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-red-500/10 rounded-xl transition-all border border-slate-200 dark:border-white/5 text-slate-400 hover:text-red-500"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Coluna 1: Entrada de Dados e Resumo (4 colunas) */}
                <div className="md:col-span-4 space-y-6">

                    {/* Card de Formulário Moderno */}
                    <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm backdrop-blur-md">
                        <h2 className="text-[10px] font-black mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                            <Plus className="text-linaclyn-red w-3.5 h-3.5" /> Nova Despesa
                        </h2>
                        <form onSubmit={handleAddExpense} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Descrição"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-linaclyn-red/20 focus:border-linaclyn-red transition-all text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Valor R$"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-linaclyn-red/20 focus:border-linaclyn-red transition-all text-sm font-bold"
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3.5 outline-none focus:border-linaclyn-red transition-all text-sm"
                            >
                                <option value="Geral">Geral</option>
                                <option value="Saúde">Saúde/Suplementos</option>
                                <option value="Fixo">Gastos Fixos</option>
                                <option value="Treino">Equipamentos/Treino</option>
                            </select>
                            <button className="w-full bg-linaclyn-red hover:bg-red-600 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/10 active:scale-[0.98]">
                                Adicionar Registro
                            </button>
                        </form>
                    </div>

                    {/* Resumo Financeiro - Mais "Tech" */}
                    <div className="space-y-3">
                        <div className="bg-slate-900 dark:bg-linaclyn-red p-6 rounded-2xl shadow-xl relative overflow-hidden group transition-all">
                            <div className="absolute -right-4 -top-4 bg-white/5 w-24 h-24 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                            <p className="text-white/60 dark:text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">Total Filtrado</p>
                            <h3 className="text-3xl font-black italic mt-1 text-white">
                                R$ {filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>

                        <button
                            onClick={exportToExcel}
                            className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-700 active:scale-[0.98] shadow-sm"
                        >
                            <DollarSign className="w-4 h-4" />
                            Exportar Relatório
                        </button>
                    </div>
                </div>

                {/* Coluna 2: Filtros e Histórico (8 colunas) */}
                <div className="md:col-span-8 space-y-6">

                    {/* Toolbar de Filtros - Minimalista */}
                    <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 p-3 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex gap-1 bg-white dark:bg-black p-1 rounded-xl border border-slate-200 dark:border-white/5 w-full sm:w-auto">
                            {['dia', 'semana', 'mes', 'tudo'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setTimeFilter(p)}
                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${timeFilter === p ? 'bg-linaclyn-red text-white shadow-md shadow-red-500/20' : 'text-slate-400 dark:text-zinc-500 hover:text-linaclyn-red'}`}
                                >
                                    {p === 'dia' ? 'Hoje' : p}
                                </button>
                            ))}
                        </div>

                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Filtrar por nome ou categoria..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-linaclyn-red transition-all"
                            />
                        </div>
                    </div>

                    {/* Lista de Itens - Cards mais leves */}
                    <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                        {filteredExpenses.length === 0 ? (
                            <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
                                <p className="text-slate-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-xs">Nenhum dado encontrado</p>
                            </div>
                        ) : (
                            filteredExpenses.map(exp => (
                                <div key={exp.id} className="group bg-white dark:bg-zinc-900/30 border border-slate-100 dark:border-white/5 p-4 rounded-2xl flex justify-between items-center hover:shadow-lg hover:shadow-black/5 dark:hover:border-white/10 transition-all relative">

                                    {/* Overlay de Exclusão Corrigido */}
                                    {deletingId === exp.id && (
                                        <div className="absolute inset-0 bg-red-500 text-white rounded-2xl flex items-center justify-between px-6 z-20 animate-in fade-in zoom-in duration-200">
                                            <p className="font-bold text-xs uppercase tracking-widest">Remover despesa?</p>
                                            <div className="flex gap-4">
                                                <button onClick={() => setDeletingId(null)} className="text-[10px] font-black uppercase">Cancelar</button>
                                                <button
                                                    onClick={() => {
                                                        setExpenses(expenses.filter(e => e.id !== exp.id));
                                                        setDeletingId(null);
                                                        toast.error("Item excluído.");
                                                    }}
                                                    className="bg-white text-red-500 px-4 py-2 rounded-lg font-black text-[10px] uppercase shadow-md"
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 dark:bg-black p-3 rounded-xl text-slate-400 dark:text-linaclyn-red group-hover:scale-110 transition-transform">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 dark:text-zinc-200">{exp.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] bg-slate-200 dark:bg-white/5 px-2 py-0.5 rounded text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-tighter">{exp.category}</span>
                                                <span className="text-[9px] text-slate-400 dark:text-zinc-600 font-medium">{exp.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="font-black text-lg text-slate-900 dark:text-white">R$ {exp.amount.toFixed(2)}</p>
                                        <button
                                            onClick={() => setDeletingId(exp.id)}
                                            className="text-slate-300 dark:text-zinc-700 hover:text-red-500 transition-colors"
                                        >
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