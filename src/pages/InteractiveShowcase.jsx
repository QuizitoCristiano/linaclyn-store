import React from 'react';

export function InteractiveShowcase() {
    return (
        <section className="py-20 px-4 max-w-7xl mx-auto overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center gap-12">

                {/* LADO ESQUERDO: Texto e Frase de Impacto */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="inline-block px-4 py-1 rounded-full bg-linaclyn-red/10 border border-linaclyn-red/20 text-linaclyn-red text-xs font-bold uppercase tracking-[0.2em]">
                        Experiência Imersiva
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none tracking-tighter ">
                        O Futuro da <br />
                        <span className="text-linaclyn-red underline decoration-white/10">Moda Digital</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-md font-medium leading-relaxed">
                        Sinta a textura e o caimento antes mesmo de tocar. Tecnologia de ponta para quem não aceita o comum.
                    </p>

                    <div className="pt-4 flex gap-4">
                        <div className="h-1 w-20 bg-linaclyn-red rounded-full"></div>
                        <div className="h-1 w-8 bg-white/20 rounded-full"></div>
                    </div>
                </div>

                {/* LADO DIREITO: O Card com iPhone Flutuante (Vídeo) */}
                <div className="w-full lg:w-1/2 relative">
                    {/* Brilho de fundo (Glow) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linaclyn-red/30 blur-[120px] rounded-full z-0"></div>

                    {/* Adicionei a classe 'animate-bounce' ou 'hover:translate-y-[-10px]' para interatividade */}
                    <div className="relative z-10 bg-gradient-to-b from-white/5 to-transparent p-1 rounded-[3rem] border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden group transition-all duration-700 hover:shadow-linaclyn-red/20">

                        {/* O Vídeo / Card Animado */}
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.8rem] bg-[#0c0c0c]">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            >
                                {/* O segredo está aqui: na pasta public, você começa direto do /videos */}
                                <source src="/videos/Iphone.mp4" type="video/mp4" />
                                Seu navegador não suporta vídeos.
                            </video>

                            {/* Overlay de Vidro no rodapé do Card */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-linaclyn-red font-black text-xs uppercase tracking-widest">Coleção 2026</span>
                                        <h4 className="text-white font-bold text-xl uppercase italic">LinaClyn App Pro</h4>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-linaclyn-red group-hover:border-linaclyn-red transition-all duration-500 cursor-pointer">
                                        →
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Elementos flutuantes decorativos */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-linaclyn-red rounded-tr-2xl animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-white/20 rounded-bl-2xl"></div>
                </div>

            </div>
        </section>
    );
}