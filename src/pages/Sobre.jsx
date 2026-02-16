import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Users,
  Heart,
  Star,
  Award,
  TrendingUp,
  Zap,
  Gem,
  Watch,
  Smartphone,
  Shirt,
  ShoppingBag,
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedSobre";

export default function Sobre() {
  const stats = [
    { icon: Users, value: "50.000+", label: "Clientes Satisfeitos" },
    { icon: Award, value: "1.000+", label: "Produtos Premium" },
    { icon: Star, value: "4.9/5", label: "Avaliação Média" },
    { icon: TrendingUp, value: "99%", label: "Satisfação Total" },
  ];

  const categories = [
    { icon: Watch, title: "Relógios Elegantes", description: "Precisão e estilo em cada detalhe" },
    { icon: Smartphone, title: "Tecnologia de Ponta", description: "Os melhores dispositivos do mercado" },
    { icon: Gem, title: "Joias Sofisticadas", description: "Brilho e elegância únicos" },
    { icon: Shirt, title: "Moda Contemporânea", description: "Estilo que define personalidade" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 border-[1px] border-gray-200 dark:border-gray-800 rounded-xl">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-linaclyn-red rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-linaclyn-red rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3  py-1.5 md:px-4 md:py-2 rounded-full bg-linaclyn-red-light dark:bg-linaclyn-red/20 text-linaclyn-red text-xs md:text-sm font-medium mb-4 md:mb-6 animate-scale-in">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Uma Jornada de Paixão e Dedicação</span>
              <span className="sm:hidden">Paixão e Dedicação</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6 leading-tight px-2">
              Uma Jornada de
              <span className="block text-linaclyn-red">Paixão e Dedicação</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto font-light px-4">
              Estilo, tecnologia e brilho em cada detalhe.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
              <Button
                size="lg"
                className="group w-full sm:w-auto px-6 py-4 md:px-8 md:py-6 text-sm md:text-lg font-semibold bg-linaclyn-red hover:bg-linaclyn-red-dark text-white rounded-xl shadow-lg hover-lift transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Conheça Nossos Produtos</span>
                <span className="sm:hidden">Nossos Produtos</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group w-full sm:w-auto px-6 py-4 md:px-8 md:py-6 text-sm md:text-lg font-semibold border-2 border-linaclyn-red text-linaclyn-red hover:bg-linaclyn-red hover:text-white rounded-xl hover-lift transition-all duration-300"
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Explore as Novidades</span>
                <span className="sm:hidden">Novidades</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-card to-linaclyn-gray-light dark:from-card dark:to-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 lg:p-12 animate-fade-in-up border border-border">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Heart className="w-6 h-6 md:w-8 md:h-8 text-linaclyn-red" />
              <h2 className="text-2xl md:text-3xl font-bold text-card-foreground">Nossa História</h2>
            </div>

            <div className="space-y-4 md:space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p className="animate-fade-in-up">
                A <span className="font-bold text-linaclyn-red">LinaClyn</span> nasceu do sonho de unir o estilo e a inovação em um só lugar. Desde o início, nossa paixão sempre foi oferecer mais do que produtos — proporcionar experiências únicas.
              </p>

              <p className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Cada peça, cada acessório, cada detalhe é pensado com amor e autenticidade. Seja um relógio elegante, um tênis moderno, uma joia sofisticada ou um smartphone de última geração, a LinaClyn acredita que o verdadeiro luxo está na personalidade e na conexão com quem usa.
              </p>

              <p className="animate-fade-in-up font-medium text-foreground" style={{ animationDelay: '0.2s' }}>
                Hoje, somos mais do que uma loja: somos um movimento que celebra o poder da originalidade, do brilho e da atitude. E seguimos firmes nessa jornada — levando o melhor da moda, tecnologia e estilo para o mundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4 px-2">
              Onde Estilo Encontra
              <span className="block text-linaclyn-red">Inovação</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Descubra nossas categorias cuidadosamente selecionadas
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-border hover:border-linaclyn-red transition-all duration-300 hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-linaclyn-red-light dark:bg-linaclyn-red/20 group-hover:bg-linaclyn-red transition-all duration-300 mb-3 md:mb-4">
                    <category.icon className="w-6 h-6 md:w-8 md:h-8 text-linaclyn-red group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-card-foreground mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - O Vermelho Oficial da LinaClyn (Estilo High Performance) */}
      {/* Stats Section - Clean & High Impact */}
      <section className="py-20 bg-linaclyn-red text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Ícone Clean */}
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>

                {/* Número: Forte, mas sem exagero */}
                <div className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none mb-2">
                  <AnimatedCounter value={stat.value} />
                </div>

                {/* Legenda: Simples e Direta */}
                <div className="text-white/80 text-xs md:text-sm font-bold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Mission & Values */}
      <section className="py-12 md:py-20 px-4 bg-linaclyn-gray-light dark:bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Missão */}
            <Card className="bg-card border-2 border-border hover:border-linaclyn-red transition-all duration-300 hover-lift animate-fade-in-up">
              <CardContent className="p-6 md:p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-linaclyn-red-light dark:bg-linaclyn-red/20 mb-3 md:mb-4">
                  <Heart className="w-6 h-6 md:w-7 md:h-7 text-linaclyn-red" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-card-foreground mb-2 md:mb-3">Nossa Missão</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Transformar cada compra em uma experiência única, oferecendo produtos que unem estilo, qualidade e inovação.
                </p>
              </CardContent>
            </Card>

            {/* Visão */}
            <Card className="bg-card border-2 border-border hover:border-linaclyn-red transition-all duration-300 hover-lift animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 md:p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-linaclyn-red-light dark:bg-linaclyn-red/20 mb-3 md:mb-4">
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-linaclyn-red" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-card-foreground mb-2 md:mb-3">Nossa Visão</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Ser a referência em estilo e tecnologia, inspirando pessoas a expressarem sua personalidade única.
                </p>
              </CardContent>
            </Card>

            {/* Valores */}
            <Card className="bg-card border-2 border-border hover:border-linaclyn-red transition-all duration-300 hover-lift animate-fade-in-up sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 md:p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-linaclyn-red-light dark:bg-linaclyn-red/20 mb-3 md:mb-4">
                  <Gem className="w-6 h-6 md:w-7 md:h-7 text-linaclyn-red" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-card-foreground mb-2 md:mb-3">Nossos Valores</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Autenticidade, excelência e inovação guiam cada decisão, garantindo a melhor experiência para você.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}


      {/* --- FINAL CTA: ESTILO ARREDONDADO LINA CLYN --- */}
      <section className="py-24 px-4 relative overflow-hidden bg-background">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 px-2">
            Pronto para Começar sua
            <span className="block text-linaclyn-red">Jornada de Estilo?</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Junte-se a milhares de pessoas que escolheram a LinaClyn para expressar sua personalidade única
          </p>
          <Button
            size="lg"
            className="group px-8 py-5 md:px-10 md:py-6 text-base md:text-lg font-semibold bg-linaclyn-red hover:bg-linaclyn-red-dark text-white rounded-xl shadow-lg hover-lift transition-all duration-300"
          >
            Explorar Produtos
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
}
