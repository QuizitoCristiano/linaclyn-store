import React from "react";
import { X, Printer, ReceiptText, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModalImpressaoPedido({ isOpen, setIsOpen, pedido }) {
    if (!isOpen || !pedido) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-white text-zinc-900 w-full max-w-[800px] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">

                {/* Header do Modal - Estilo Dark do seu Dashboard (Oculto na Impressão) */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-[#0c0c0c] text-white print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 p-2 rounded-lg text-white">
                            <Printer className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-black uppercase italic tracking-tighter leading-none text-xl">IMPRIMIR ETIQUETA</h2>
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">LOGÍSTICA • JAN 2026</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] rounded-xl h-11 px-6 italic shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all">

                            <Printer className="w-4 h-4 mr-2" />  Confirmar Impressão
                        </Button>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ÁREA DE IMPRESSÃO (Simula Papel A4 com sua Logo) */}
                <div className="p-12 overflow-y-auto bg-white print:p-0" id="area-impressao">

                    {/* Cabeçalho com sua Logo Original */}
                    <div className="flex justify-between items-center border-b-4 border-zinc-900 pb-8 mb-10">
                        <div>
                            {/* LOGO LINACLYN INTEGRADA */}
                            <h1 className="text-4xl font-black italic tracking-tighter leading-none">
                                LINA<span className="text-red-600">CLYN</span>
                            </h1>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Finance Tracking • System</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">PEDIDO INTERNO</p>
                                <p className="font-black text-3xl tracking-tighter text-red-600">{pedido.id}</p>
                                <p className="text-[10px] font-bold uppercase text-zinc-500">{pedido.data}</p>
                            </div>
                            {/* QR Code Industrial */}
                            <div className="w-24 h-24 border-2 border-zinc-900 p-1 flex items-center justify-center">
                                <QrCode className="w-full h-full text-zinc-900" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Grid de Informações Logísticas */}
                    <div className="grid grid-cols-2 gap-12 mb-10">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest border-l-4 border-red-600 pl-3">Destinatário / Entrega</h3>
                                <p className="font-black text-base uppercase italic text-zinc-900">{pedido.cliente}</p>
                                <p className="text-[11px] text-zinc-600 mt-2 leading-relaxed font-bold uppercase">{pedido.endereco}</p>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 italic">
                                <p className="text-[9px] font-black text-zinc-400 uppercase mb-1">Observação de Envio:</p>
                                <p className="text-[10px] font-bold text-zinc-700 uppercase">Cuidado material frágil. Conferir conteúdo no ato do recebimento.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Pagamento</h3>
                                    <p className="font-black text-sm uppercase italic text-zinc-800">{pedido.metodo}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Status</h3>
                                    <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                                        {pedido.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-zinc-200 p-3 rounded-xl text-center">
                                    <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Volume</p>
                                    <p className="text-xs font-black italic">01/01</p>
                                </div>
                                <div className="border border-zinc-200 p-3 rounded-xl text-center">
                                    <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Peso Est.</p>
                                    <p className="text-xs font-black italic">1.250 KG</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabela de Itens */}
                    <div className="mb-10">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-zinc-900 text-left">
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest">Descrição do Produto</th>
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-center">Qtd</th>
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right">Preço Unit.</th>
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {pedido.produtos?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-5 text-xs font-black uppercase italic tracking-tighter">{item.nome}</td>
                                        <td className="py-5 text-xs font-black text-center">{item.qtd}</td>
                                        <td className="py-5 text-xs font-bold text-right text-zinc-500">R$ {item.preco.toFixed(2)}</td>
                                        <td className="py-5 text-xs font-black text-right">R$ {(item.preco * item.qtd).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Rodapé Financeiro com Estilo de Selo */}
                    <div className="flex justify-between items-end mt-12">
                        <div className="space-y-4">
                            <div className="w-48 h-16 border-2 border-dashed border-zinc-300 rounded-xl flex items-center justify-center">
                                <p className="text-[9px] font-black text-zinc-300 uppercase rotate-[-5deg]">Selo de Conferência</p>
                            </div>
                            <p className="text-[8px] font-black text-zinc-400 uppercase">Documento gerado em {new Date().toLocaleString('pt-BR')}</p>
                        </div>

                        <div className="w-full max-w-[300px] bg-[#0c0c0c] text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-3xl"></div>
                            <div className="flex justify-between text-[10px] font-bold uppercase opacity-50 mb-2">
                                <span>Vlr. Bruto:</span>
                                <span>R$ {pedido.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase opacity-50 mb-6">
                                <span>Frete/Seguro:</span>
                                <span>R$ 0,00</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black italic border-t border-white/10 pt-6">
                                <span className="tracking-tighter uppercase">Total:</span>
                                <span className="text-red-600 tracking-tighter">R$ {pedido.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* CSS de Impressão Integrado */}
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
            height: 100%;
            padding: 50px !important;
            background: white !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}} />
        </div>
    );
}