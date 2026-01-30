import React, { useState, useMemo } from "react";
import { Users, Search, UserPlus, Filter, MessageCircle, Award, MoreVertical } from "lucide-react";
import { SidebarFiltroClientes } from "./SidebarFiltroClientes";

export default function PaginaClientes() {
    const [termoBusca, setTermoBusca] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filtros, setFiltros] = useState({ nivel: "TODOS", status: "TODOS" });

    const [clientes] = useState([
        { id: 1, nome: "MARCOS OLIVEIRA", telefone: "5511999999999", compras: 12, nivel: "GOLD", status: "ATIVO", ultima: "27/01/2026" },
        { id: 2, nome: "ANA BEATRIZ SILVA", telefone: "5511888888888", compras: 5, nivel: "SILVER", status: "ATIVO", ultima: "26/01/2026" },
        { id: 3, nome: "RICARDO SANTOS", telefone: "5511777777777", compras: 2, nivel: "BRONZE", status: "INATIVO", ultima: "15/12/2025" },
    ]);

    const clientesFiltrados = useMemo(() => {
        return clientes.filter(c => {
            const matchesBusca = c.nome.toLowerCase().includes(termoBusca.toLowerCase());
            const matchesNivel = filtros.nivel === "TODOS" || c.nivel === filtros.nivel;
            const matchesStatus = filtros.status === "TODOS" || c.status === filtros.status;
            return matchesBusca && matchesNivel && matchesStatus;
        });
    }, [termoBusca, filtros, clientes]);

    return (
        // ESTRUTURA IDENTICA À SUA TELA DE PEDIDOS:
        <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 p-4 md:p-8 pt-20 md:pt-24 font-sans transition-colors duration-300 overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-zinc-900 dark:text-white">
                            BASE DE <span className="text-red-600">CLIENTES</span>
                        </h1>
                        <p className="text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2 text-[10px]">
                            Community Intelligence • Linaclyn 2026
                        </p>
                    </div>
                    <button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs px-8 py-4 rounded-xl italic transition-all shadow-lg flex items-center justify-center gap-2">
                        <UserPlus className="w-4 h-4" /> Novo Atleta
                    </button>
                </div>

                {/* Busca e Filtro */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        <input
                            type="text"
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                            placeholder="BUSCAR ATLETA POR NOME..."
                            className="w-full bg-white dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 md:py-5 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:border-red-600 outline-none transition-all dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`px-6 rounded-2xl transition-all border flex items-center justify-center ${filtros.nivel !== "TODOS"
                            ? 'border-red-600 text-red-600 bg-red-50 dark:bg-red-600/10'
                            : 'bg-white dark:bg-[#0c0c0c] border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                            }`}
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Grid de Clientes */}
                <div className="grid grid-cols-1 gap-4">
                    {clientesFiltrados.map((c) => (
                        <div key={c.id} className="bg-white dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex flex-col md:flex-row items-center justify-between hover:border-red-600/30 transition-all group shadow-sm">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:border-red-600 transition-colors">
                                    <Users className="w-7 h-7 md:w-8 md:h-8 text-zinc-300 dark:text-zinc-700 group-hover:text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black italic uppercase tracking-tighter dark:text-white">{c.nome}</h3>
                                    <div className="flex gap-4 mt-1">
                                        <span className="text-[10px] font-black text-red-600 uppercase flex items-center gap-1">
                                            <Award className="w-3 h-3" /> {c.nivel}
                                        </span>
                                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                            {c.compras} COMPRAS
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-zinc-100 dark:border-zinc-800">
                                <div className="text-left md:text-right">
                                    <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Último Acesso</p>
                                    <p className="text-xs font-bold dark:text-zinc-300">{c.ultima}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-12 h-12 bg-green-600/10 text-green-500 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><MessageCircle size={20} /></button>
                                    <button className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 rounded-xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"><MoreVertical size={20} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <SidebarFiltroClientes
                isOpen={isFilterOpen}
                setIsOpen={setIsFilterOpen}
                filtros={filtros}
                setFiltros={setFiltros}
            />
        </div>
    );
}