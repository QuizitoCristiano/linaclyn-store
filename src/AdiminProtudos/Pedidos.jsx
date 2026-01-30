import React, { useState, useMemo } from "react";
import {
    Search, Filter, MoreHorizontal,
    ShoppingCart, Clock, CheckCircle2, XCircle,
    Truck, Eye, Download, Printer, Wallet, CreditCard, Banknote, QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ModalDetalhesPedido } from "./ModalDetalhesPedido";
import { ModalImpressaoPedido } from "./ModalImpressaoPedido"; // Importe aqui
export default function AdminPedidos() {
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("TODOS STATUS");
    const [filtroPagamento, setFiltroPagamento] = useState("TODOS PAGAMENTOS");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

    const abrirResumo = (pedido) => {
        setPedidoSelecionado(pedido);
        setIsModalOpen(true);
    };


    // Dentro do componente AdminPedidos:
    const [isModalPrintOpen, setIsModalPrintOpen] = useState(false);
    const [pedidoParaImprimir, setPedidoParaImprimir] = useState(null);

    const abrirImpressao = (pedido) => {
        setPedidoParaImprimir(pedido);
        setIsModalPrintOpen(true);
    };

    const handleUpdateStatus = (id, novoStatus) => {
        // 1. Atualiza o status na lista de pedidos
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: novoStatus } : p));

        // 2. Se o status for ENVIADO, registramos a despesa logicamente
        if (novoStatus === 'ENVIADO') {
            const pedido = pedidos.find(p => p.id === id);

            // Simulação de custos (Frete Fixo + 2% de taxa de embalagem)
            const custoFrete = 25.00;
            const custoEmbalagem = pedido.total * 0.02;
            const totalGasto = custoFrete + custoEmbalagem;

            console.log(`📊 LANÇAMENTO EM PLANILHA - JAN/2026`);
            console.log(`Pedido: ${id} | Destino: ${pedido.endereco}`);
            console.log(`Despesa Registrada: R$ ${totalGasto.toFixed(2)} (Logística)`);

            // Aqui você integraria com sua API ou localStorage da Planilha
            alert(`Pedido ${id} despachado! R$ ${totalGasto.toFixed(2)} lançados como despesa de logística.`);
        }

        setPedidoSelecionado(prev => ({ ...prev, status: novoStatus }));
    };

    // MANTIVE SEUS DADOS, APENAS GARANTI QUE OS NOVOS TENHAM OS CAMPOS PARA O MODAL NÃO DAR ERRO
    const [pedidos, setPedidos] = useState([
        { id: "#ORD-9842", cliente: "Marcos Oliveira", data: "27/01/2026", total: 459.00, status: "PAGO", items: 2, metodo: "PIX" },
        { id: "#ORD-9841", cliente: "Ana Beatriz Silva", data: "26/01/2026", total: 1290.50, status: "PENDENTE", items: 5, metodo: "CRÉDITO" },
        { id: "#ORD-9840", cliente: "Ricardo Santos", data: "26/01/2026", total: 89.90, status: "ENVIADO", items: 1, metodo: "DINHEIRO" },
        { id: "#ORD-9839", cliente: "Juliana Costa", data: "25/01/2026", total: 299.90, status: "CANCELADO", items: 2, metodo: "PARCELADO" },
        {
            id: "#ORD-9842",
            cliente: "Marcos Oliveira",
            data: "27/01/2026",
            total: 459.00,
            status: "PAGO",
            items: 2,
            metodo: "PIX",
            endereco: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
            produtos: [
                { nome: "MOCHILA NIKE RED TECH", qtd: 1, preco: 299.90 },
                { nome: "GARRAFA TÉRMICA SPORT", qtd: 1, preco: 159.10 }
            ]
        },
        {
            id: "#ORD-9841",
            cliente: "Ana Beatriz Silva",
            data: "26/01/2026",
            total: 1290.50,
            status: "PENDENTE",
            items: 1,
            metodo: "CRÉDITO",
            endereco: "Rua das Flores, 45 - Batel, Curitiba - PR",
            produtos: [
                { nome: "PROJETOR SMART 4K", qtd: 1, preco: 1290.50 }
            ]
        },
        {
            id: "#ORD-9840",
            cliente: "Ricardo Santos",
            data: "26/01/2026",
            total: 89.90,
            status: "ENVIADO",
            items: 1,
            metodo: "DINHEIRO",
            endereco: "Rua Teste, 123 - Centro", // Adicionado para evitar erro no modal
            produtos: [{ nome: "Item Genérico", qtd: 1, preco: 89.90 }] // Adicionado para evitar erro
        },
        {
            id: "#ORD-9839",
            cliente: "Juliana Costa",
            data: "25/01/2026",
            total: 299.90,
            status: "CANCELADO",
            items: 2,
            metodo: "PARCELADO",
            endereco: "Rua Teste, 456 - Interior", // Adicionado
            produtos: [{ nome: "Item Genérico", qtd: 2, preco: 149.95 }] // Adicionado
        }
    ]);

    const statusConfig = {
        PAGO: { color: "text-green-500", bg: "bg-green-500/5", border: "border-green-500/20", icon: CheckCircle2 },
        PENDENTE: { color: "text-yellow-500", bg: "bg-yellow-500/5", border: "border-yellow-500/20", icon: Clock },
        ENVIADO: { color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/20", icon: Truck },
        CANCELADO: { color: "text-red-600", bg: "bg-red-600/5", border: "border-red-600/20", icon: XCircle },
    };

    const pagamentoConfig = {
        PIX: { icon: QrCode, label: "PIX" },
        CRÉDITO: { icon: CreditCard, label: "Cartão" },
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
                        { label: "Faturamento Bruto", value: "R$ 2.139,30", icon: ShoppingCart, color: "text-red-600" },
                        { label: "Entrada via PIX", value: "R$ 459,00", icon: QrCode, color: "text-green-500" },
                        { label: "A Receber (Crédito)", value: "R$ 1.589,40", icon: CreditCard, color: "text-blue-500" },
                        { label: "Cancelados", value: "R$ 299,90", icon: XCircle, color: "text-zinc-400" }
                    ].map((card, i) => (
                        <div key={i} className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800/40 p-6 rounded-[2rem] shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className="text-xl font-black italic tracking-tighter">{card.value}</p>
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
                                    const Status = statusConfig[pedido.status];
                                    const Metodo = pagamentoConfig[pedido.metodo];
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
                                                        <Metodo.icon className="w-4 h-4 text-zinc-500" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-zinc-500">{Metodo.label}</span>
                                                </div>
                                            </td>
                                            <td className="p-10 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{pedido.data}</td>
                                            <td className="p-10 text-center">
                                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${Status.bg} ${Status.color} ${Status.border}`}>
                                                    <Status.icon className="w-3 h-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{pedido.status}</span>
                                                </div>
                                            </td>
                                            <td className="p-10 font-black text-zinc-800 dark:text-zinc-200 text-sm italic tracking-tighter">
                                                R$ {pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                                                        onClick={() => abrirImpressao(pedido)} // CHAMA A NOVA FUNÇÃO
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