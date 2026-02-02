import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Importe sua imagem local
import Quizito from '../../imagens/quizito.png';
import BuleRed from '../../imagens/Nike_Academy.png'
import Quizito1 from '../../imagens/Quizito4.png'
import Quizito2 from '../../imagens/Quizito2.png'

export function SpecialOffersCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const offers = [
    {
      id: 1,
      title: "Oferta Especial LinaClyn",
      discount: "40",
      badge: "Tempo Limitado!",
      disclaimer: "Serviços premium com tecnologia de ponta",
      image: BuleRed,
    },
    {
      id: 2,
      title: "Oportunidade Imperdível",
      discount: "50",
      badge: "Corre que acaba!",
      disclaimer: "Estoque exclusivo para membros VIP",
      image: Quizito,
    },
    {
      id: 3,
      title: "Mega Final de Semana",
      discount: "35",
      badge: "Só este Sábado e Domingo!",
      disclaimer: "Válido até domingo às 23:59",
      image: Quizito1,
    },
    {
      id: 4,
      title: "Alta Performance",
      discount: "25",
      badge: "Resultados Reais",
      disclaimer: "Turbine seu negócio com a LinaClyn",
      image: Quizito2,
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % offers.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);

  const currentOffer = offers[currentSlide];


  // Ajuste de imagem para deploy.

  return (
    <section className="py-4 px-4 md:px-0">
      {/* Header do Carrossel */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">#EspecialParaVocê</h2>
        <button className="text-primary text-sm font-semibold hover:underline transition-all">
          See all
        </button>
      </div>

      <div className="relative group">
        {/* Card Principal */}
        <div className="relative overflow-hidden rounded-[2rem] bg-linaclyn-carousel h-[200px] md:h-[320px] flex items-center shadow-2xl transition-all duration-500">

          {/* Camada de Texto */}
          <div className="relative z-20 flex flex-col justify-center h-full pl-6 md:pl-16 w-[60%] md:w-[55%]">
            <div className="animate-fade-in-up">
              <span className="bg-white text-black text-[10px] md:text-xs px-3 py-1 rounded-full font-bold shadow-sm uppercase tracking-wider">
                {currentOffer.badge}
              </span>

              <h3 className="text-xl md:text-5xl font-extrabold text-white mt-2 md:mt-4 leading-tight drop-shadow-md">
                {currentOffer.title}
              </h3>

              <div className="flex items-baseline mt-1 md:mt-4">
                <span className="text-white text-xs md:text-2xl font-light opacity-90 uppercase">Até</span>
                <span className="text-white text-3xl md:text-8xl font-black ml-2 drop-shadow-lg">
                  {currentOffer.discount}
                </span>
                <span className="text-white text-xl md:text-4xl font-bold ml-1">% OFF</span>
              </div>

              <p className="text-white/80 text-[10px] md:text-sm mt-1 md:mt-4 italic hidden sm:block">
                {currentOffer.disclaimer}
              </p>

              <div className="mt-4 md:mt-8">
                <Button className="bg-linaclyn-red hover:bg-linaclyn-red-dark text-white px-8 md:px-12 h-9 md:h-14 rounded-full text-xs md:text-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                  Aproveitar Agora
                </Button>
              </div>
            </div>
          </div>

          {/* Imagem da Modelo */}
          <div className="absolute right-0 bottom-0 h-full w-[45%] md:w-[50%] z-10 flex items-end justify-end">
            <img
              key={currentSlide}
              src={currentOffer.image}
              alt={currentOffer.title}
              className="h-[95%] md:h-[110%] w-full object-contain object-bottom transform translate-y-2 md:translate-y-6 animate-scale-in"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Setas de Navegação */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2 z-30 opacity-0 group-hover:opacity-100 transition-all hidden md:block">
          <ChevronLeft size={28} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2 z-30 opacity-0 group-hover:opacity-100 transition-all hidden md:block">
          <ChevronRight size={28} />
        </button>

        {/* Paginação */}
        <div className="flex justify-center mt-6 gap-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full h-1.5 ${index === currentSlide ? "w-8 bg-linaclyn-red" : "w-2 bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}