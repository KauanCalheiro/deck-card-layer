# deck-card-layer

A deck-card-layer é uma layer Nuxt focada em disponibilizar o baralho interativo deste projeto para qualquer outra aplicação Nuxt 3 usando o recurso oficial de [Layers (`extends`)](https://nuxt.com/docs/getting-started/layers). O tutorial abaixo mostra, passo a passo, como clonar, testar, versionar e importar essa layer nas três formas mais comuns: monorepo/local, pacote npm e repositório Git.

## Visão geral rápida

- **Componentes**: `app/components/card` (faces e padrões) + `app/components/deck` (mão de cartas e interação).
- **Base de estilos**: `app/assets/css/main.css` e presets definidos em `app/app.config.ts`.
- **Utilidades**: Tipos em `app/types/card.ts` e `app/composables/useDeck.ts` para embaralhar/controlar estado.
- **Playground**: `/app/pages/index.vue` demonstra tudo pronto para inspeção ao rodar `pnpm dev`.

```
app/
 ├─ components/
 │   ├─ card/
 │   └─ deck/
 ├─ composables/
 ├─ pages/
 ├─ assets/css
 └─ app.config.ts
```

## Pré-requisitos

- Node.js 18+ e pnpm 8+ (adapte para npm/yarn se preferir).
- Conhecimento básico de Nuxt 3 e do conceito de layers (referência oficial acima).

## 1. Validar a layer localmente

1. Instale dependências e suba o playground:

   ```bash
   pnpm install
   pnpm dev
   ```

2. Acesse `http://localhost:3000` e confirme se os componentes estão funcionando antes de compartilhar.

## 2. Entendendo `extends`

O projeto consumidor só precisa adicionar a layer ao array `extends` do `nuxt.config.ts`. O Nuxt irá mesclar `components/`, `app.config.ts`, assets, composables e plugins automaticamente.

```ts
// nuxt.config.ts do app que vai consumir
export default defineNuxtConfig({
   extends: ['@meu-scope/deck-card-layer'], // ajuste para o caminho escolhido
})
```

> Dica: se precisar sobrescrever um componente ou asset específico, basta criar um arquivo com o mesmo caminho no projeto consumidor; o Nuxt prioriza o diretório local.

## 3. Três formas de distribuir a layer

### 3.1 Monorepo ou link local

1. Garanta que os projetos compartilhem o mesmo workspace (`pnpm-workspace.yaml`).
2. Adicione a layer como dependência de desenvolvimento apontando para o caminho relativo:

   ```bash
   pnpm add -D ../layer/nuxt-app
   ```

3. Use o nome do pacote no `extends` (veja `name` em `package.json`).
4. Rode `pnpm dev` no app consumidor e verifique se os componentes aparecem.

### 3.2 Consumir direto via Git

1. Publica o repositório no GitHub (ou GitLab/Bitbucket).
2. No projeto consumidor:

   ```bash
   pnpm add -D github:meu-usuario/deck-card-layer#main
   ```

3. Configure `extends: ['deck-card-layer']` (ou o nome definido em `package.json`).
4. Para travar versões, use tags (`#v1.2.0`) e gere changelog.

### 3.3 Publicar no npm (público ou privado)

1. Gere o build empacotado:

   ```bash
   pnpm build
   pnpm pack
   ```

2. Publique com `pnpm publish --access public` (ou `--access restricted` para escopos privados).
3. No app consumidor:

   ```bash
   pnpm add -D @meu-scope/deck-card-layer
   ```

4. Aponte o `extends` para `@meu-scope/deck-card-layer` e execute `pnpm dev`/`pnpm build` para validar.

## 4. Checklist de integração

- Rode `pnpm nuxi typecheck` no app consumidor para garantir que as tipagens expostas pela layer foram mescladas.
- Confirme se os estilos globais da layer estão habilitados; caso use outro reset, importe `~/assets/css/main.css` após o seu arquivo base.
- Precisa de variáveis? Exponha-as via `app.config.ts` na layer e acesse com `const config = useAppConfig()` no projeto consumidor.

## 5. Personalizações comuns

- **Substituir artes**: Crie `app/components/card/back/pattern/*.vue` com o mesmo nome e Nuxt usará a versão do consumidor.
- **Theme tokens**: Adicione overrides em `app.config.ts` do consumidor aproveitando o `defineAppConfig` exportado.
- **Deck state**: `useDeck` é tree-shakeable; importe apenas onde precisar (`const { hand, draw } = useDeck()`).

## 6. Publicação contínua

1. Configure GitHub Actions (ou outra CI) para rodar `pnpm lint && pnpm test && pnpm build` antes de publicar.
2. Crie versões semânticas (`pnpm changeset` ou `npm version patch/minor/major`).
3. Gere release notes com exemplos visuais para facilitar a adoção.

## 7. Troubleshooting

- **Layer não é reconhecida**: confirme se `package.json` exporta `main`/`exports` apontando para a raiz do app (Nuxt procura `nuxt.config`).
- **Estilos ausentes**: verifique se o consumidor não está sobrescrevendo `app/assets/css/main.css` sem importar o conteúdo da layer.
- **Import path errors**: rode `pnpm nuxi analyze` para ver o grafo de dependências e garantir que não há caminhos absolutos quebrados.

## Referências úteis

- [Nuxt Docs – Layers](https://nuxt.com/docs/getting-started/layers)
- [Nuxt Config – `extends`](https://nuxt.com/docs/api/configuration/nuxt-config#extends)
- [Guia de publicação npm](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages)
