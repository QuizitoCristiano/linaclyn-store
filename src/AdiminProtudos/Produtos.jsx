

import React, { useState, useMemo } from "react";
import {
    Plus, Search, MoreHorizontal, Filter,
    ArrowUpDown, Package, Check, Edit2, Trash2, AlertTriangle, Loader2, Star, Tag
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
import { ModalProduto } from "./ModalPro";
import { useProducts } from "../context/ProductContext";

export default function AdminProdutos() {
    const { products, saveProduct, deleteProduct, loading } = useProducts();

    const [busca, setBusca] = useState("");
    const [ordemPreco, setOrdemPreco] = useState(null); // 'asc', 'desc' ou null
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [produtoParaDeletar, setProdutoParaDeletar] = useState(null);

    // 1. CATEGORIAS DINÂMICAS
    const categoriasDinamicas = useMemo(() => {
        const cats = products
            .map(p => p.categoria?.toUpperCase())
            .filter(cat => cat && cat.trim() !== "");
        return ["TODOS", ...new Set(cats)].sort();
    }, [products]);

    // 2. LÓGICA DE FILTRAGEM E ORDENAÇÃO ATUALIZADA
    const produtosFiltrados = useMemo(() => {
        let lista = [...products];

        // Filtro de Busca e Categoria
        lista = lista.filter(p => {
            const nomeMatch = p.nome?.toLowerCase().includes(busca.toLowerCase());

            // AJUSTE AQUI: Se for "TODOS", não filtra por categoria. 
            // Se houver filtro específico, compara com segurança (opcional chaining)
            const categoriaMatch = filtroCategoria === "TODOS" ||
                (p.categoria?.toUpperCase() === filtroCategoria);

            return nomeMatch && categoriaMatch;
        });

        // Ordenação de Preço
        if (ordemPreco === 'asc') {
            lista.sort((a, b) => Number(a.preco || 0) - Number(b.preco || 0));
        } else if (ordemPreco === 'desc') {
            lista.sort((a, b) => Number(b.preco || 0) - Number(a.preco || 0));
        }

        return lista;
    }, [busca, products, ordemPreco, filtroCategoria]);


    const abrirConfirmacaoDeletar = (produto) => {
        setProdutoParaDeletar(produto);
        setIsAlertOpen(true);
    };

    const executarExclusao = async () => {
        if (produtoParaDeletar?.id) {
            await deleteProduct(produtoParaDeletar.id);
            setIsAlertOpen(false);
            setProdutoParaDeletar(null);
        }
    };

    // if (loading) {
    //     return (
    //         <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center gap-4">
    //             <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
    //             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Sincronizando Performance System...</p>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0c0c0c] text-zinc-900 dark:text-zinc-200 p-4 md:p-8 pt-20 md:pt-24 font-sans transition-colors duration-300 overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                            GESTÃO DE <span className="text-red-600">PRODUTOS</span>
                        </h1>
                        <p className="text-zinc-400 dark:text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase mt-3 tracking-[0.2em]">
                            Linaclyn Performance Control • 2026
                        </p>
                    </div>
                    <Button
                        onClick={() => { setProdutoSelecionado(null); setIsModalOpen(true); }}
                        className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-black rounded-xl h-14 px-10 italic shadow-lg shadow-red-600/20 border-none transition-transform active:scale-95"
                    >
                        <Plus className="w-6 h-6 mr-2 stroke-[4px]" /> NOVO PRODUTO
                    </Button>
                </div>

                {/* BUSCA E FILTROS */}
                <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center">
                    <div className="relative w-full flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                        <Input
                            placeholder="BUSCAR PRODUTO PELO NOME..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="pl-14 h-14 md:h-16 rounded-2xl font-bold uppercase text-[11px] border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-[#161616] text-zinc-900 dark:text-white focus-visible:ring-1 focus-visible:ring-red-600/50 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex w-full lg:w-auto gap-2 md:gap-4">
                        {/* BOTÃO FILTRAR CATEGORIA */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex-1 lg:flex-none h-14 md:h-16 px-6 md:px-8 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#161616] font-black gap-3 text-xs uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-500 dark:text-zinc-400 shadow-sm">
                                    <Filter className="w-4 h-4" /> {filtroCategoria}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#1a1a1a] border-zinc-800 text-zinc-300 min-w-[200px] rounded-xl shadow-2xl">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase p-3 opacity-50 tracking-widest">Filtrar por Categoria</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                {categoriasDinamicas.map((cat) => (
                                    <DropdownMenuItem key={cat} onClick={() => setFiltroCategoria(cat)} className="p-3 font-bold text-[11px] uppercase flex justify-between focus:bg-red-600/10 focus:text-red-600 cursor-pointer">
                                        {cat} {filtroCategoria === cat && <Check className="w-4 h-4 text-red-600" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* BOTÃO ORDENAR PREÇO (O QUE FALTOU) */}
                        <Button
                            onClick={() => {
                                if (ordemPreco === null) setOrdemPreco('desc');
                                else if (ordemPreco === 'desc') setOrdemPreco('asc');
                                else setOrdemPreco(null);
                            }}
                            variant="outline"
                            className={`flex-1 lg:flex-none h-14 md:h-16 px-6 md:px-8 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#161616] font-black gap-3 text-xs uppercase transition-all shadow-sm ${ordemPreco ? 'text-red-600 border-red-600/30 ring-1 ring-red-600/20' : 'text-zinc-500 dark:text-zinc-400'
                                }`}
                        >
                            <ArrowUpDown className={`w-4 h-4 ${ordemPreco ? 'text-red-600' : ''}`} />
                            {ordemPreco === 'desc' ? 'MAIOR PREÇO' : ordemPreco === 'asc' ? 'MENOR PREÇO' : 'PREÇO'}
                        </Button>
                    </div>
                </div>

                {/* TABELA DE PRODUTOS */}
                <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800/40 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl transition-all">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left min-w-[900px]">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-800/30">
                                    <th className="p-6 md:p-10">PRODUTO</th>
                                    <th className="p-6 md:p-10">STATUS</th>
                                    <th className="p-6 md:p-10">PREÇO</th>
                                    <th className="p-6 md:p-10 text-center">ESTOQUE</th>
                                    <th className="p-6 md:p-10 text-right">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/20">
                                {produtosFiltrados.map((p) => (
                                    <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/10 transition-colors group">
                                        {/* COLUNA: PRODUTO (IMAGEM + NOME) */}
                                        <td className="p-6 md:p-10 flex items-center gap-4 md:gap-6">
                                            <div className="w-10 h-10 md:w-14 md:h-14 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl md:rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800/50 group-hover:border-red-600/30 transition-all overflow-hidden relative">
                                                {/* Se tiver imagem, mostra ela. Se não, mostra o ícone de caixa */}
                                                {p.img ? (
                                                    <img src={p.img} alt={p.nome} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-5 h-5 md:w-7 md:h-7 text-zinc-700" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-xs md:text-sm uppercase italic tracking-tight text-zinc-700 dark:text-zinc-200">
                                                    {p.nome}
                                                </span>
                                                {/* Aqui mostra um badge pequeno da categoria real do banco */}
                                                <span className="text-[8px] font-bold text-red-600/60 uppercase">
                                                    {p.categoria || "GERAL"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* COLUNA: DESCRIÇÃO (Como você pediu, no lugar onde estava escrito categoria) */}
                                        <td className="p-6 md:p-10">
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold max-w-[200px] truncate">
                                                {p.descricao || "Sem descrição disponível"}
                                            </p>
                                        </td>

                                        {/* COLUNA: PREÇO */}
                                        <td className="p-6 md:p-10 font-black text-zinc-800 dark:text-zinc-200 text-xs md:text-sm italic">
                                            R$ {parseFloat(p.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>

                                        {/* COLUNA: ESTOQUE */}
                                        <td className="p-6 md:p-10 text-center">

                                            <span className={`text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase border ${p.estoque > 0 ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-600/5 text-red-600 border-red-600/20'}`}>
                                                {p.estoque || 0} UN
                                            </span>
                                        </td>

                                        {/* COLUNA: AÇÕES */}
                                        <td className="p-6 md:p-10 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="text-zinc-300 dark:text-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors p-2">
                                                        <MoreHorizontal className="w-6 h-6" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-zinc-800 rounded-xl shadow-xl min-w-[150px] text-white">
                                                    <DropdownMenuItem onClick={() => { setProdutoSelecionado(p); setIsModalOpen(true); }} className="p-3 font-bold text-[11px] uppercase flex gap-3 focus:bg-red-600 cursor-pointer">
                                                        <Edit2 className="w-4 h-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => abrirConfirmacaoDeletar(p)} className="p-3 font-bold text-[11px] uppercase flex gap-3 text-red-600 focus:bg-red-600 focus:text-white cursor-pointer">
                                                        <Trash2 className="w-4 h-4" /> Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
            {isAlertOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAlertOpen(false)} />
                    <div className="relative bg-[#0f0f0f] border border-zinc-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-6 border border-red-600/20">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-black uppercase italic text-white leading-none">Atenção!</h2>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase mt-3 tracking-widest">
                                Excluir permanentemente <br /> <span className="text-red-600">"{produtoParaDeletar?.nome}"</span>?
                            </p>
                            <div className="flex w-full gap-3 mt-8">
                                <button onClick={() => setIsAlertOpen(false)} className="flex-1 h-12 rounded-xl bg-zinc-900 text-zinc-500 font-black uppercase text-[10px] hover:bg-zinc-800 transition-all">Voltar</button>
                                <button onClick={executarExclusao} className="flex-1 h-12 rounded-xl bg-red-600 text-white font-black uppercase text-[10px] hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all">Excluir</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ModalProduto
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                produtoEdicao={produtoSelecionado}
                aoSalvar={saveProduct}
            />
        </div>
    );
}