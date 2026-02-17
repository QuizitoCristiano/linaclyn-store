import "@testing-library/jest-dom";
import { vi } from "vitest";

// --- 1. MOCKS DE AMBIENTE E NAVEGADOR ---

// Evita erros de variáveis de ambiente vazias
vi.stubEnv("VITE_FIREBASE_API_KEY", "fake-key");
vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "linaclyn-test");

// CORREÇÃO: window.matchMedia (Resolve o erro "matchMedia is not a function" do useTheme)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// --- 2. MOCK CORINGA PARA O LUCIDE REACT ---
// Resolve automaticamente erros de ícones como "LogIn", "Filter", "Search", etc.
vi.mock("lucide-react", () => {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        return (props) => <div data-testid={`icon-${prop}`} {...props} />;
      },
    },
  );
});

// --- 3. MOCK COMPLETO DO FIREBASE ---

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
  getApp: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  // Simula que não há usuário logado por padrão para não travar o carregamento
  onAuthStateChanged: vi.fn((auth, callback) => {
    if (typeof callback === "function") callback(null);
    return () => {};
  }),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false)),
}));

vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(),
}));
