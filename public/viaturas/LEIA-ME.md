# Fotografias das viaturas

Coloque aqui as fotografias reais, uma pasta por viatura (o nome da pasta = `slug`):

```
public/viaturas/bmw-serie-3-2021-diesel/01-perfil.jpg
public/viaturas/bmw-serie-3-2021-diesel/02-frente-34.jpg
...
```

Depois, em `src/data/vehicles.ts`, substitua `shotList("…")` pela lista de imagens:

```ts
images: [
  { shot: "perfil", src: "/viaturas/bmw-serie-3-2021-diesel/01-perfil.jpg", alt: "BMW Série 3 cinzenta, perfil lateral" },
  { shot: "frente-34", src: "/viaturas/bmw-serie-3-2021-diesel/02-frente-34.jpg", alt: "…" },
],
```

Recomendações de produção fotográfica (para consistência editorial):

- Proporção 3:2 ou 16:10, no mínimo 2400 px de largura, JPEG de alta qualidade.
- Mesmo local e mesma luz para todas as viaturas (fundo neutro, sem reflexos de pessoas).
- Plano de fotografia: perfil · frente 3/4 · traseira 3/4 · habitáculo · painel · detalhe de jante/travões.
- Sem matrículas visíveis (desfocar ou ocultar) e sem marcas de água.

O Next.js gera automaticamente versões AVIF/WebP redimensionadas.
