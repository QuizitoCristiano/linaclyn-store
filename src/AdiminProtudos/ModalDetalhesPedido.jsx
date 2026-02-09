import React from "react";
import { X, User, MapPin, Package, Printer, CheckCircle2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModalDetalhesPedido({ isOpen, setIsOpen, pedido, onUpdateStatus, isDarkMode = true }) {
    if (!isOpen || !pedido) return null;

    // Blindagem de dados
    const statusAtual = pedido.status?.toUpperCase() || "PENDENTE";
    const produtos = pedido.produtos || [];

    // CORREÇÃO DO ENDEREÇO: Tenta várias chaves comuns ou avisa se estiver vazio
    const enderecoExibicao = pedido.endereco || pedido.address || pedido.localizacao || "ENDEREÇO NÃO CADASTRADO";

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-4">
            {/* Background com Blur dinâmico */}
            <div
                className={`absolute inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/95' : 'bg-zinc-900/40'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Content Card Adaptativo */}
            <div className={`relative w-full max-w-2xl rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border flex flex-col max-h-[95vh] md:max-h-[90vh] transition-colors ${isDarkMode ? 'bg-[#0f0f0f] border-zinc-800' : 'bg-white border-zinc-200'
                }`}>

                {/* Header com ID Adaptativo (ajusta o tamanho da letra no celular) */}
                <div className={`p-6 md:p-8 border-b flex justify-between items-center gap-4 ${isDarkMode ? 'bg-zinc-900/20 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                    <div className="min-w-0 flex-1">
                        <span className="text-red-600 font-black italic uppercase tracking-tighter block id-pedido-ajustado">
                            {pedido.id}
                        </span>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            Dossiê do Pedido
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className={`p-2 md:p-3 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-zinc-500' : 'hover:bg-zinc-200 text-zinc-600'}`}
                    >
                        <X className="w-5 h-5 md:w-6 h-6" />
                    </button>
                </div>

                {/* Body com Scroll Suave e Layout Responsivo */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 md:space-y-8 scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                        {/* Cliente e Endereço */}
                        <section className="space-y-4">
                            <div>
                                <h3 className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    <User className="w-3 h-3 text-red-600" /> Cliente
                                </h3>
                                <div className={`p-4 rounded-2xl border font-bold text-xs uppercase italic break-words ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                                    }`}>
                                    {pedido.cliente || "Nome não informado"}
                                </div>
                            </div>

                            <div>
                                <h3 className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    <MapPin className="w-3 h-3 text-red-600" /> Endereço
                                </h3>
                                <p className={`text-[11px] font-bold uppercase leading-relaxed pl-4 border-l-2 border-red-600/30 break-words ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                                    }`}>
                                    {enderecoExibicao}
                                </p>
                            </div>
                        </section>

                        {/* Lista de Itens */}
                        <section className="space-y-4">
                            <h3 className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                <Package className="w-3 h-3 text-red-600" /> Itens
                            </h3>
                            <div className="space-y-2">
                                {produtos.map((item, i) => (
                                    <div key={i} className={`flex justify-between items-center p-3 rounded-xl border text-[10px] font-bold gap-3 ${isDarkMode ? 'bg-zinc-900/30 border-zinc-800/30' : 'bg-zinc-50 border-zinc-200'
                                        }`}>
                                        <span className={`truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                            {item.qtd}x {item.nome}
                                        </span>
                                        <span className={`italic whitespace-nowrap ${isDarkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>
                                            R$ {Number(item.preco || 0).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Responsivo (Empilha no celular) */}
                <div className={`p-5 md:p-8 border-t flex flex-col sm:flex-row gap-3 md:gap-4 ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                    {/* BOTÃO ETIQUETA: Branco com texto Preto */}
                    <Button
                        onClick={() => window.print()}
                        className="w-full sm:flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase italic text-[10px] md:text-[12px] gap-2 bg-white text-black hover:bg-zinc-200 border-none transition-all shadow-md"
                    >
                        <Printer className="w-4 h-4" />
                        <span className="truncate">Etiqueta</span>
                    </Button>

                    {/* BOTÃO STATUS: Vermelho LinaClyn com Sombra */}
                    <Button
                        onClick={() => onUpdateStatus(pedido.id, 'ENVIADO')}
                        disabled={statusAtual === 'ENVIADO'}
                        className={`w-full sm:flex-[2] h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase italic text-[10px] md:text-[12px] gap-2 transition-all border-none !opacity-100 ${statusAtual === 'ENVIADO'
                            ? 'bg-[#e31b23] text-white cursor-not-allowed shadow-none'
                            : 'bg-[#e31b23] hover:bg-[#c41e3a] text-white shadow-[0_0_20px_rgba(227,27,35,0.4)] active:scale-95'
                            }`}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="truncate">
                            {statusAtual === 'ENVIADO' ? 'Pedido Despachado' : 'Marcar como Enviado'}
                        </span>
                    </Button>
                </div>
                {/* CSS para o ID não quebrar o layout */}
                <style jsx>{`
                    .id-pedido-ajustado {
                        font-size: clamp(14px, 4.5vw, 24px);
                        word-break: break-all;
                        line-height: 1.1;
                    }
                `}</style>

                {/* Versão de Impressão */}
                <div className="hidden print:block fixed inset-0 bg-white text-black p-10 z-[200]">
                    <div className="w-[80mm] border-4 border-black p-4 mx-auto uppercase">
                        <div className="flex justify-between items-center border-b-4 border-black pb-2 mb-4">
                            <h1 className="text-xl font-black italic">LOGÍSTICA</h1>
                            <span className="text-sm font-black">{pedido.id}</span>
                        </div>
                        <div className="space-y-4 text-[10px] font-bold">
                            <p className="border-b border-black">DESTINATÁRIO: {pedido.cliente}</p>
                            <p className="leading-tight">ENDEREÇO: {enderecoExibicao}</p>
                            <div className="pt-4 flex flex-col items-center border-t border-black border-dashed">
                                <QrCode className="w-20 h-20 mb-1" />
                                <p className="text-[7px]">JAN-2026-XP</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}