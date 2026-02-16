import React from 'react';
import { Shirt, Monitor, Footprints, Watch, ArrowRight } from "lucide-react";

export function CategoriesSection({ activeFilter, onFilterChange }) {
  const categories = [
    { id: "ESTILO & MODA", name: "Estilo & Moda", icon: Shirt },
    { id: "TECNOLOGIA", name: "Tecnologia", icon: Monitor },
    { id: "SPORT & FIT", name: "Sport & Fit", icon: Footprints },
    { id: "ACESSÓRIOS", name: "Acessórios", icon: Watch }
  ];

  return (
    <section className="py-8 px-4 md:px-8 bg-background transition-colors duration-500">
      {/* HEADER DA SEÇÃO */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black  italic uppercase tracking-widest">
            Categorias
          </h2>
          {/* Linha vermelha fixa abaixo do título */}
          <div className="h-1 w-12 bg-red-600 mt-1 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
        </div>

        <button
          onClick={() => onFilterChange('TODAS')}
          className="group flex items-center gap-2  font-black text-[10px] uppercase tracking-tighter hover:text-red-600 transition-all"
        >
          Ver todas <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* GRID DE CATEGORIAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className="group cursor-pointer flex flex-col items-center"
          >
            {/* Círculo do Ícone - Branco com sombra vermelha no Hover */}
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 mb-4
              ${activeFilter === category.id
                ? 'bg-white scale-110 shadow-[0_0_30px_rgba(220,38,38,0.6)] border-2 border-red-600'
                : 'bg-white shadow-lg group-hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] group-hover:scale-110'
              }
            `}>
              <category.icon className="w-10 h-10 text-red-600" />
            </div>

            {/* Nome da Categoria */}
            <span className={`
              text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 text-center italic
              ${activeFilter === category.id ? 'text-red-600' : ' group-hover:text-red-600'}
            `}>
              {category.name}
            </span>

            {/* Linha minimalista que cresce no hover ou quando ativo */}
            <div className={`
              h-0.5 bg-red-600 transition-all duration-500 mt-2 shadow-[0_0_8px_rgba(220,38,38,0.8)]
              ${activeFilter === category.id ? 'w-10' : 'w-0 group-hover:w-8'}
            `}></div>
          </div>
        ))}
      </div>
    </section>
  );
}