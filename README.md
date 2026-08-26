# Busquerepo

Aplicação client-side para pesquisar usuários do GitHub, conhecer seus perfis e explorar seus repositórios públicos por popularidade.

O projeto foi desenvolvido para o desafio técnico de Front-End da Desbravador Software, com foco em organização, acessibilidade, responsividade e clareza das decisões técnicas.

## Funcionalidades

- busca e validação de usuários do GitHub com autocomplete, debounce e paginação infinita;
- perfil com avatar, bio, seguidores, seguindo, e-mail, empresa, localização e site;
- carregamento paginado de todos os repositórios públicos do usuário;
- ordenação por mais/menos estrelas, atualização e nome;
- ordenação refletida na URL para permitir compartilhamento;
- página própria de detalhes do repositório;
- links externos seguros para o perfil, projeto e código no GitHub;
- estados de carregamento, vazio, erro, limite da API e página não encontrada;
- layout responsivo baseado no grid e nos breakpoints do Bootstrap;
- navegação por teclado, foco visível e marcação semântica.

## Tecnologias

- React 19 + TypeScript;
- Vite;
- React Router;
- Axios;
- Bootstrap 5;
- Vitest + Testing Library;
- ESLint.

## Como executar

Pré-requisitos: Node.js 20.19+ (ou 22.12+) e npm.

```bash
npm install
npm run dev
```

O Vite exibirá o endereço local no terminal, normalmente `http://localhost:5173`.

## Scripts

```bash
npm run dev        # ambiente de desenvolvimento
npm run build      # checagem TypeScript e build de produção
npm run lint       # análise estática
npm test           # testes automatizados

```

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Busca inicial |
| `/users/:username` | Perfil e repositórios do usuário |
| `/users/:username?sort=updated-desc` | Listagem com ordenação compartilhável |
| `/users/:username/repositories/:repository` | Detalhes do repositório |

## Estrutura

```text
src/
├── api/          # cliente e tratamento de erros da API do GitHub
├── components/   # componentes reutilizáveis e estados de interface
├── hooks/        # carregamento assíncrono e título do documento
├── pages/        # componentes associados às rotas
├── test/         # configuração dos testes
├── types/        # contratos TypeScript da API
└── utils/        # ordenação, caminhos e formatação
```
