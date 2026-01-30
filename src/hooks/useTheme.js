import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");

      // Se não há tema salvo, usar preferência do sistema
      if (!savedTheme) {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const systemTheme = prefersDark ? "dark" : "light";
        setTheme(systemTheme);
        localStorage.setItem("theme", systemTheme);
        document.documentElement.classList.toggle(
          "dark",
          systemTheme === "dark"
        );
      } else {
        setTheme(savedTheme);
        document.documentElement.classList.toggle(
          "dark",
          savedTheme === "dark"
        );
      }

      setMounted(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Salvar no localStorage imediatamente
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");

      // Forçar re-render se necessário
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  return { theme, toggleTheme, mounted };
}