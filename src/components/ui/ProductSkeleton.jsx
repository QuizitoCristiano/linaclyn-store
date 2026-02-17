export function ProductSkeleton() {
    return (
        <div className="bg-card border border-red-600/10 rounded-[1.5rem] overflow-hidden p-4 flex flex-col h-full space-y-4 shadow-lg shadow-red-600/5">
            {/* 1. Imagem Placeholder (Proporção da sua h-44) */}
            <div className="relative h-44 w-full bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl overflow-hidden">
                {/* Efeito de brilho passando (Shimmer) */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* 2. Conteúdo Textual */}
            <div className="space-y-3 flex-grow">
                {/* Nome do Produto */}
                <div className="space-y-1">
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800/50 rounded-full w-3/4 animate-pulse" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800/50 rounded-full w-1/2 animate-pulse" />
                </div>

                {/* Descrição curta */}
                <div className="h-2 bg-zinc-100 dark:bg-zinc-800/30 rounded-full w-full animate-pulse" />
            </div>

            {/* 3. Rodapé (Preço e Botão) */}
            <div className="space-y-3 pt-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800/50 rounded-full w-1/3 animate-pulse" />
                <div className="h-9 bg-red-600/20 rounded-xl w-full animate-pulse border border-red-600/10" />
            </div>
        </div>
    );
}