import React from "react";
import { X, RotateCcw } from "lucide-react";

export function SidebarFiltroClientes({ isOpen, setIsOpen, filtros, setFiltros }) {
    return (
        <>
            {/* Overlay - Travado no Dark */}
            <div
                className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[140] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar - Travada no bg-[#0c0c0c] */}
            <div className={`fixed inset-y-0 right-0 w-80 bg-[#0c0c0c] border-l border-zinc-800 z-[150] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[-20px_0_50px_rgba(0,0,0,0.9)] p-8 flex flex-col`}>

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-red-600">Filters</h2>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Refinar busca de atletas</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors group">
                        <X className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                    </button>
                </div>

                <div className="mb-10">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-4 block border-l-2 border-red-600 pl-3">Nível de Performance</label>
                    <div className="grid grid-cols-1 gap-2">
                        {["TODOS", "GOLD", "SILVER", "BRONZE"].map((nivel) => (
                            <button
                                key={nivel}
                                onClick={() => {
                                    setFiltros({ ...filtros, nivel });
                                    setIsOpen(false); // Fecha ao selecionar para facilitar o mobile
                                }}
                                className={`py-4 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filtros.nivel === nivel
                                    ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                                    }`}
                            >
                                {nivel}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-10">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-4 block border-l-2 border-red-600 pl-3">Status do Atleta</label>
                    <div className="flex gap-2">
                        {["TODOS", "ATIVO", "INATIVO"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFiltros({ ...filtros, status })}
                                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filtros.status === status
                                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={() => setFiltros({ nivel: "TODOS", status: "TODOS" })}
                        className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl flex items-center justify-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group"
                    >
                        <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
                        Resetar Filtros
                    </button>
                </div>
            </div>
        </>
    );
}