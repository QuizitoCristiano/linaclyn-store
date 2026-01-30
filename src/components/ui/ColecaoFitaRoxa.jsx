import React from "react";
import { Button } from "@/components/ui/button";
import FlorRoxa from "../../imagens/flor4.png"; // substitua pelo caminho da sua imagem correta

export default function GaleriaFitaRoxa() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-900 px-6 py-12">
      {/* Imagem principal */}
      <div className="relative mb-6">
        <img
          src={FlorRoxa}
          alt="Buquê com fita roxa"
          className="w-[300px] md:w-[400px] object-contain"
        />
        {/* Elipse roxa simulando base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-linaclyn-red rounded-full opacity-60 blur-sm"></div>
      </div>

      {/* Carrossel de miniaturas (simples) */}
      <div className="flex gap-4 mt-4 overflow-x-auto scrollbar-hide">
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            src={FlorRoxa}
            alt={`Miniatura ${i + 1}`}
            className="w-16 h-16 object-contain border-2 border-transparent hover:border-linaclyn-red rounded-md transition-all"
          />
        ))}
      </div>
    </section>
  );
}