import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';

export function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        // Alterado para bg-background e border-border para respeitar o tema
        <footer className="relative bg-background pt-20 pb-10 overflow-hidden border-t border-border transition-colors duration-300">

            {/* Brilho decorativo: opacidade menor no Light Mode para não ofuscar */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-linaclyn-red/10 dark:bg-linaclyn-red/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Coluna 1: Branding */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <h2 className="text-3xl font-black italic tracking-tighter text-foreground">
                            Lina<span className="text-linaclyn-red">Clyn</span>
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Elevando sua performance e estilo ao próximo nível. Onde tecnologia e moda se encontram.
                        </p>
                        <div className="flex space-x-4">
                            {[Instagram, Facebook, Twitter, Youtube].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:bg-linaclyn-red hover:text-white transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Coluna 2: Navegação */}
                    <div>
                        <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-6">Menu</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                            {['Início', 'Produtos', 'Coleções', 'Sobre Nós'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-linaclyn-red transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-[2px] bg-linaclyn-red mr-0 group-hover:mr-2 transition-all"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coluna 3: Ajuda */}
                    <div>
                        <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-6">Suporte</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                            {['FAQ', 'Envio e Entrega', 'Trocas', 'Privacidade'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-linaclyn-red dark:hover:text-white transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coluna 4: Newsletter */}
                    <div className="space-y-6">
                        <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-6">Fique por dentro</h4>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                // Input agora usa as cores do tema (bg-card / border-border)
                                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-linaclyn-red transition-all"
                            />
                            <button className="absolute right-2 top-1.5 bg-linaclyn-red hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                {/* Linha Inferior */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center md:text-left">
                        © 2026 LINACLYN PERFORMANCE. TODOS OS DIREITOS RESERVADOS.
                    </p>

                    {/* Botão Voltar ao Topo */}
                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to top</span>
                        <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center group-hover:border-linaclyn-red group-hover:bg-linaclyn-red group-hover:text-white transition-all">
                            <ArrowUp size={16} className="group-hover:animate-bounce" />
                        </div>
                    </button>
                </div>
            </div>
        </footer>
    );
}