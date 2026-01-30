// src/components/LoadingOverlay.jsx
import React from 'react';

export default function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                    {/* Animação do círculo externo (mais lento) */}
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin-slow" />
                    {/* Animação do círculo interno (mais rápido e na cor LinaClyn) */}
                    <div className="absolute inset-2 border-4 border-linaclyn-red rounded-full animate-spin" />

                    {/* Ícone ou Logo (opcional, se tiver uma logo em SVG que possa girar) */}
                    {/* <img src="/caminho/para/sua/logo.svg" alt="LinaClyn Loading" className="absolute inset-0 w-full h-full p-2" /> */}
                </div>
                <p className="text-white text-lg font-bold italic tracking-wider animate-pulse">
                    LINA<span className="text-linaclyn-red">CLYN</span>
                </p>
            </div>
        </div>
    );
}