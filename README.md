# Banco Digital

Aplicação web que simula um banco digital simples: login, consulta de saldo, extrato e transferência entre contas. Desenvolvida com React, TypeScript e Vite. Os dados são **mockados em memória** (demonstração).


## Como rodar o projeto

### Pré-requisitos

- Node.js 18 ou superior  

### Passos

1. Clone o repositório e entre na pasta do projeto:
   ```bash
   git clone <https://github.com/ermeson119/project-banco-digital.git>
   cd project-banco-digital
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra no navegador: `http://localhost:5173`

### Build local (produção)

```bash
npm run build
npm run preview
```

### Usuários de teste

Credenciais definidas em `src/mock/bancoMock.ts`:

| Email | Senha |
|-------|--------|
| `ermeson@gmail.com` | `123456` |
| `lorrany@gmail.com` | `123456` |

### Outros comandos úteis

```bash
npm run typecheck   # verificação TypeScript
npm run test:run    # testes (Vitest) uma vez
npm run lint        # ESLint
```

## Decisões técnicas adotadas

- **Stack:** Vite, React 18, TypeScript, React Router.
- **Organização:** páginas em `src/pages`, UI reutilizável em `src/components`, regras de acesso aos dados em `src/services/api.ts`, estado fictício em `src/mock/bancoMock.ts`, tipos em `src/types`.
- **Estado global da sessão:** Zustand com persistência no `localStorage` (apenas para manter login na demo).
- **Dados assíncronos na interface:** TanStack Query para saldo, lista de transações e mutação de transferência (cache e invalidação), alinhado ao padrão de consumo de API real.
- **Formulários:** react-hook-form + Zod para validação tipada.
- **Interface:** Tailwind CSS e componentes shadcn/ui (Radix).
- **Testes:** Vitest e Testing Library para fluxos de login e transferência.
- **Dados:** não há backend nem banco; tudo roda em memória no navegador e reinicia ao recarregar a página (exceto sessão persistida pelo Zustand). Adequado para estudo e demonstração, não para produção financeira.

## Melhorias futuras

**Funcionalidades**

- Backend real (REST ou BaaS) com autenticação segura, persistência e regras de negócio no servidor.
- Novos produtos: PIX, boletos, agendamentos, saque, extrato com filtros e exportação.
- Perfil do usuário e notificações (e-mail), com infraestrutura adequada.

**Técnicas**

- Trocar o mock por chamadas HTTP mantendo `api.ts` como camada única de acesso aos dados.
- Testes end-to-end (ex.: Playwright) e pipeline CI com lint, typecheck e testes.
- Hardening de segurança conforme a seção abaixo (HTTPS, CSP, rate limiting, monitoramento).


### Engenharia reversa

Em qualquer SPA, o JavaScript enviado ao navegador pode ser inspecionado; não é possível impedir engenharia reversa por completo.

Mitigações habituais:

- **Build de produção** (`npm run build`): minificação e ofuscação de nomes, remoção de comentários, divisão em chunks (code splitting), o que **dificulta** a leitura mas não elimina o risco.
- **Não colocar no cliente:** segredos (chaves privadas, regras críticas de negócio, lógica que decide limites financeiros). Isso deve ficar em **servidor** ou serviço backend.
- **Sessões e tokens:** preferir tokens de curta duração, refresh controlado no servidor e revogação no logout.
- **Complementares:** Content Security Policy (CSP), limitação de taxa (rate limiting) na API e monitoramento de abuso.

### Vazamento de dados

Proteções esperadas quando houver backend e banco reais:

- **HTTPS** em todo o tráfego para evitar interceptação (MITM).
- **Autenticação e autorização no servidor:** o cliente só exibe o que a API autoriza; decisões de “quem vê o quê” não podem depender só do frontend.
- **Senhas:** nunca em texto puro; armazenar apenas hash forte (ex.: bcrypt, Argon2) no servidor.
- **Banco de dados:** princípio do menor privilégio; políticas por linha (ex.: RLS) ou equivalente para que cada usuário acesse só seus registros.
- **Entradas:** validação e sanitização **no servidor**; o Zod no frontend melhora UX, mas não substitui o backend.
- **CORS** restrito às origens conhecidas da aplicação.
- **Dados sensíveis no navegador:** evitar guardar segredos em `localStorage` sem criptografia e modelo de ameaça claros. Nesta demo, a sessão mock é persistida só para conveniência de teste.

**Sobre este projeto:** os dados são fictícios e mantidos em memória (mock). As medidas acima aplicam-se a uma versão com API, autenticação real e persistência em banco.

