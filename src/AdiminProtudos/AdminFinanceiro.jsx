import React, { useState, useEffect } from 'react';
import { db } from "@/services/config";
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from "firebase/firestore";
import { toast } from 'sonner';
import { DollarSign, TrendingDown, TrendingUp, Plus, ReceiptText } from 'lucide-react';

export default function AdminFinanceiro() {
    const [expenses, setExpenses] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados do Formulário
    const [desc, setDesc] = useState('');
    const [val, setVal] = useState('');
    const [cat, setCat] = useState('Estoque');

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            // 1. Busca Gastos
            const qExp = query(collection(db, "expenses"),
                where("month", "==", currentMonth),
                where("year", "==", currentYear),
                orderBy("createdAt", "desc"));
            const resExp = await getDocs(qExp);
            setExpenses(resExp.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // 2. Busca Vendas (Vem lá do seu CheckoutRouter!)
            const qSales = query(collection(db, "orders"),
                where("month", "==", currentMonth),
                where("year", "==", currentYear));
            const resSales = await getDocs(qSales);
            setSales(resSales.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!desc || !val) return toast.error("Preencha todos os campos!");

        try {
            await addDoc(collection(db, "expenses"), {
                description: desc,
                value: parseFloat(val),
                category: cat,
                month: currentMonth,
                year: currentYear,
                createdAt: serverTimestamp()
            });
            toast.success("Gasto lançado com sucesso!");
            setDesc(''); setVal('');
            fetchFinanceData(); // Atualiza a planilha
        } catch (error) {
            toast.error("Erro ao salvar.");
        }
    };

    const totalSales = sales.reduce((acc, curr) => acc + curr.total, 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0);
    const profit = totalSales - totalExpenses;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-black italic uppercase">Financeiro <span className="text-linaclyn-red">LinaClyn</span></h1>

            {/* CARDS DE RESUMO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-3xl border border-border shadow-lg">
                    <div className="flex items-center gap-4 text-green-500 mb-2">
                        <TrendingUp size={24} /> <span className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Vendas (Mês)</span>
                    </div>
                    <p className="text-3xl font-black">R$ {totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-card p-6 rounded-3xl border border-border shadow-lg">
                    <div className="flex items-center gap-4 text-linaclyn-red mb-2">
                        <TrendingDown size={24} /> <span className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Gastos (Mês)</span>
                    </div>
                    <p className="text-3xl font-black">R$ {totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-card p-6 rounded-3xl border-2 border-linaclyn-red shadow-[0_0_20px_rgba(255,0,0,0.1)]">
                    <div className="flex items-center gap-4 text-white mb-2">
                        <DollarSign size={24} className="bg-linaclyn-red rounded-full p-1" />
                        <span className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Saldo Real</span>
                    </div>
                    <p className={`text-3xl font-black ${profit >= 0 ? 'text-white' : 'text-linaclyn-red'}`}>R$ {profit.toFixed(2)}</p>
                </div>
            </div>

            {/* FORMULÁRIO DE LANÇAMENTO */}
            <div className="bg-card p-8 rounded-3xl border border-border">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20} className="text-linaclyn-red" /> Lançar Novo Gasto</h2>
                <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="Descrição (Ex: Aluguel)" className="p-4 bg-secondary rounded-2xl outline-none border border-transparent focus:border-linaclyn-red transition-all" value={desc} onChange={e => setDesc(e.target.value)} />
                    <input type="number" placeholder="Valor (R$)" className="p-4 bg-secondary rounded-2xl outline-none" value={val} onChange={e => setVal(e.target.value)} />
                    <select className="p-4 bg-secondary rounded-2xl outline-none" value={cat} onChange={e => setCat(e.target.value)}>
                        <option value="Estoque">Estoque (Produtos)</option>
                        <option value="Marketing">Marketing (Ads/Leads)</option>
                        <option value="Servidores">Firebase/Hospedagem</option>
                        <option value="Retirada">Pro-labore/Pessoal</option>
                        <option value="Outros">Outros</option>
                    </select>
                    <button type="submit" className="bg-linaclyn-red text-white font-black rounded-2xl hover:opacity-90 transition-all uppercase">Lançar</button>
                </form>
            </div>

            {/* LISTAGEM - A "PLANILHA" */}
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-secondary/50 text-xs uppercase font-bold text-muted-foreground">
                        <tr>
                            <th className="p-4">Descrição</th>
                            <th className="p-4">Categoria</th>
                            <th className="p-4 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {expenses.map(exp => (
                            <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium">{exp.description}</td>
                                <td className="p-4"><span className="text-xs bg-secondary px-2 py-1 rounded-full">{exp.category}</span></td>
                                <td className="p-4 text-right font-bold text-linaclyn-red">- R$ {exp.value.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}