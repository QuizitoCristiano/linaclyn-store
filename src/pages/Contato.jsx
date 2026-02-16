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
    <div className="min-h-screen bg-background text-foreground pt-20 md:pt-32 pb-10 md:pb-20 selection:bg-linaclyn-red selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-24">

        {/* 1. HERO SECTION */}
        <section className="relative py-10 md:py-20 border-[1px] border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-card/50">
          <div className="absolute top-0 left-0 w-32 h-32 md:w-52 md:h-52 bg-linaclyn-red rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-linaclyn-red rounded-full blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>


          <div className="text-center py-8 md:py-12 px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-scale-in leading-tight">
              Entre <span className="text-linaclyn-red">em Contato</span>
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Estamos aqui para ajudar você a criar momentos especiais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6">
            <Button size="lg" className="group w-full sm:w-auto h-14 px-8 bg-linaclyn-red hover:bg-linaclyn-red-dark text-white rounded-xl shadow-lg transition-all border-none">
              <ShoppingBag className="w-5 h-5 mr-2" />
              <span>Orçamento</span>
            </Button>
            <Button size="lg" variant="outline" className="group w-full sm:w-auto h-14 px-8 border-2 border-linaclyn-red text-linaclyn-red hover:bg-linaclyn-red hover:text-white rounded-xl transition-all">
              <Zap className="w-5 h-5 mr-2" />
              <span>Falar com Especialista</span>
            </Button>
          </div>
        </section>

        {/* 2. CARDS DE INFO - AGORA COM BORDA VIBRANTE NO LIGHT MODE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-card p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] transition-all group cursor-default
                         border-[1.5px] border-linaclyn-red/20 dark:border-border hover:border-linaclyn-red shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-linaclyn-red transition-all duration-500">
                <item.icon className="w-5 h-5 text-linaclyn-red group-hover:text-white" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">{item.title}</h3>
              <p className="font-bold text-base md:text-lg break-words">{item.info}</p>
              <p className="text-[9px] text-linaclyn-red uppercase mt-2 font-black tracking-widest opacity-100">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* 3. FORMULÁRIO - INPUTS DESTACADOS */}
        <section className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="space-y-8 md:space-y-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                ENVIE UMA <span className="text-linaclyn-red">MENSAGEM</span>
              </h2>
              <div className="h-1.5 w-20 bg-linaclyn-red"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="NOME"
                  className="h-14 md:h-16 text-xs font-bold tracking-widest rounded-xl border-linaclyn-red/30 focus:border-linaclyn-red focus:ring-1 focus:ring-linaclyn-red bg-card"
                />
                <Input
                  placeholder="E-MAIL"
                  type="email"
                  className="h-14 md:h-16 text-xs font-bold tracking-widest rounded-xl border-linaclyn-red/30 focus:border-linaclyn-red focus:ring-1 focus:ring-linaclyn-red bg-card"
                />
              </div>
              <Input
                placeholder="ASSUNTO"
                className="h-14 md:h-16 text-xs font-bold tracking-widest rounded-xl border-linaclyn-red/30 focus:border-linaclyn-red focus:ring-1 focus:ring-linaclyn-red bg-card"
              />
              <Textarea
                placeholder="DESCREVA SUA SOLICITAÇÃO..."
                rows={4}
                className="text-xs font-bold tracking-widest rounded-xl p-6 border-linaclyn-red/30 focus:border-linaclyn-red focus:ring-1 focus:ring-linaclyn-red bg-card"
              />

              <Button disabled={isSubmitting} className="w-full bg-foreground text-background font-black h-14 md:h-16 rounded-xl hover:bg-linaclyn-red hover:text-white transition-all shadow-lg">
                {isSubmitting ? "PROCESSANDO..." : "FINALIZAR CONTATO"}
                <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* MAPA BRANDING */}
          <div className="relative min-h-[350px] md:min-h-[500px] bg-card border-[1.5px] border-linaclyn-red/20 dark:border-border rounded-[2rem] md:rounded-[3rem] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-10 grayscale"></div>
            <div className="relative z-10 p-6 md:p-12 text-center">
              <div className="w-20 h-20 bg-linaclyn-red rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(227,27,35,0.4)]">
                <MapPin size={32} className="text-white" />
              </div>
              <h4 className="text-2xl md:text-3xl font-black uppercase italic mb-2 tracking-tighter">LINA<span className="text-linaclyn-red">CLYN</span></h4>
              <p className="text-muted-foreground font-bold uppercase tracking-[0.1em] text-xs md:text-sm">
                a da Inovação, 1000<br />
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