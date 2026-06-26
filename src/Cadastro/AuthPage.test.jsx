/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthPage from "./AuthPage"; 

// Mock do Contexto - SIMPLES
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: vi.fn(),
    register: vi.fn(),
    loading: false,
    setLoading: vi.fn(),
    resetPassword: vi.fn()
  })
}));

// Mock da Sonner
vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

// Mock do LoadingOverlay (Pode ser o culpado do travamento!)
vi.mock("@/components/ui/LoadingOverlay", () => ({
  default: () => <div data-testid="loading">Carregando...</div>
}));

describe("🛡️ Teste de Renderização", () => {
  it("deve carregar a página sem travar", () => {
    render(<AuthPage onClose={vi.fn()} />);
    // Verifica se o título LINA CLYN aparece
    expect(screen.getByText(/LINA/i)).toBeInTheDocument();
  });
});