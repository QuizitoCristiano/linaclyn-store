import React, { useState, useMemo, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import {
    Search, Filter, ShoppingCart, Clock, CheckCircle2, XCircle,
    Truck, Eye, Download, Printer, Wallet, CreditCard, Banknote, QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModalDetalhesPedido } from "./ModalDetalhesPedido";
import { ModalImpressaoPedido } from "./ModalImpressaoPedido";
import { db } from "@/services/config";

export default function AdminPedidos() {
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("TODOS STATUS");
    const [filtroPagamento, setFiltroPagamento] = useState("TODOS PAGAMENTOS");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalPrintOpen, setIsModalPrintOpen] = useState(false);
    const [pedidoParaImprimir, setPedidoParaImprimir] = useState(null);

    const abrirResumo = (pedido) => {
        setPedidoSelecionado(pedido);
        setIsModalOpen(true);
    };

    const abrirImpressao = (pedido) => {
        setPedidoParaImprimir(pedido);
        setIsModalPrintOpen(true);
    };

    // --- CONEXÃO REAL COM O BANCO DE DADOS ---
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const dadosPedidos = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    data: data.createdAt?.toDate().toLocaleDateString('pt-BR') || "Recentemente",
                    cliente: data.customer?.nome || "Cliente",
                    metodo: data.metodoPagamento?.toUpperCase() || "PIX",
                    items: data.items?.length || 0,
                    total: Number(data.total || 0),
                    status: data.status?.toUpperCase() || "PENDENTE"
                };
            });
            setPedidos(dadosPedidos);
            setLoading(false);
        }, (error) => {
            console.error("Erro ao ler pedidos:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (id, novoStatus) => {
        try {
            const pedidoRef = doc(db, "orders", id);
            await updateDoc(pedidoRef, {
                status: novoStatus.toLowerCase(),
                updatedAt: new Date()
            });

            // Registro automático de despesa LinaClyn 2026
            if (novoStatus === 'ENVIADO') {
                const pedido = pedidos.find(p => p.id === id);
                const custoFrete = 25.00;
                const taxaProcessamento = (pedido.total * 0.02);
                const totalGasto = custoFrete + taxaProcessamento;
                console.log(`📊 LANÇAMENTO: Pedido ${id} enviado. Custo Logístico: R$ ${totalGasto.toFixed(2)}`);
            }
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };

    // --- MÉTRICAS REAIS (Calculadas automaticamente) ---
    // --- MÉTRICAS REAIS (Calculadas automaticamente) ---
    const metricasCalculadas = useMemo(() => {
        const stats = {
            totalFaturamento: 0, // Mudei de 'total' para 'totalFaturamento'
            pix: 0,
            cartao: 0,
            cancelados: 0
        };

        pedidos.forEach(p => {
            const valor = Number(p.total || 0);
            const status = p.status?.toUpperCase();
            const metodo = p.metodo?.toUpperCase();

            if (status !== 'CANCELADO') {
                stats.totalFaturamento += valor;
                if (metodo === 'PIX') stats.pix += valor;
                // Verificação para CRÉDITO ou CARTÃO
                if (metodo === 'CRÉDITO' || metodo === 'CREDITO' || metodo === 'CARTAO') stats.cartao += valor;
            } else {
                stats.cancelados += valor;
            }
        });

        return stats;
    }, [pedidos]);

    const statusConfig = {
        PAGO: { color: "text-green-500", bg: "bg-green-500/5", border: "border-green-500/20", icon: CheckCircle2 },
        PENDENTE: { color: "text-yellow-500", bg: "bg-yellow-500/5", border: "border-yellow-500/20", icon: Clock },
        ENVIADO: { color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/20", icon: Truck },
        CANCELADO: { color: "text-red-600", bg: "bg-red-600/5", border: "border-red-600/20", icon: XCircle },
    };

    const pagamentoConfig = {
        PIX: { icon: QrCode, label: "PIX" },
        CRÉDITO: { icon: CreditCard, label: "Cartão" },
        CARTAO: { icon: CreditCard, label: "Cartão" },
        PARCELADO: { icon: Wallet, label: "Parcelado" },
        DINHEIRO: { icon: Banknote, label: "Dinheiro" },
    };

    const pedidosFiltrados = useMemo(() => {
        return pedidos.filter(p => {
            const matchBusca = p.cliente.toLowerCase().includes(busca.toLowerCase()) || p.id.includes(busca);
            const matchStatus = filtroStatus === "TODOS STATUS" || p.status === filtroStatus;
            const matchPagamento = filtroPagamento === "TODOS PAGAMENTOS" || p.metodo === filtroPagamento;
            return matchBusca && matchStatus && matchPagamento;
        });
    }, [busca, filtroStatus, filtroPagamento, pedidos]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0c0c0c] text-zinc-900 dark:text-zinc-200 p-4 md:p-8 pt-20 md:pt-24 font-sans transition-colors duration-300 overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Original */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                            GESTÃO DE <span className="text-red-600">PEDIDOS</span>
                        </h1>
                        <p className="text-zinc-400 dark:text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase mt-3 tracking-[0.2em]">
                            Finance Tracking • Jan 2026
                        </p>
                    </div>
                    <Button
                        onClick={() => window.print()}
                        className="w-full md:w-auto bg-zinc-900 dark:bg-zinc-800 text-white font-black rounded-xl h-14 px-8 italic text-[11px] uppercase border border-zinc-700/50 hover:bg-zinc-700 transition-all"
                    >
                        <Printer className="w-4 h-4 mr-2" /> Gerar Relatório
                    </Button>
                </div>

                {/* Cards de Métricas Originais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Faturamento Bruto",
                            value: metricasCalculadas.totalFaturamento,
                            icon: ShoppingCart,
                            color: "text-red-600"
                        },
                        {
                            label: "Entrada via PIX",
                            value: metricasCalculadas.pix,
                            icon: QrCode,
                            color: "text-green-500"
                        },
                        {
                            label: "A Receber (Crédito)",
                            value: metricasCalculadas.cartao,
                            icon: CreditCard,
                            color: "text-blue-500"
                        },
                        {
                            label: "Cancelados",
                            value: metricasCalculadas.cancelados,
                            icon: XCircle,
                            color: "text-zinc-400"
                        }
                    ].map((card, i) => (
                        <div key={i} className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800/40 p-6 rounded-[2rem] shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className="text-xl font-black italic tracking-tighter">
                                    {/* Formatação automática para moeda Real */}
                                    {card.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                            <card.icon className={`w-8 h-8 ${card.color} opacity-30`} />
                        </div>
                    ))}
                </div>

                {/* Filtros Inteligentes Originais */}
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative w-full flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                        <input
                            placeholder="BUSCAR CLIENTE OU NÚMERO DO PEDIDO..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full pl-14 h-14 md:h-16 rounded-2xl font-bold uppercase text-[11px] border border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-[#161616] text-zinc-900 dark:text-white outline-none focus:ring-1 focus:ring-red-600/50"
                        />
                    </div>

                    <div className="flex w-full lg:w-auto gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex-1 lg:flex-none h-14 md:h-16 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#161616] font-black gap-3 text-xs uppercase text-zinc-500">
                                    <Filter className="w-4 h-4" /> {filtroStatus}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white dark:bg-[#1a1a1a] border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl">
                                {["TODOS STATUS", "PAGO", "PENDENTE", "ENVIADO", "CANCELADO"].map(s => (
                                    <DropdownMenuItem key={s} onClick={() => setFiltroStatus(s)} className="p-3 font-bold text-[10px] uppercase cursor-pointer focus:bg-red-600/10 tracking-widest">{s}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex-1 lg:flex-none h-14 md:h-16 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#161616] font-black gap-3 text-xs uppercase text-zinc-500">
                                    <Wallet className="w-4 h-4" /> {filtroPagamento}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white dark:bg-[#1a1a1a] border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl">
                                {["TODOS PAGAMENTOS", "PIX", "CRÉDITO", "PARCELADO", "DINHEIRO"].map(m => (
                                    <DropdownMenuItem key={m} onClick={() => setFiltroPagamento(m)} className="p-3 font-bold text-[10px] uppercase cursor-pointer focus:bg-red-600/10 tracking-widest">{m}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Tabela de Pedidos Original */}
                <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800/40 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-xl dark:shadow-2xl">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-800/30">
                                    <th className="p-10">ID/CLIENTE</th>
                                    <th className="p-10">PAGAMENTO</th>
                                    <th className="p-10">DATA</th>
                                    <th className="p-10 text-center">STATUS</th>
                                    <th className="p-10">TOTAL</th>
                                    <th className="p-10 text-right">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/20">
                                {pedidosFiltrados.map((pedido) => {
                                    // --- PROTEÇÃO CONTRA ERROS (BLINDAGEM) ---
                                    // 1. Forçamos o status para MAIÚSCULO e definimos um padrão caso venha vazio
                                    const statusChave = pedido.status?.toUpperCase() || "PENDENTE";
                                    // 2. Buscamos no config. Se não existir (ex: status novo), usamos o PENDENTE para não quebrar
                                    const Status = statusConfig[statusChave] || statusConfig["PENDENTE"];

                                    // 3. Fazemos o mesmo para o método de pagamento
                                    const metodoChave = pedido.metodo?.toUpperCase() || "PIX";
                                    const Metodo = pagamentoConfig[metodoChave] || pagamentoConfig["PIX"];

                                    return (
                                        <tr key={pedido.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/10 transition-colors group">
                                            <td className="p-10">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-red-600 italic text-sm mb-1 tracking-tighter">{pedido.id}</span>
                                                    <span className="font-bold text-xs uppercase text-zinc-700 dark:text-zinc-200">{pedido.cliente}</span>
                                                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{pedido.items} itens comprados</span>
                                                </div>
                                            </td>
                                            <td className="p-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                                                        {/* Metodo.icon agora está protegido pela blindagem acima */}
                                                        <Metodo.icon className="w-4 h-4 text-zinc-500" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-zinc-500">{Metodo.label}</span>
                                                </div>
                                            </td>
                                            <td className="p-10 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{pedido.data}</td>
                                            <td className="p-10 text-center">
                                                {/* Status.bg e Status.color agora estão protegidos */}
                                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${Status.bg} ${Status.color} ${Status.border}`}>
                                                    <Status.icon className="w-3 h-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{statusChave}</span>
                                                </div>
                                            </td>
                                            <td className="p-10 font-black text-zinc-800 dark:text-zinc-200 text-sm italic tracking-tighter">
                                                R$ {Number(pedido.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-10 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => abrirResumo(pedido)}
                                                        title="Detalhes"
                                                        className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-red-600 border border-zinc-200 dark:border-zinc-800 transition-all active:scale-90"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => abrirImpressao(pedido)}
                                                        title="Imprimir Documento"
                                                        className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 transition-all active:scale-90"
                                                    >
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ModalDetalhesPedido
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                pedido={pedidoSelecionado}
                onUpdateStatus={handleUpdateStatus}
            />

            <ModalImpressaoPedido
                isOpen={isModalPrintOpen}
                setIsOpen={setIsModalPrintOpen}
                pedido={pedidoParaImprimir}
            />
        </div>
    );
}