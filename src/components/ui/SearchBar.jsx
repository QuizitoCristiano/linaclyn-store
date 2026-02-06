import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "./button";
import { products } from "@/data/products";

const SearchBar = ({ onSearch, placeholder = "BUSCAR EQUIPAMENTO..." }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const modalRef = useRef(null);

  // 1. FILTRO RESTRITIVO (DELETA FLORES)
  const filterProducts = (term) => {
    if (!term.trim()) return [];
    const lowerTerm = term.toLowerCase();

    // Lista de palavras que VAMOS BANIR do seu sistema
    const banidos = ["rosa", "flor", "buquê", "buque", "girassol", "cacto", "planta", "arranjo"];

    return products.filter(product => {
      const name = product.name?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";

      // Só passa se o nome bater com a letra E se não tiver nenhuma palavra de flor
      const matchesSearch = name.includes(lowerTerm) || category.includes(lowerTerm);
      const isNotFlower = !banidos.some(palavra => name.includes(palavra) || category.includes(palavra));

      return matchesSearch && isNotFlower;
    }).slice(0, 5);
  };

  useEffect(() => {
    const filtered = filterProducts(searchTerm);
    setSuggestions(filtered);
    setShowModal(searchTerm.length > 0);
  }, [searchTerm]);

  // Função de Scroll (Para onde o cara clicou)
  const handleSelect = (productId) => {
    setSearchTerm("");
    setShowModal(false);
    const element = document.getElementById(`product-${productId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="relative w-full max-w-[320px]" ref={modalRef}>
      <div className="flex items-center transition-all duration-300 rounded-full px-1.5 py-1.5 border-2 border-transparent bg-secondary/40 dark:bg-[#1a1a1a] focus-within:border-linaclyn-red">

        <Search className="ml-4 h-4 w-4 text-white/40" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-white placeholder:text-white/20 text-[11px] font-black italic tracking-widest px-3 uppercase"
        />

        {/* ÍCONE EM BLOCO QUADRADO (COMO VOCÊ PEDIU) */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-linaclyn-red text-white rounded-xl h-9 w-10 hover:bg-red-700 transition-all active:scale-95 shadow-lg"
        >
          <Filter size={18} strokeWidth={2.5} />
        </Button>
      </div>

      {/* MODAL DE RESULTADOS (SÓ EQUIPAMENTOS REAIS) */}
      {showModal && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="p-2 border-b border-white/5 bg-white/5 text-center">
            <span className="text-[9px] font-black italic text-white/40 tracking-[0.2em] uppercase">
              Sugestões LinaClyn
            </span>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {suggestions.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelect(product.id)}
                className="flex items-center p-3 hover:bg-white/5 cursor-pointer transition-all group border-b border-white/5 last:border-0"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/10 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>

                <div className="flex-1 ml-4 text-left">
                  <h4 className="font-black italic text-[11px] text-white uppercase truncate group-hover:text-linaclyn-red">
                    {product.name}
                  </h4>
                  <p className="text-[10px] font-bold text-linaclyn-red uppercase">
                    {product.category} • R$ {product.price}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-linaclyn-red opacity-0 group-hover:opacity-100 transform translate-x-[-5px] group-hover:translate-x-0 transition-all" />
              </div>
            ))}
          </div>

          <div className="p-2 bg-white/[0.02] text-center border-t border-white/5">
            <p className="text-[8px] font-bold text-white/20 italic uppercase px-2">
              "Coisas boas acontecem com quem espera o que os apressados deixaram para trás"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;