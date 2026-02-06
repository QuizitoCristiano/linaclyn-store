import React from 'react';

export function ManifestoLinaClyn() {
    return (
        <section className="w-full py-16 px-4 bg-background transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                <div className="relative group overflow-hidden rounded-[2.5rem] border border-red-600/20 bg-card shadow-2xl flex flex-col md:flex-row items-stretch">

                    {/* LADO DA IMAGEM - Visual Impact */}
                    <div className="w-full md:w-1/2 relative min-h-[400px] overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
                            alt="LinaClyn Style"
                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                        />
                        {/* Overlay para dar profundidade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-card/10" />

                        {/* Tag Flutuante na Imagem */}
                        <div className="absolute bottom-8 left-8">
                            <span className="bg-red-600 text-white font-black italic text-[10px] uppercase tracking-[0.4em] px-4 py-2 rounded-full shadow-lg">
                                Original Tech & Style
                            </span>
                        </div>
                    </div>

                    {/* LADO DO TEXTO - Conteúdo e Detalhes */}
                    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-red-600 font-black text-[12px] uppercase tracking-[0.5em] italic">
                                Nossa Essência
                            </h2>
                            <h1 className="text-card-foreground font-black text-4xl md:text-5xl uppercase italic tracking-tighter leading-none">
                                LinaClyn <br />
                                <span className="text-red-600">Evolution.</span>
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <p className="text-card-foreground/80 font-medium italic leading-relaxed text-sm md:text-base border-l-2 border-red-600 pl-4">
                                "A LinaClyn nasceu do sonho de unir o estilo e a inovação em um só lugar.
                                Cada peça, cada acessório, cada detalhe é pensado com autenticidade para
                                proporcionar experiências únicas."
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 rounded-2xl bg-muted/20 border border-red-600/10">
                                    <span className="block text-red-600 font-black text-lg italic">01.</span>
                                    <span className="text-[10px] font-black uppercase text-card-foreground">Performance</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/20 border border-red-600/10">
                                    <span className="block text-red-600 font-black text-lg italic">02.</span>
                                    <span className="text-[10px] font-black uppercase text-card-foreground">Inovação</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest opacity-60">
                            Transformando a conexão entre quem usa e o verdadeiro luxo da personalidade.
                        </p>

                        <button className="w-fit bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-black uppercase italic text-[10px] tracking-widest transition-all active:scale-95 shadow-xl shadow-red-600/20">
                            Conheça Nossa História
                        </button>
                    </div>

                    {/* Efeito de brilho de canto (Sutil) */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[80px] rounded-full pointer-events-none" />
                </div>
            </div>
        </section>
    );
}