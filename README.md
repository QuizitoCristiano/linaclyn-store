## 🔗 Demonstração

> **Link do Projeto:** [https://linaclyn-app.vercel.app/](https://linaclyn-app.vercel.app/)

---

## 🛠️ Stack Tecnológica

Para garantir velocidade e SEO de qualidade, utilizei as melhores ferramentas do mercado:

- **Front-End:** [React](https://reactjs.org/) & [Next.js](https://nextjs.org/) (App Router).
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com suporte nativo a **Dark Mode**.
- **Componentes UI:** Shadcn/UI e Lucide React para ícones.
- **Gerenciamento de Estado:** Context API (organizado em contextos de Autenticação, Carrinho, Produtos e Chat).
- **Notificações:** Sonner (Toast dinâmico e responsivo).
- **Versionamento:** Git & GitHub.

---

## 🌟 Funcionalidades de Destaque

### 1. Sistema de Checkout Blindado

Um fluxo de finalização de compra pensado para conversão, com validações em tempo real e interface limpa para reduzir o abandono de carrinho.

### 2. Identidade Visual Dinâmica

- **Dark & Light Mode:** Implementação via variáveis CSS customizadas, permitindo que a marca **LinaClyn** mantenha sua vibração e elegância em qualquer tema.
- **Cores Personalizadas:** Uso da paleta vibrante (`#E31B23`) em gradientes e componentes interativos.

### 3. Segurança Digital (Ethical Hacking Mindset)

- **Proteção Anti-Bot:** Implementação de campos **Honeypot** (armadilhas invisíveis) para proteger o sistema contra spam e automações maliciosas sem prejudicar a experiência do usuário real.

### 4. Gestão Administrativa

Painel de controle integrado para gerenciamento de produtos, pedidos e mensagens de clientes, permitindo total autonomia na operação da loja.

---

## 📂 Organização do Código (Arquitetura)

O projeto segue uma estrutura modular e organizada para facilitar a manutenção:

```text
├── src/
│   ├── components/
│   │   ├── ui/         # Componentes base (Botões, Inputs, Cards)
│   │   ├── Header/     # Componente de navegação inteligente
│   │   └── Footer/     # Rodapé institucional
│   ├── context/        # Lógica de negócio (AuthContext, CartContext, etc.)
│   ├── pages/          # Páginas principais (Home, Sobre, Contato, 404)
│   ├── AdiminProtudos/ # Módulos administrativos e Dashboard
│   └── styles/         # Configurações globais e temas
└── tailwind.config.js  # Configurações de design system
```

Quizito Cristiano

## 👤 Desenvolvedor

**Quizito Cristiano**

- 💼 **LinkedIn:** [Acessar Perfil](https://www.linkedin.com/in/quizito-cristiano-0b450a361/)
- 💻 **GitHub:** [Repositório do Projeto](https://github.com/QuizitoCristiano/linaclyn-store)
- 🌐 **Deploy:** [LinaClyn App](https://linaclyn-app.vercel.app/)

### **28/08/2025 - Implementação Completa de Testes**

- ✅ Sistema de testes com Vitest implementado
- ✅ Cobertura de código com relatórios detalhados
- ✅ Factories para criação de dados de teste
- ✅ Testes para todas as rotas principais
- ✅ Correção de bugs de conexão com banco
- ✅ Validações robustas para casos de sucesso e erro
- ✅ Limpeza automática de dados de teste
- ✅ Cobertura geral melhorada de 59.89% para 74.4%

---

## 🧪 Ambiente de Testes

Para instalar as dependências de testes utilizadas neste projeto e rodar a suíte de testes:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm test
## Elevação da cobertura de código para 74.4% (de 59.89%).
```
