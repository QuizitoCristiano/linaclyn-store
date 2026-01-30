import React from "react";
import { X, User, MapPin, Package, Printer, CheckCircle2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModalDetalhesPedido({ isOpen, setIsOpen, pedido, onUpdateStatus }) {
    if (!isOpen || !pedido) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Background com Blur */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

            {/* Content Card */}
            <div className="relative bg-[#0f0f0f] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-800 flex flex-col max-h-[90vh]">

                {/* Header Visível */}
                <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
                    <div>
                        <span className="text-red-600 font-black italic text-2xl uppercase tracking-tighter">{pedido.id}</span>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Dossiê do Pedido</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-3 rounded-2xl hover:bg-white/5 text-zinc-500 transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body Visível */}
                <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
                    <div className="grid grid-cols-2 gap-8">
                        <section className="space-y-4">
                            <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3 text-red-600" /> Cliente
                            </h3>
                            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 font-bold text-xs uppercase italic text-zinc-300">
                                {pedido.cliente}
                            </div>
                            <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mt-6">
                                <MapPin className="w-3 h-3 text-red-600" /> Endereço
                            </h3>
                            <p className="text-[11px] text-zinc-400 font-bold uppercase leading-relaxed pl-4 border-l-2 border-red-600/30">
                                {pedido.endereco}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Package className="w-3 h-3 text-red-600" /> Itens
                            </h3>
                            <div className="space-y-2">
                                {pedido.produtos?.map((item, i) => (
                                    <div key={i} className="flex justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/30 text-[10px] font-bold">
                                        <span className="text-zinc-400">{item.qtd}x {item.nome}</span>
                                        <span className="italic text-zinc-200">R$ {item.preco.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Visível */}
                <div className="p-8 bg-zinc-900/40 border-t border-zinc-800 flex gap-4">
                    <Button onClick={() => window.print()} variant="outline" className="flex-1 h-14 rounded-2xl border-zinc-800 font-black uppercase italic text-[10px] gap-2">
                        <Printer className="w-4 h-4" /> Imprimir Etiqueta
                    </Button>
                    <Button
                        onClick={() => onUpdateStatus(pedido.id, 'ENVIADO')}
                        disabled={pedido.status === 'ENVIADO'}
                        className={`flex-[2] h-14 rounded-2xl font-black uppercase italic text-[10px] gap-2 ${pedido.status === 'ENVIADO' ? 'bg-zinc-800' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20'}`}
                    >
                        <CheckCircle2 className="w-4 h-4" /> {pedido.status === 'ENVIADO' ? 'Despachado' : 'Marcar Enviado'}
                    </Button>
                </div>

                {/* --- ÁREA DE IMPRESSÃO (ESCONDIDA NA TELA) --- */}
                <div className="hidden print:block fixed inset-0 bg-white text-black p-10 z-[200]">
                    <div className="w-[100mm] border-4 border-black p-6 mx-auto">
                        <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
                            <h1 className="text-3xl font-black tracking-tighter italic">LOGÍSTICA XP</h1>
                            <span className="text-2xl font-black">{pedido.id}</span>
                        </div>
                        <div className="space-y-6 uppercase font-bold text-xs">
                            <div>
                                <p className="text-[10px] font-black border-b border-black mb-2">DESTINATÁRIO</p>
                                <p className="text-lg font-black italic">{pedido.cliente}</p>
                                <p className="mt-1">{pedido.endereco}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black border-b border-black mb-2">CONTEÚDO</p>
                                {pedido.produtos?.map((p, i) => (
                                    <p key={i}>[ ] {p.qtd}X {p.nome}</p>
                                ))}
                            </div>
                            <div className="flex flex-col items-center pt-4 border-t-2 border-black border-dashed">
                                <QrCode className="w-24 h-24 mb-2" />
                                <p className="text-[8px] font-black tracking-[0.3em]">RASTREIO: {pedido.id}-2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}