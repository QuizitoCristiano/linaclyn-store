import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, X, Star } from "lucide-react";
import { Button } from "./button";
import { products } from "../../data/products";

const SearchBar = ({ onSearch, placeholder = "Buscar flores, buquês..." }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Filtra produtos baseado no termo de pesquisa
  const filterProducts = (term) => {
    if (!term.trim()) return [];
    
    const lowerTerm = term.toLowerCase();
    return products.filter(product => 
      (product.name && product.name.toLowerCase().includes(lowerTerm)) ||
      (product.description && product.description.toLowerCase().includes(lowerTerm)) ||
      (product.category && product.category.toLowerCase().includes(lowerTerm))
    ).slice(0, 8); // Limita a 8 sugestões
  };

  // Atualiza sugestões quando o termo de pesquisa muda
  useEffect(() => {
    const filtered = filterProducts(searchTerm);
    setSuggestions(filtered);
    setSelectedIndex(-1);
  }, [searchTerm]);

  // Fecha modal quando clica fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegação com teclado
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        selectProduct(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === "Escape") {
      setShowModal(false);
      setIsFocused(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowModal(value.length > 0);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchTerm.length > 0) {
      setShowModal(true);
    }
  };

  const handleSearch = () => {
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm);
    }
    setShowModal(false);
  };

  const selectProduct = (product) => {
    setSearchTerm(product.name);
    setShowModal(false);
    if (onSearch) {
      onSearch(product.name);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowModal(false);
    setSuggestions([]);
    if (onSearch) {
      onSearch("");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="relative w-full max-w-[280px]" ref={modalRef}>
      <div className={`flex items-center bg-background border border-gray-200 rounded-lg sm:rounded-full px-3 py-2 shadow-sm w-full transition-all duration-200 ${
        isFocused ? "ring-2 ring-primary/20 border-primary" : ""
      }`}>
        <Search className="text-muted-foreground mr-2 h-4 w-4 flex-shrink-0" />
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground text-sm"
        />
        
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="h-6 w-6 mr-1 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSearch}
          className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Filter size={16} />
        </Button>
      </div>

      {/* Modal de sugestões */}
      {showModal && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">
              {suggestions.length} resultado{suggestions.length !== 1 ? 's' : ''} encontrado{suggestions.length !== 1 ? 's' : ''}
            </div>
            
            {suggestions.map((product, index) => (
              <div
                key={product.id}
                onClick={() => selectProduct(product)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  index === selectedIndex 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48x48?text=🌵';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <span className="text-sm font-semibold text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate">
                      {product.description}
                    </p>
                    <div className="flex items-center ml-2">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500 ml-1">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-1">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {product.category === 'bouquets' ? 'Buquês' :
                       product.category === 'flowers' ? 'Flores' :
                       product.category === 'indoor' ? 'Interior' :
                       product.category === 'cactus' ? 'Cactos' : product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal vazio quando não há resultados */}
      {showModal && searchTerm.length > 0 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 text-center">
            <div className="text-gray-500 mb-2">Nenhum resultado encontrado</div>
            <div className="text-sm text-gray-400">
              Tente buscar por "flores", "buquês", "cactos" ou "interior"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
