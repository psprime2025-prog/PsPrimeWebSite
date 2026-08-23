# PsPrime

Loja online de consolas, comandos, jogos e acessórios PlayStation seminovos. Next.js (App
Router) + TypeScript + Tailwind CSS + Prisma (PostgreSQL/Supabase) + Stripe (Cartão, Multibanco,
MB WAY) + NextAuth (administração).

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **Estilos:** Tailwind CSS 3 (paleta PsPrime em `tailwind.config.ts`)
- **Base de dados:** PostgreSQL via Supabase, ORM Prisma 6
- **Pagamentos:** Stripe (Cartão, Multibanco, MB WAY)
- **Autenticação de administração:** NextAuth v4 (credenciais, admin único — v1 sem contas de cliente)
- **Carrinho:** Zustand + localStorage
- **Email transacional:** Resend
- **Imagens de produtos:** Supabase Storage + `next/image`

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local   # preenche os valores (ver abaixo)
npx prisma migrate dev       # cria as tabelas na base de dados
npm run db:seed              # popula categorias e produtos de exemplo
npm run dev
```

> O Prisma CLI (`migrate`, `db:seed`, `studio`) lê variáveis de um ficheiro `.env` — se preferires
> manter tudo só em `.env.local`, copia-o também para `.env` em desenvolvimento (`.env` está no
> `.gitignore`, nunca é commitado).

Abre [http://localhost:3000](http://localhost:3000).

### Criar a password de administração

Não há registo de clientes na v1 — apenas um admin único, autenticado por credenciais fixas em
variáveis de ambiente.

```bash
node -e "console.log(require('bcryptjs').hashSync('a-tua-password-aqui', 10))"
```

Copia o hash gerado para `ADMIN_PASSWORD_HASH` no `.env.local` (e mais tarde no hPanel, em
produção). Define também `ADMIN_EMAIL` e gera um `NEXTAUTH_SECRET` com `openssl rand -base64 32`.

## Variáveis de ambiente

Ver `.env.example` para a lista completa e comentada. Resumo:

| Variável | Onde obter |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Supabase → Project Settings → Database |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks (endpoint `/api/webhooks/stripe`) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` | à tua escolha (ver acima) |
| `RESEND_API_KEY` | resend.com → API Keys |

## Estrutura do projeto

```
app/            rotas (App Router), páginas públicas, /admin, /api
components/     componentes React reutilizáveis
lib/            Prisma client, Stripe, auth, formatação, constantes de negócio
prisma/         schema.prisma, migrations, seed.ts
```

## Dados legais e de negócio

Estão centralizados em `lib/constants.ts` (nome, morada, contactos, NIF, portes de envio).

**IMPORTANTE:** o NIF está por preencher (`STORE.nif = null`). É um requisito legal para lojas
online em Portugal — preenche este campo antes do lançamento público. A página
`/legal/termos` mostra um aviso visível enquanto o campo estiver vazio.

## Pagamentos Stripe — Multibanco e MB WAY

No Stripe Dashboard (modo teste primeiro), em **Settings → Payment methods**, ativa
explicitamente **Multibanco** e **MB WAY** (nem sempre vêm ativos por definição, mesmo para
contas com país Portugal). Sem isto, `payment_intent.create` com esses métodos falha.

Fluxo implementado (`app/api/checkout/route.ts` + `components/checkout/PaymentStep.tsx`):

1. Cliente escolhe o método no checkout → criamos um `PaymentIntent` restrito a esse
   `payment_method_type`.
2. **Cartão:** `stripe.confirmPayment` com o Payment Element; 3DS tratado automaticamente pelo Stripe.
3. **Multibanco:** `confirmPayment` com `redirect: "if_required"` devolve
   `next_action.multibanco_display_details` (entidade, referência, valor) sem sair da página —
   mostramos esses dados diretamente e também os enviamos por email. A referência é válida
   ~7 dias; o webhook `payment_intent.succeeded` marca a encomenda como "Pago" automaticamente.
4. **MB WAY:** o cliente aprova o pagamento na app; mostramos "a aguardar confirmação" e fazemos
   polling a `/api/orders/[id]/status` até o webhook confirmar.

### Trocar chaves de teste por chaves reais (produção)

1. No Stripe Dashboard, ativa a conta em modo "Live" (dados da empresa, IBAN, etc.).
2. Vai a **Developers → API keys** (modo Live) e copia `sk_live_...` e `pk_live_...`.
3. Cria um novo webhook endpoint em modo Live apontando para
   `https://o-teu-dominio.pt/api/webhooks/stripe`, com o evento `payment_intent.succeeded`
   (e opcionalmente `payment_intent.payment_failed`, `payment_intent.requires_action`). Copia o
   `whsec_...` gerado.
4. Substitui `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` e `STRIPE_WEBHOOK_SECRET`
   pelas versões Live nas variáveis de ambiente de produção (hPanel).
5. Confirma no Dashboard (modo Live) que Multibanco e MB WAY estão ativos.
6. Faz uma compra de teste real de baixo valor para confirmar o fluxo ponta a ponta antes de
   anunciar o lançamento.

## Deploy na Hostinger (plano Cloud Startup)

### 1. Repositório GitHub

O código já está no repositório `psprime2025-prog/PsPrimeWebSite`. Garante que o branch que
queres publicar está atualizado (`git push`).

### 2. Criar a Node.js Web App no hPanel

1. No hPanel, vai a **Websites → adicionar novo site → Node.js**.
2. Liga a app ao repositório GitHub existente (autoriza o hPanel a aceder à tua conta GitHub) e
   escolhe o branch a publicar (ex: `main`).
3. Ativa o **deploy automático** a cada `git push` nesse branch.
4. Define:
   - **Comando de build:** `npm run build`
   - **Comando de arranque:** `npm run start`
   - **Versão do Node.js:** 20 ou superior
   - **Porta da aplicação:** a que o hPanel indicar (normalmente via variável `PORT`, que o
     `next start` já respeita automaticamente).

### 3. Variáveis de ambiente de produção

No hPanel, na secção **Environment Variables** da Node.js Web App, adiciona todas as chaves de
`.env.example` com os valores reais (Supabase e Stripe em modo Live). Não faças commit destes
valores no repositório.

### 4. Domínio e SSL

1. No hPanel, associa o teu domínio à Node.js Web App (**Domains**).
2. Ativa o **SSL grátis (Let's Encrypt)** na secção SSL do domínio — normalmente um clique,
   com renovação automática.
3. Atualiza `NEXT_PUBLIC_SITE_URL` e `NEXTAUTH_URL` para `https://o-teu-dominio.pt`.

### 5. Base de dados Supabase em produção

1. Cria o projeto Supabase (se ainda não existir) e liga-o à Hostinger via hPanel (integração
   Supabase de um clique) ou configura manualmente `DATABASE_URL`/`DIRECT_URL` nas variáveis de
   ambiente.
2. A partir de uma máquina com acesso à `DATABASE_URL` de produção (pode ser localmente, com o
   `.env` apontado para produção, ou via SSH/terminal do hPanel se disponível), corre:

   ```bash
   npx prisma migrate deploy
   npm run db:seed   # opcional — só se quiseres os produtos de exemplo em produção
   ```

3. Configura o **Supabase Storage** (bucket público para imagens de produtos) e usa os URLs
   públicos gerados no campo "URLs das imagens" do painel `/admin/produtos`.

### 6. Webhook Stripe em produção

Confirma que o endpoint `https://o-teu-dominio.pt/api/webhooks/stripe` está registado no Stripe
Dashboard (modo Live) e que `STRIPE_WEBHOOK_SECRET` corresponde a esse endpoint.

## Checklist antes de considerar o site "live"

- [ ] SSL ativo no domínio (cadeado verde, sem avisos do browser)
- [ ] `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` em modo **Live**
- [ ] Multibanco e MB WAY ativos na conta Stripe (modo Live)
- [ ] Compra de teste real concluída com sucesso (Cartão, Multibanco e MB WAY)
- [ ] Emails de confirmação a chegar (testa com `RESEND_API_KEY` real e domínio verificado no Resend)
- [ ] `npx prisma migrate deploy` corrido contra a base de dados de produção
- [ ] **NIF preenchido** em `lib/constants.ts` (obrigatório por lei — ver aviso em `/legal/termos`)
- [ ] `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` / `NEXTAUTH_SECRET` definidos em produção (não usar os valores de desenvolvimento)
- [ ] Produtos reais adicionados no `/admin/produtos` com imagens no Supabase Storage (substituir os produtos de exemplo do seed)
- [ ] Formulário de checkout e pesquisa testados no site publicado
- [ ] `NEXT_PUBLIC_SITE_URL` e `NEXTAUTH_URL` a apontar para o domínio final (afeta SEO, sitemap e emails)

## Depois do lançamento

Este é o ponto de partida (catálogo, carrinho, checkout Stripe, painel de administração,
páginas legais). Contas de cliente, dashboard avançado e outras funcionalidades ficam para
iterações seguintes — o modelo `Order.userId` já está pronto (opcional) para isso sem necessitar
de grande refactor.
