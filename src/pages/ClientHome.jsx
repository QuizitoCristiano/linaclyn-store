// ClientHome.jsx
import React from 'react';
import { SpecialOffersCarousel } from "@/components/ui/SpecialOffersCarousel";
import { CategoriesAndProducts } from "@/components/ui/CategoriesAndProducts";
import { InteractiveShowcase } from "./InteractiveShowcase";
import { VitrineProdutos } from "@/components/ui/VitrineProdutos";
import { PaginaVitrineDinamica } from "@/components/ui/PaginaVitrineDinamica";
import { ManifestoLinaClyn } from "@/components/ui/ManifestoLinaClyn";
import { WelcomeCoupon } from './WelcomeCoupon';
import { ScrollReveal } from './ScrollReveal';



export default function ClientHome() {
  return (
    <div className="relative bg-background min-h-screen ">

      <section className="relative text-center py-20 px-4 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
          Domine sua <span className="text-linaclyn-red">Performance.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          O controle total dos seus resultados com a precisão tecnológica
          que só a <span className="text-foreground font-semibold border-b-2 border-linaclyn-red">LinaClyn</span> oferece.
        </p>
      </section>


      {/* 3. CONTEÚDO ORGANIZADO POR BLOCOS VISUAIS */}
      <main className="relative z-10 space-y-32 pb-32">

        {/* Carousel - Full Width para imersão */}
        <ScrollReveal>
          <div className="w-full">
            <SpecialOffersCarousel />
          </div>
        </ScrollReveal>

        {/* Manifesto - Contido e elegante */}
        <ScrollReveal>
          <div className="container mx-auto px-4">
            <ManifestoLinaClyn />

          </div>
        </ScrollReveal>

        {/* Vitrine Dinâmica - Grid Style */}
        <ScrollReveal>
          <section className="container mx-auto px-4">

            <PaginaVitrineDinamica />
          </section>
        </ScrollReveal>

        {/* Categories - Darker Background Break */}

        <ScrollReveal>
          <section className="container mx-auto px-4">
            <CategoriesAndProducts />
          </section>
        </ScrollReveal>


        {/* Vitrine de Produtos Principal */}
        <ScrollReveal>
          <section className="container mx-auto px-4">
            <VitrineProdutos />
          </section>
        </ScrollReveal>

        {/* Showcase Final - Impacto */}
        <ScrollReveal>
          <section className="container mx-auto px-4">
            <InteractiveShowcase />
          </section>
        </ScrollReveal>
      </main>

      <WelcomeCoupon />
    </div>
  );
}