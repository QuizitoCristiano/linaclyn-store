import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Code,
  Lightbulb,
  Headphones,
  ShoppingBag,
  Zap,
  Shield,
  Rocket,
  Palette,
  Smartphone,
  Globe,
  Settings,
} from "lucide-react";


export default function Servicos() {
  const services = [
    {
      icon: Code,
      title: "Desenvolvimento Web",
      description: "Soluções web modernas e responsivas para sua empresa. Criamos sites que impressionam e convertem.",
      features: ["Design Responsivo", "Performance Otimizada", "SEO Integrado"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Lightbulb,
      title: "Consultoria",
      description: "Orientação especializada para otimizar seus processos e maximizar seus resultados.",
      features: ["Análise Estratégica", "Planejamento Personalizado", "Implementação Guiada"],
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Headphones,
      title: "Suporte Técnico",
      description: "Suporte 24/7 para garantir o funcionamento perfeito do seu negócio.",
      features: ["Atendimento 24/7", "Resposta Rápida", "Soluções Eficazes"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Smartphone,
      title: "Apps Mobile",
      description: "Desenvolvimento de aplicativos móveis nativos e multiplataforma para iOS e Android.",
      features: ["iOS e Android", "Interface Intuitiva", "Performance Premium"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Palette,
      title: "Design Gráfico",
      description: "Criação de identidade visual e materiais gráficos que destacam sua marca no mercado.",
      features: ["Identidade Visual", "Materiais Gráficos", "Branding Completo"],
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Rocket,
      title: "Marketing Digital",
      description: "Estratégias de marketing digital para aumentar sua presença online e atrair mais clientes.",
      features: ["Redes Sociais", "SEO/SEM", "Conteúdo Estratégico"],
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Segurança Digital",
      description: "Proteção completa para seus dados e sistemas com as melhores práticas de segurança.",
      features: ["Proteção de Dados", "Backup Automático", "Monitoramento 24/7"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Settings,
      title: "Manutenção",
      description: "Manutenção preventiva e corretiva para manter seus sistemas sempre atualizados.",
      features: ["Atualizações Regulares", "Monitoramento Contínuo", "Otimização Constante"],
      color: "from-gray-500 to-slate-500"
    },
  ];

  const stats = [
    { value: "500+", label: "Projetos Entregues" },
    { value: "98%", label: "Satisfação do Cliente" },
    { value: "24/7", label: "Suporte Disponível" },
    { value: "10+", label: "Anos de Experiência" },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 from-purple-50 to-pink-50 border-[1px] border-gray-200 dark:border-gray-800 rounded-xl dark:bg-transparent">
          <div className="absolute top-0 left-0 w-52 h-52 bg-linaclyn-red rounded-full blur-3xl opacity-5 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-linaclyn-red rounded-full blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>



          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground dark:text-secondary-foreground mb-4  animate-scale-in">
              Entre <span className=" text-linaclyn-red dark:text-primary-500">em Contato</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-tight ">
              Estamos aqui para ajudar você a criar momentos especiais.
              Entre em contato conosco e descubra como podemos transformar sua ocasião.
            </p>


            {/* CTA Buttons */}

          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              className="group w-full sm:w-auto px-6 py-4 md:px-8 md:py-6 text-sm md:text-lg font-semibold bg-linaclyn-red hover:bg-linaclyn-red-dark text-white rounded-xl shadow-lg hover-lift transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Solicite um Orçamento</span>
              <span className="sm:hidden">Orçamento</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group w-full sm:w-auto px-6 py-4 md:px-8 md:py-6 text-sm md:text-lg font-semibold border-2 border-linaclyn-red text-linaclyn-red hover:bg-linaclyn-red hover:text-white rounded-xl hover-lift transition-all duration-300"
            >
              <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Fale com Especialista</span>
              <span className="sm:hidden">Contato</span>
            </Button>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-2 border-border hover:border-linaclyn-red transition-all duration-300 hover-lift animate-scale-in bg-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6 md:p-8">
                    {/* Icon with gradient background */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${service.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <service.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-card-foreground mb-2 group-hover:text-linaclyn-red transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-linaclyn-red"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-linaclyn-red to-linaclyn-red-dark text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/90 text-xs md:text-sm lg:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 md:py-20 px-4 bg-linaclyn-gray-light dark:bg-card/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-16 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4 px-2">
                Por Que Escolher a
                <span className="block text-linaclyn-red">LinaClyn?</span>
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Comprometidos com a excelência e resultados que superam expectativas
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              <Card className="bg-card border-2 border-border hover:border-linaclyn-red transition-all duration-300 hover-lift animate-fade-in-up">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-linaclyn-red-light dark:bg-linaclyn-red/20 mb-3 md:mb-4">
                    <Rocket className="w-6 h-6 md:w-7 md:h-7 text-linaclyn-red" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-card-foreground mb-2 md:mb-3">
                    Resultados Rápidos
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Entregamos projetos eficientemente sem comprometer a qualidade.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-border hover:border-linaclyn-red transition-all duration-300 hover-lift animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-linaclyn-red-light dark:bg-linaclyn-red/20 mb-3 md:mb-4">
                    <Shield className="w-6 h-6 md:w-7 md:h-7 text-linaclyn-red" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-card-foreground mb-2 md:mb-3">
                    Qualidade Garantida
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Padrões de excelência em cada projeto que desenvolvemos.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-2 border-border hover:border-linaclyn-red transition-all duration-300 hover-lift animate-fade-in-up sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-linaclyn-red-light dark:bg-linaclyn-red/20 mb-3 md:mb-4">
                    <Headphones className="w-6 h-6 md:w-7 md:h-7 text-linaclyn-red" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-card-foreground mb-2 md:mb-3">
                    Suporte Dedicado
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Equipe sempre disponível para ajudar e resolver suas dúvidas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-linaclyn-red-light dark:from-linaclyn-red/10 to-background">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 px-2">
              Pronto para Transformar seu
              <span className="block text-linaclyn-red">Negócio?</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Entre em contato conosco e descubra como podemos ajudar você a alcançar seus objetivos
            </p>
            <Button
              size="lg"
              className="group px-8 py-5 md:px-10 md:py-6 text-base md:text-lg font-semibold bg-linaclyn-red hover:bg-linaclyn-red-dark text-white rounded-xl shadow-lg hover-lift transition-all duration-300"
            >
              Solicitar Orçamento
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </section>
      </div>



    </>

  );
}
