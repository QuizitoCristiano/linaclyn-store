import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartProvider, useCart } from "./CartContext";

// Componente auxiliar para disparar as funções do contexto
const CartTestComponent = () => {
    const { cartItems, addToCart, cartTotal, incrementQuantity } = useCart();
    return (
        <div>
            <div data-testid="cart-count">{cartItems.length}</div>
            <div data-testid="cart-total">{cartTotal}</div>
            <button onClick={() => addToCart({ id: 1, nome: "Produto Real", preco: 100 })}>
                Add Produto
            </button>
            <button onClick={() => addToCart({ id: 2, nome: "Hacker", preco: -50 })}>
                Add Hacker
            </button>
            <button onClick={() => incrementQuantity(1)}>Mais Um</button>
        </div>
    );
};

describe("CartContext - Sistema LinaClyn", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("deve adicionar um produto válido e calcular o total corretamente", () => {
        render(
            <CartProvider>
                <CartTestComponent />
            </CartProvider>
        );

        const addBtn = screen.getByText("Add Produto");

        act(() => {
            addBtn.click();
        });

        expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
        expect(screen.getByTestId("cart-total")).toHaveTextContent("100");
    });

    it("🛡️ SEGURANÇA: Não deve permitir adicionar produtos com preço inválido", () => {
        render(
            <CartProvider>
                <CartTestComponent />
            </CartProvider>
        );

        const hackerBtn = screen.getByText("Add Hacker");

        act(() => {
            hackerBtn.click();
        });

        // O carrinho deve continuar vazio (0)
        expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    });

    it("deve persistir os dados no localStorage ao adicionar item", () => {
        render(
            <CartProvider>
                <CartTestComponent />
            </CartProvider>
        );

        act(() => {
            screen.getByText("Add Produto").click();
        });

        const savedCart = JSON.parse(localStorage.getItem("lina_cart"));
        expect(savedCart[0].nome).toBe("Produto Real");
    });
});