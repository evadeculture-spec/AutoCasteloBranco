# Auto Castelo Branco — website

Website institucional e comercial da Auto Castelo Branco: comércio de viaturas usadas e oficina automóvel em Castelo Branco.

> **Estado: versão de demonstração.** As quatro viaturas, os preços, os serviços de oficina e todos os contactos são
> fictícios ou estão por configurar. O site identifica-o visualmente (faixa "Demo", etiquetas "Exemplo") e não é
> indexado por motores de pesquisa enquanto `NEXT_PUBLIC_DEMO_MODE` não for `false`.

---

## 1. Stack

| Camada       | Escolha                                                               |
| ------------ | --------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Cache Components, Partial Prefetching)        |
| Linguagem    | TypeScript (strict)                                                   |
| Estilos      | Tailwind CSS 4 com tokens próprios (`src/app/globals.css`)            |
| Tipografia   | Archivo (títulos, eixo de largura), Instrument Sans (texto), IBM Plex Mono (fichas técnicas) via `next/font` — sem pedidos a servidores externos em runtime |
| Ícones       | Conjunto SVG próprio (`src/components/ui/icons.tsx`)                  |
| Testes       | Vitest (unitários), Playwright + axe-core (percursos e acessibilidade) |

Sem bibliotecas de animação, UI ou formulários: CSS e React chegam para o necessário.

### Identidade e ilustração

- Logótipo oficial em `public/brand/`: `logo-light.png` (fundos escuros), `logo-dark.png` (fundos claros) e
  `mark-light.png` (escudo). Extraídos do ficheiro fornecido com transparência real; o favicon (`src/app/icon.png`,
  `apple-icon.png`) e a imagem de partilha usam o escudo/logótipo. Para substituir por versões vetoriais (SVG) do
  designer, basta trocar os ficheiros mantendo os nomes.
- Ilustração própria em SVG (`src/components/brand/CarRender.tsx`): render de estúdio da viatura, com modo
  "raio-X" para a oficina. O hero da página inicial combina-a com um seletor Comprar / Oficina que leva o visitante
  diretamente à pesquisa de viaturas ou ao pedido de marcação (formulários GET, funcionam sem JavaScript).

## 2. Comandos

```bash
npm install            # instalar dependências
npm run dev            # desenvolvimento em http://localhost:3000
npm run build          # build de produção
npm start              # servir o build de produção
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm test               # testes unitários (Vitest)
npm run test:e2e       # testes de percurso + acessibilidade (requer `npm run build` antes)
npm run check          # lint + typecheck + testes unitários + build
```

Requisitos: Node.js ≥ 20.9 (testado em Node 22).

> Nota: ao editar ficheiros de dados (`src/data/*`) com `npm run dev` ativo, se a alteração não aparecer, reinicie o
> servidor de desenvolvimento. Em produção os dados são sempre lidos do build.

## 3. Configuração (`.env`)

Copie `.env.example` para `.env.local` e preencha. **Nenhum contacto está inventado no código**: valores vazios mostram
um placeholder identificado ("Telefone por configurar") e não geram links.

| Variável                          | Efeito                                                                 |
| --------------------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`            | URL público (SEO, sitemap, Open Graph, URLs canónicos)                 |
| `NEXT_PUBLIC_DEMO_MODE`           | `false` só depois de validar dados reais: remove a faixa e permite indexação |
| `NEXT_PUBLIC_CONTACT_PHONE`       | Telefone (+351…). Ativa botões "Ligar" e links `tel:`                  |
| `NEXT_PUBLIC_CONTACT_EMAIL`       | Email. Ativa links `mailto:`                                           |
| `NEXT_PUBLIC_CONTACT_WHATSAPP`    | Número WhatsApp (só dígitos). O botão só aparece quando definido       |
| `NEXT_PUBLIC_ADDRESS_*`           | Morada. O acesso ao mapa só aparece com a rua preenchida              |
| `NEXT_PUBLIC_OPENING_HOURS`       | Horário, linhas separadas por `\|`                                     |
| `NEXT_PUBLIC_LEGAL_NAME` / `_NIF` | Identificação legal (rodapé e política de privacidade)                 |
| `LEADS_WEBHOOK_URL` / `_SECRET`   | Entrega dos pedidos (ver §6)                                           |

As variáveis `NEXT_PUBLIC_*` são lidas no build: depois de as alterar, volte a fazer `npm run build`.

## 4. Estrutura

```
src/
  app/                      rotas (páginas, API, sitemap, robots, imagem OG, ícone)
    page.tsx                Início
    viaturas/page.tsx       Inventário com filtros
    viaturas/[slug]/        Página individual da viatura
    oficina/                Oficina + pedido de marcação
    sobre-nos/, contactos/, privacidade/
    api/pedidos/route.ts    Receção de pedidos (validação + webhook)
  config/site.ts            Marca, contactos (via .env), navegação
  data/
    types.ts                Modelo de dados de viatura
    vehicles.ts             Inventário (DEMONSTRAÇÃO)
    services.ts             Serviços de oficina (DEMONSTRAÇÃO, por confirmar)
  lib/
    inventory.ts            Acesso ao inventário, filtros, ordenação (funções puras)
    leads.ts                Validação de pedidos (partilhada browser/servidor)
    analytics.ts            Eventos de conversão (só com consentimento)
    contact.ts, format.ts, seo.ts
  components/               brand/, layout/, home/, vehicles/, workshop/, forms/, ui/
  proxy.ts                  404 real para viaturas inexistentes
tests/unit, tests/e2e
public/viaturas/LEIA-ME.md  como adicionar fotografias
```

## 5. Gerir o inventário

Hoje o inventário vive em `src/data/vehicles.ts`. Cada viatura segue o tipo `Vehicle` (`src/data/types.ts`):

- **Adicionar**: acrescentar um objeto com `slug` único (ex.: `renault-clio-2019-gasolina`) e `demo: false`.
- **Remover / vender**: mudar `availability` para `"vendido"` (deixa de aparecer) ou apagar o objeto.
- **Reservar**: `availability: "reservado"` (mostra o estado no cartão e na página).
- **Especificações desconhecidas**: deixar a `null` — aparecem como "Por confirmar", nunca estimadas.
- **Equipamento**: só o confirmado; lista vazia mostra "por confirmar".
- **Fotografias**: ver `public/viaturas/LEIA-ME.md`. Sem fotografia, a ficha mostra o alçado técnico e o plano de
  fotografia em falta, identificado como tal.

**Ligar a uma base de dados / backoffice:** as páginas só usam as funções de `src/lib/inventory.ts`
(`getVehicles`, `getVehicleBySlug`, …). Trocar a sua implementação por consultas (Supabase/Postgres, CMS headless,
API de um DMS) não exige alterar a apresentação. Nesse momento, atualizar também `src/proxy.ts` (lista de slugs) e
considerar `"use cache"` + `cacheTag` para revalidar quando o inventário mudar.

## 6. Pedidos (formulários)

Três formulários, todos com validação no browser e no servidor, mensagens de erro em português, foco no primeiro erro,
campo anti-spam invisível e consentimento RGPD:

| Formulário                  | Onde                   | Dados recolhidos                                                     |
| --------------------------- | ---------------------- | -------------------------------------------------------------------- |
| Pedido de informação        | Página de cada viatura | Nome, telefone e/ou email, mensagem — **viatura identificada automaticamente** |
| Pedido de marcação          | `/oficina#marcacao`    | Nome, telefone e/ou email, marca/modelo, serviço, data preferencial, descrição |
| Contacto geral              | `/contactos`           | Assunto, nome, telefone e/ou email, mensagem                         |

Todos enviam `POST /api/pedidos`.

- **Sem `LEADS_WEBHOOK_URL`** (estado atual): o pedido é validado e o visitante vê a confirmação **com aviso explícito
  de que, em modo demonstração, o pedido não foi enviado**. Nada é guardado.
- **Com `LEADS_WEBHOOK_URL`**: o servidor envia JSON para esse endereço (CRM, Make/Zapier/n8n, função de email).
  Em falha, o visitante é informado e convidado a telefonar.

Exemplo do JSON entregue:

```json
{
  "kind": "marcacao",
  "receivedAt": "2026-10-23T17:30:00.000Z",
  "name": "Rui Costa",
  "phone": null,
  "email": "rui@exemplo.pt",
  "message": "Ruído ao travar",
  "vehicle": null,
  "carMakeModel": "Renault Clio 2017",
  "service": "travagem",
  "preferredDate": "2026-10-28",
  "subject": null,
  "consent": true
}
```

`preferredDate` é uma **preferência**: a interface explica que a marcação só fica confirmada pelo contacto da empresa.

## 7. Medição de conversões

`src/lib/analytics.ts` expõe `track()` e já está ligado aos eventos: `view_vehicle`, `contact_click`, `phone_click`,
`email_click`, `whatsapp_click`, `vehicle_enquiry_submit`, `workshop_booking_submit`, `contact_form_submit`,
`inventory_filter`.

**Nenhuma ferramenta de tracking está instalada.** Os eventos só são enviados para `window.dataLayer` quando existir uma
camada (ex.: Google Tag Manager) **e** `window.cbaConsent.analytics === true`, definido por um banner de consentimento
conforme RGPD / Lei n.º 41/2004. Sem isso, apenas aparecem na consola em desenvolvimento.

## 8. SEO e desempenho

- Título, descrição, URL canónico e Open Graph próprios por página; imagem de partilha gerada (`opengraph-image.tsx`).
- `sitemap.xml` com páginas e viaturas; `robots.txt` bloqueia tudo em modo demonstração.
- Dados estruturados `AutoDealer`/`AutoRepair` gerados **apenas** com morada validada, contacto real e fora do modo
  demonstração. Sem avaliações nem dados de viaturas fictícias.
- Todas as páginas são pré-renderizadas como estáticas; fontes servidas localmente; imagens em AVIF/WebP via `next/image`.
- Português europeu, preços em euros com formatação portuguesa (`29 900 €`).

## 9. Acessibilidade e UX

- Navegação completa por teclado, "Saltar para o conteúdo", foco sempre visível.
- Contraste verificado (WCAG 2.1 AA) com axe-core em todas as páginas, em desktop e telemóvel.
- `prefers-reduced-motion` respeitado: animações desligadas, conteúdo sempre visível.
- Telemóvel: barra fixa com "Ligar" e a ação principal da área (pedir informação / marcação), filtros numa folha
  dedicada, galeria por deslize.

## 10. Publicar online

**Vercel (recomendado — suporte nativo a Next.js 16):**

1. Ligar o repositório em vercel.com → *Add New Project*.
2. Definir as variáveis de ambiente de `.env.example` (Production).
3. Deploy. Ligar o domínio próprio em *Settings → Domains* e atualizar `NEXT_PUBLIC_SITE_URL`.

**Netlify:**

1. Em app.netlify.com → *Add new site → Import an existing project* → GitHub → `evadeculture-spec/AutoCasteloBranco`.
2. Escolher o ramo de produção (`claude/castelo-branco-auto-website`, ou `main` se for criado). O `netlify.toml`
   já define o comando (`npm run build`), a pasta (`.next`) e o Node 22; o adaptador Next.js da Netlify é
   aplicado automaticamente.
3. Em *Site configuration → Environment variables*, definir `NEXT_PUBLIC_SITE_URL` com o endereço Netlify
   (ex.: `https://auto-castelo-branco.netlify.app`) e as restantes variáveis de `.env.example`. Depois, *Deploy*.
4. Os sites Netlify são públicos por defeito. Ligar o domínio próprio em *Domain management* e atualizar
   `NEXT_PUBLIC_SITE_URL`.

**Servidor próprio (Node.js):** `npm ci && npm run build && npm start` (porta 3000; usar um proxy como Nginx com HTTPS).
Cache Components requer o runtime Node.js (não usar exportação estática).

## 11. Antes de passar a produção

- [ ] Substituir as viaturas de demonstração por viaturas reais confirmadas (ou remover `demo: true` apenas de dados reais).
- [ ] Fotografias profissionais de cada viatura (ver `public/viaturas/LEIA-ME.md`).
- [ ] Confirmar a lista de serviços da oficina em `src/data/services.ts` (`confirmed: true`) e retirar o que não se aplica.
- [ ] Preencher contactos, morada, horário, denominação social e NIF.
- [ ] Configurar `LEADS_WEBHOOK_URL` e testar a receção real de um pedido.
- [ ] Rever a política de privacidade (minuta) com o responsável / jurista; definir prazo de conservação.
- [ ] Confirmar as condições de venda (IVA, garantia legal, retoma, financiamento) e só então referi-las.
- [ ] Se for usado analytics: instalar banner de consentimento.
- [ ] `NEXT_PUBLIC_DEMO_MODE=false` e novo build.
