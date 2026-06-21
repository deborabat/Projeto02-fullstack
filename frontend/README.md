## Minha Biblioteca

Aplicação web desenvolvida como Projeto 1 da disciplina **AS64A — Programação Web Fullstack** da UTFPR — Campus Cornélio Procópio.


## Integrante

**Debora Batista Pereira de Almeida**

## Sobre o projeto

O **Minha Biblioteca** é uma Single Page Application (SPA) que permite buscar livros pelo título ou autor utilizando a API pública [OpenLibrary](https://openlibrary.org). Toda a interação acontece dinamicamente na mesma página, sem redirecionamentos.

## 🔧 Tecnologias utilizadas

| Tecnologia | Descrição |

| [React.js](https://react.dev/) | Biblioteca principal para construção da interface |
| [Create React App](https://create-react-app.dev/) | Estrutura base do projeto |
| [OpenLibrary API](https://openlibrary.org/developers/api) | API JSON pública para busca de livros |
| [React Bootstrap](https://react-bootstrap.github.io/) | Biblioteca externa de componentes visuais |
| `useMemo` | Hook React para filtragem eficiente dos resultados |
| Context API | Gerenciamento de estado global entre componentes |


## Estrutura do projeto

```
src/
├── components/
│   ├── SearchForm.jsx   # Formulário de busca com validação
│   ├── BookCard.jsx     # Card individual de cada livro
│   └── BookList.jsx     # Grade de resultados com useMemo
├── contexts/
│   └── BookContext.jsx  # Context API com estado global e chamada à API
├── App.js
└── index.js

public/
└── index.html
```

## Funcionalidades

- Busca de livros por **título**, **autor** ou **termo geral**
- Validação de campo obrigatório antes da consulta a API
- Exibição de mensagem de erro caso a busca não retorne resultados
- Filtro por ano de publicação aplicado com `useMemo`, sem nova requisição à API
- Exibição de capa, título, autor, gênero e ano de cada livro
- Interface responsiva de 1 a 4 colunas conforme o tamanho da tela


## Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/deborabat/ProjetoFullStack

# Entre na pasta do projeto
cd ProjetoFullStack

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

Acesse em: [http://localhost:3000](http://localhost:3000)


## 🔗 Link de acesso

[https://github.com/deborabat/ProjetoFullStack](https://github.com/deborabat/ProjetoFullStack)
