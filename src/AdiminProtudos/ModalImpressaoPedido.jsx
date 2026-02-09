import React from "react";
import { X, Printer, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModalImpressaoPedido({ isOpen, setIsOpen, pedido }) {
    if (!isOpen || !pedido) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-4">
            <div className="bg-white text-zinc-900 w-full max-w-[850px] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">

                {/* Header do Modal - Fixo e Responsivo */}
                <div className="p-4 md:p-6 border-b border-zinc-800 flex justify-between items-center bg-[#0c0c0c] text-white print:hidden">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="bg-red-600 p-1.5 md:p-2 rounded-lg text-white">
                            <Printer className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            <h2 className="font-black uppercase italic tracking-tighter leading-none text-sm md:text-xl">IMPRIMIR ETIQUETA</h2>
                            <p className="text-[7px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">LOGÍSTICA • JAN 2026</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[9px] md:text-[10px] rounded-xl h-9 md:h-11 px-4 md:px-6 italic shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all">
                            <Printer className="w-3 h-3 md:w-4 md:h-4 mr-2" /> <span className="hidden xs:inline">Confirmar</span> Impressão
                        </Button>
                        <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ÁREA DE IMPRESSÃO COM SCROLL E ESCALA */}
                <div className="flex-1 overflow-y-auto bg-zinc-100/50 print:bg-white p-2 md:p-8" id="area-impressao-container">

                    {/* A "Folha" que mantém proporção */}
                    <div className="bg-white shadow-sm print:shadow-none mx-auto w-full max-w-[210mm] p-6 md:p-12 min-h-fit" id="area-impressao">

                        {/* Cabeçalho */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-zinc-900 pb-6 mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">
                                    LINA<span className="text-red-600">CLYN</span>
                                </h1>
                                <p className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Finance Tracking • System</p>
                            </div>

                            <div className="flex items-center gap-4 md:gap-6 self-end sm:self-auto">
                                <div className="text-right">
                                    <p className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-widest">PEDIDO INTERNO</p>
                                    <p className="font-black text-xl md:text-3xl tracking-tighter text-red-600 break-all">{pedido.id}</p>
                                    <p className="text-[9px] md:text-[10px] font-bold uppercase text-zinc-500">{pedido.data}</p>
                                </div>
                                <div className="w-16 h-16 md:w-24 md:h-24 border-2 border-zinc-900 p-1 flex items-center justify-center bg-white shrink-0">
                                    <QrCode className="w-full h-full text-zinc-900" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        {/* Grid de Informações */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-8">
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <h3 className="text-[9px] md:text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest border-l-4 border-red-600 pl-3">Destinatário / Entrega</h3>
                                    <p className="font-black text-sm md:text-base uppercase italic text-zinc-900">{pedido.cliente}</p>
                                    <p className="text-[10px] md:text-[11px] text-zinc-600 mt-2 leading-relaxed font-bold uppercase">{pedido.endereco || 'Endereço não informado'}</p>
                                </div>
                                <div className="p-3 md:p-4 bg-zinc-50 rounded-xl border border-zinc-100 italic">
                                    <p className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase mb-1">Observação de Envio:</p>
                                    <p className="text-[9px] md:text-[10px] font-bold text-zinc-700 uppercase">Cuidado material frágil. Conferir conteúdo no ato do recebimento.</p>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-6">
                                <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                                    <div>
                                        <h3 className="text-[9px] md:text-[10px] font-black uppercase text-zinc-400 tracking-widest">Pagamento</h3>
                                        <p className="font-black text-xs md:text-sm uppercase italic text-zinc-800">{pedido.metodo}</p>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-[9px] md:text-[10px] font-black uppercase text-zinc-400 tracking-widest">Status</h3>
                                        <span className="text-[8px] md:text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 md:px-3 py-1 rounded-full border border-green-200">
                                            {pedido.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div className="border border-zinc-200 p-2 md:p-3 rounded-xl text-center">
                                        <p className="text-[7px] md:text-[8px] font-black text-zinc-400 uppercase mb-1">Volume</p>
                                        <p className="text-[10px] md:text-xs font-black italic">01/01</p>
                                    </div>
                                    <div className="border border-zinc-200 p-2 md:p-3 rounded-xl text-center">
                                        <p className="text-[7px] md:text-[8px] font-black text-zinc-400 uppercase mb-1">Peso Est.</p>
                                        <p className="text-[10px] md:text-xs font-black italic">1.250 KG</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabela de Itens - Scroll Horizontal se necessário no Mobile */}
                        <div className="mb-8 overflow-x-auto">
                            <table className="w-full min-w-[500px] md:min-w-full">
                                <thead>
                                    <tr className="border-b-2 border-zinc-900 text-left">
                                        <th className="py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Descrição</th>
                                        <th className="py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center">Qtd</th>
                                        <th className="py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-right">Preço</th>
                                        <th className="py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200">
                                    {pedido.produtos?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-4 text-[10px] md:text-xs font-black uppercase italic tracking-tighter">{item.nome}</td>
                                            <td className="py-4 text-[10px] md:text-xs font-black text-center">{item.qtd}</td>
                                            <td className="py-4 text-[10px] md:text-xs font-bold text-right text-zinc-500">R$ {item.preco?.toFixed(2)}</td>
                                            <td className="py-4 text-[10px] md:text-xs font-black text-right">R$ {(item.preco * item.qtd)?.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Rodapé Financeiro */}
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mt-8 gap-8">
                            <div className="space-y-4 w-full md:w-auto flex flex-col items-center md:items-start">
                                <div className="w-40 md:w-48 h-12 md:h-16 border-2 border-dashed border-zinc-300 rounded-xl flex items-center justify-center">
                                    <p className="text-[8px] md:text-[9px] font-black text-zinc-300 uppercase rotate-[-5deg]">Selo de Conferência</p>
                                </div>
                                <p className="text-[7px] md:text-[8px] font-black text-zinc-400 uppercase">Documento gerado em {new Date().toLocaleString('pt-BR')}</p>
                            </div>

                            <div className="w-full max-w-[280px] md:max-w-[300px] bg-[#0c0c0c] text-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-3xl"></div>
                                <div className="flex justify-between text-[9px] md:text-[10px] font-bold uppercase opacity-50 mb-2">
                                    <span>Vlr. Bruto:</span>
                                    <span>R$ {pedido.total?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[9px] md:text-[10px] font-bold uppercase opacity-50 mb-4 md:mb-6">
                                    <span>Frete/Seguro:</span>
                                    <span>R$ 0,00</span>
                                </div>
                                <div className="flex justify-between text-xl md:text-2xl font-black italic border-t border-white/10 pt-4 md:pt-6">
                                    <span className="tracking-tighter uppercase">Total:</span>
                                    <span className="text-red-600 tracking-tighter">R$ {pedido.total?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; size: A4; }
                    body * { visibility: hidden; }
                    #area-impressao, #area-impressao * { visibility: visible; }
                    #area-impressao { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        padding: 40px !important;
                        background: white !important;
                    }
                    .print\\:hidden { display: none !important; }
                }
                
                /* Ajuste para telas muito pequenas não quebrarem o layout da etiqueta */
                @media (max-width: 480px) {
                    #area-impressao {
                        transform: scale(0.95);
                        transform-origin: top center;
                    }
                }
                `
            }} />
        </div>
    );
}