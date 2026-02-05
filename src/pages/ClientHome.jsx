import { SpecialOffersCarousel } from "@/components/ui/SpecialOffersCarousel";
import { CategoriesSection } from "@/components/ui/CategoriesSection";
import { CategoriesAndProducts } from "@/components/ui/CategoriesAndProducts";
import { InteractiveShowcase } from "./InteractiveShowcase";
import { VitrineProdutos } from "@/components/ui/VitrineProdutos";

export default function ClientHome() {
  return (
    <div className="space-y-6 bg-background min-h-screen">
      {/* Hero Section - Onde o impacto acontece */}
      <section className="text-center py-16 px-4 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
          Domine sua <span className="text-linaclyn-red">Performance.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          O controle total dos seus resultados com a precisão tecnológica
          que só a <span className="text-foreground font-semibold border-b-2 border-linaclyn-red">LinaClyn</span> oferece.
        </p>
      </section>

      {/* Carrossel de Ofertas */}
      <section className="container mx-auto">
        <SpecialOffersCarousel />
      </section>

      {/* Seção de Categorias */}
      <section className="container mx-auto pb-20">
        <CategoriesSection />
      </section>

      <section className="container mx-auto pb-20">
        <CategoriesAndProducts />
      </section>


      <section className="container mx-auto pb-20">
        < InteractiveShowcase />
      </section>


      <section className="container mx-auto pb-20">
        < VitrineProdutos />
      </section>



    </div>
  );
}