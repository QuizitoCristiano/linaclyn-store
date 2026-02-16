import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Lightbulb,
  Headphones,
  ShoppingBag,
  Zap,
  Shield,
  Rocket,
  Palette,
  Smartphone,
  Settings,
  CheckCircle2,
  Users,
  Clock,
  Star
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedSobre";



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
    { value: "500+", label: "Projetos Entregues", icon: CheckCircle2 },
    { value: "98%", label: "Satisfação do Cliente", icon: Users },
    { value: "24/7", label: "Suporte Disponível", icon: Clock },
    { value: "10+", label: "Anos de Experiência", icon: Star },
  ];



  return (
    <>
      <div className="min-h-screen bg-background text-foreground">

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
        {/* Hero Section - Foco em impacto e tipografia pesada */}


        {/* Services Grid - Menos cores, mais autoridade */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border border-border/60 bg-card/40 backdrop-blur-md hover:border-linaclyn-red transition-all duration-500 hover-lift animate-scale-in shadow-sm hover:shadow-xl"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-8">
                    {/* O "QUADRADINHO" DO ÍCONE:
                - No Light Mode: Já nasce Vermelho LinaClyn com ícone Branco.
                - No Dark Mode: Nasce cinza discreto e acende no hover.
            */}
                    <div className={`
              inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 transition-all duration-500 
              
              /* ESTADO INICIAL (Modo Claro): Fundo Vermelho, Ícone Branco */
              bg-linaclyn-red text-white shadow-[0_5px_15px_rgba(231,34,46,0.3)]
              
              /* ESTADO INICIAL (Modo Escuro): Fundo Cinza Tech, Ícone Cinza */
              dark:bg-secondary dark:text-zinc-400 
              
              /* COMPORTAMENTO NO HOVER (Modo Escuro): Acende o Vermelho */
              dark:group-hover:bg-linaclyn-red dark:group-hover:text-white
              
              /* EFEITO DE MOVIMENTO: Dá um 'pop' em qualquer modo */
              group-hover:scale-110 group-hover:shadow-[0_8px_25px_rgba(231,34,46,0.5)]
            `}>
                      <service.icon className="w-7 h-7" />
                    </div>

                    {/* Título com Tipografia Premium Sport */}
                    <h3 className="text-xl font-black uppercase italic tracking-tight text-card-foreground mb-3 group-hover:text-linaclyn-red transition-colors">
                      {service.title}
                    </h3>

                    {/* Descrição */}
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-medium">
                      {service.description}
                    </p>

                    {/* Lista de Features com Checkpoint Vermelho */}
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-linaclyn-red" />
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

        {/* Stats Section - O Vermelho Oficial da LinaClyn */}
        <section className="py-24 bg-linaclyn-red text-white">
          <div className="max-w-6xl mx-auto px-4 text-center italic font-black uppercase">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="animate-fade-in-up">
                  <div className="text-4xl md:text-6xl mb-2 tracking-tighter italic leading-none">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-white/60 text-[10px] md:text-xs tracking-[0.2em] font-black uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Estilo "Call to Action" de Startup de Elite */}
        <section className="py-24 px-4 bg-background">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8">
              Pronto para o <br />
              <span className="text-linaclyn-red">Próximo Nível?</span>
            </h2>
            <Button
              size="lg"
              className="group px-12 py-8 text-xl font-black uppercase italic bg-foreground text-background hover:bg-linaclyn-red hover:text-white rounded-2xl shadow-2xl transition-all duration-500"
            >
              Começar Agora
              <Rocket className="w-6 h-6 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
