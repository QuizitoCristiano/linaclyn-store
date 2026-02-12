import { MoveLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 text-center">
            {/* Background Decorativo - Gradiente LinaClyn */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e31b23_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

            <div className="animate-fade-in-up space-y-6">
                {/* Grande 404 Estilizado */}
                <h1 className="text-9xl font-black tracking-tighter text-linaclyn-red md:text-[12rem] animate-scale-in">
                    404
                </h1>

                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl uppercase italic">
                        Ops! Rota fora de jogo.
                    </h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                        Parece que essa página deu um drible na gente. O conteúdo que você procura
                        não foi encontrado ou foi movido para uma nova categoria.
                    </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex h-12 items-center justify-center rounded-md bg-linaclyn-red px-8 text-sm font-medium text-white shadow transition-all hover:bg-linaclyn-red-dark hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <MoveLeft className="mr-2 h-4 w-4" />
                        Voltar ao Início
                    </Link>

                    <Link
                        href="/produtos"
                        className="inline-flex h-12 items-center justify-center rounded-md border-2 border-linaclyn-red px-8 text-sm font-medium text-linaclyn-red transition-all hover:bg-linaclyn-red-light dark:hover:bg-muted active:scale-95"
                    >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Ver Coleções
                    </Link>
                </div>
            </div>

            {/* Frase Motivacional - Sua Favorita no Footer da página */}
            <footer className="absolute bottom-8 animate-fade-in-up opacity-60 px-6 text-sm italic">
                "Coisas boas acontecem com aqueles que todos esperam, só o que os apressados deixaram para trás."
            </footer>
        </div>
    );
}