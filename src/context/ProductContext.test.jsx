/* eslint-disable no-undef */
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductProvider, useProducts } from "./ProductContext";

// 1. MOCK COMPLETO DO FIRESTORE
vi.mock("firebase/firestore", () => ({
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    // O onSnapshot é o que estava faltando! 
    // Aqui simulamos ele retornando um produto fictício imediatamente.
    onSnapshot: vi.fn((q, callback) => {
        callback({
            docs: [
                {
                    id: "prod123",
                    data: () => ({
                        nome: "Produto Teste",
                        preco: 50,
                        imagem: "teste.jpg",
                        categoria: "Geral"
                    })
                }
            ]
        });
        return () => {}; // Retorna a função de unsubscribe
    }),
}));

// 2. Componente auxiliar para o teste
const ProductTestComponent = () => {
    const { products, loading } = useProducts();
    if (loading) return <div>Carregando...</div>;
    return (
        <ul>
            {products.map(p => <li key={p.id}>{p.nome}</li>)}
        </ul>
    );
};

describe("ProductContext", () => {
    it("deve carregar produtos do Firestore ao iniciar", async () => {
        render(
            <ProductProvider>
                <ProductTestComponent />
            </ProductProvider>
        );

        // Verifica se o nome do produto que criamos no mock apareceu na tela
        expect(await screen.findByText("Produto Teste")).toBeInTheDocument();
    });
});