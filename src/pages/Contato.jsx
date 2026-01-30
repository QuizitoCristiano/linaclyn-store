import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin, Phone, Mail, Clock, MessageCircle,
  Send, Headphones, ShoppingBag, Zap
} from "lucide-react";

export default function Contato() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert("Mensagem enviada para a central LinaClyn!");
    setIsSubmitting(false);
    setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
  };

  const contactInfo = [
    { icon: Phone, title: "Telefone", info: "(+55) 11 99999-9999", subtitle: "Suporte Imediato" },
    { icon: Mail, title: "E-mail", info: "contato@linaclyn.com.br", subtitle: "Resposta em 2h" },
    { icon: MapPin, title: "Sede", info: "Tech Park, 1000", subtitle: "Curitiba, PR" },
    { icon: Clock, title: "Operação", info: "24/7 Digital", subtitle: "Sempre Ativos" },
  ];

  return (
    // Alterado para bg-background e text-foreground para seguir o tema do sistema
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 selection:bg-linaclyn-red selection:text-white">

      <div className="max-w-7xl mx-auto px-4 space-y-24">

        {/* 1. HERO SECTION UNIFICADA (Responde ao Dark/Light) */}
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

        {/* 2. CARDS DE INFO (Adaptados para Light/Dark) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactInfo.map((item, index) => (
            <div key={index} className="bg-card border border-border p-8 rounded-[2rem] hover:border-linaclyn-red/50 transition-all group cursor-default">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-6 group-hover:bg-linaclyn-red transition-all duration-500 group-hover:rotate-[360deg]">
                <item.icon className="w-5 h-5 text-linaclyn-red group-hover:text-white" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">{item.title}</h3>
              <p className="font-bold text-sm md:text-base leading-tight">{item.info}</p>
              <p className="text-[9px] text-linaclyn-red uppercase mt-2 font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* 3. FORMULÁRIO E MAPA */}
        <section className="grid lg:grid-cols-2 gap-16 items-stretch">
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                ENVIE UMA <span className="text-linaclyn-red">MENSAGEM</span>
              </h2>
              <div className="h-1 w-20 bg-linaclyn-red"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="NOME"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="bg-card border-border h-16 focus:ring-linaclyn-red focus:border-linaclyn-red text-xs font-bold tracking-widest rounded-xl"
                />
                <Input
                  placeholder="E-MAIL"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-card border-border h-16 focus:ring-linaclyn-red focus:border-linaclyn-red text-xs font-bold tracking-widest rounded-xl"
                />
              </div>
              <Input
                placeholder="ASSUNTO"
                value={formData.assunto}
                onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                className="bg-card border-border h-16 focus:ring-linaclyn-red focus:border-linaclyn-red text-xs font-bold tracking-widest rounded-xl"
              />
              <Textarea
                placeholder="DESCREVA SUA SOLICITAÇÃO..."
                rows={5}
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                className="bg-card border-border focus:ring-linaclyn-red focus:border-linaclyn-red text-xs font-bold tracking-widest rounded-xl p-6"
              />

              <Button
                disabled={isSubmitting}
                className="w-full bg-foreground text-background font-black uppercase h-16 rounded-xl hover:bg-linaclyn-red hover:text-white transition-all group"
              >
                {isSubmitting ? "PROCESSANDO..." : "FINALIZAR CONTATO"}
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>

          {/* MAPA BRANDING (Também se ajusta) */}
          <div className="relative min-h-[500px] bg-card border border-border rounded-[3rem] overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-10 dark:opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000"></div>

            <div className="relative z-10 p-12 text-center">
              <div className="w-20 h-20 bg-linaclyn-red rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(227,27,35,0.4)]">
                <MapPin size={32} className="text-white" />
              </div>
              <h4 className="text-3xl font-black uppercase italic mb-4 tracking-tighter">HQ LINA<span className="text-linaclyn-red">CLYN</span></h4>
              <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-sm">
                Rua da Inovação, 1000<br />
                Global Tech District<br />
                Curitiba - PR
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}