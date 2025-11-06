# 🎵 S. Cecília App - Frontend

Este é o repositório do frontend (UI/UX) do projeto S. Cecília. Esta aplicação React consome a API do [S. Cecília Backend](https://github.com/seu-usuario/scecilia-backend) para fornecer uma interface de usuário rica e responsiva.

Construído com **React**, **Vite**, **TypeScript** e **TailwindCSS**, este frontend é otimizado para ser um *Progressive Web App* (PWA) rápido, responsivo e funcional tanto em desktops (para gerenciamento) quanto em tablets/celulares (para músicos).

## Funcionalidades Principais

* **Interface Responsiva (Mobile-First):** Layouts que se adaptam de celular (1 coluna) a desktops (layouts complexos).
* **Renderização de Cifras:** Um visualizador de cifras customizado (estilo CifraClub) com transposição de tom em tempo real.
* **Editor de Cifras Inteligente:** Permite ao usuário colar cifras no formato "cifra em cima/letra embaixo".
* **Gerenciamento de Estado Global:** Uso de `React Context` para gerenciar a autenticação (JWT) e o "Crachá VIP" (contexto) do usuário.
* **Roteamento Protegido:** Separação clara de rotas públicas (`/login`), rotas de membros (`/cifras`) e rotas de admin (`/admin/usuarios`).
* **Painéis Dinâmicos:** O Dashboard muda completamente dependendo do cargo do usuário (Admin, Coordenador ou Músico).
* **Busca Otimizada (Debounce):** O "Montador de Setlist" usa *debounce* para buscar no acervo sem sobrecarregar a API.

## Tecnologias Utilizadas

* **Framework:** [React](https://react.dev/) (com Hooks e Context)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [TailwindCSS](https://tailwindcss.com/)
* **Roteamento:** [React Router DOM](https://reactrouter.com/)
* **Cliente HTTP:** [Axios](https://axios-http.com/)
* **Ícones:** [React Icons](https://react-icons.github.io/react-icons/)

---

## 🚀 Guia de Instalação (Desenvolvimento)

Siga estes passos para rodar o frontend localmente.

### Pré-requisitos

* O **[Backend (S. Cecília API)](https://github.com/seu-usuario/scecilia-backend)** *deve* estar instalado e rodando (na porta `3000`).
* [Node.js](https://nodejs.org/) (v18 ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 1. Instalação do Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/scecilia-frontend.git](https://github.com/seu-usuario/scecilia-frontend.git)
    cd scecilia-frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```

### 2. Rodando o App

1.  Certifique-se de que o backend já está rodando em `http://localhost:3000`.
2.  Inicie o servidor de desenvolvimento do Vite:
    ```bash
    npm run dev
    ```
3.  O servidor estará rodando em `http://localhost:5173` (ou outra porta, se a 5173 estiver em uso).

### 3. Fluxo de Primeiro Uso

1.  Acesse `http://localhost:5173/`.
2.  Você será redirecionado para `/login`.
3.  Use as credenciais do **Admin** criadas pelo *backend* (`admin@scecilia.com` / `admin123`).
4.  Use o painel do Admin para:
    * Ir em "Gerenciar Organização" e criar sua primeira Comunidade, Paróquia e Igreja.
    * Ir em "Gerenciar Usuários" e "Promover" um usuário (que deve se cadastrar via `/register`) para o cargo de `Coordenador`, atrelando-o à Igreja que você criou.
5.  Faça logout e logue como o novo Coordenador para começar a usar o app.
