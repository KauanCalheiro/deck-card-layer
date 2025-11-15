<script setup lang="ts">
import type { Card as CardModel, Suit, Value, Preset } from '~/types/card'

const suits: Suit[] = ['heart', 'diamond', 'club', 'spade']
const values: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const presets: Preset[] = ['classic', 'white', 'black', 'golden-dark', 'silver-light']

const suitLabels: Record<Suit, string> = {
  heart: 'Copas',
  diamond: 'Ouros',
  club: 'Paus',
  spade: 'Espadas'
}

const presetLabels: Record<Preset, string> = {
  classic: 'Classic',
  white: 'White',
  black: 'Black',
  'golden-dark': 'Golden Dark',
  'silver-light': 'Silver Light'
}

const presetDescriptions: Record<Preset, string> = {
  classic: 'Visual tradicional com contraste neutro.',
  white: 'Cartas claras destacando o conteúdo.',
  black: 'Tema escuro e elegante para mesas modernas.',
  'golden-dark': 'Luxo dourado para decks premium.',
  'silver-light': 'Brilho suave para interfaces minimalistas.'
}

const randomFrom = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)]!

const cardPlayground = reactive({
  suit: 'heart' as Suit,
  value: 'A' as Value,
  preset: 'golden-dark' as Preset,
  flipped: false,
  scale: 1
})

function randomizeCard() {
  cardPlayground.suit = randomFrom(suits)
  cardPlayground.value = randomFrom(values)
  cardPlayground.preset = randomFrom(presets)
  cardPlayground.flipped = Math.random() > 0.5
  cardPlayground.scale = Number((0.85 + Math.random() * 0.3).toFixed(2))
}

const buildFullDeck = (): CardModel[] =>
  suits.flatMap((suit) => values.map((value) => ({ suit, value })))

const fullDeckSeed = buildFullDeck()
const royaleSeed = fullDeckSeed.filter((card) => ['10', 'J', 'Q', 'K', 'A'].includes(card.value)).slice(0, 25)
const fastMatchSeed = fullDeckSeed.slice(0, 12)

const deckScenarios = [
  {
    key: 'full',
    label: 'Baralho completo',
    description: '52 cartas para simular uma partida convencional.',
    cards: fullDeckSeed
  },
  {
    key: 'royale',
    label: 'Sequências altas',
    description: 'Foca nas cartas nobres para mostrar detalhes das faces.',
    cards: royaleSeed
  },
  {
    key: 'fast',
    label: 'Heads-up curto',
    description: 'Poucas cartas para demonstrar interações rápidas.',
    cards: fastMatchSeed
  }
] as const

type DeckScenarioKey = typeof deckScenarios[number]['key']

const selectedDeckScenario = ref<DeckScenarioKey>('royale')
const cloneCards = (cards: CardModel[]) => cards.map((card) => ({ ...card }))
const initialDeck = deckScenarios.find((scenario) => scenario.key === selectedDeckScenario.value)

const deckCards = ref<CardModel[]>(initialDeck ? cloneCards(initialDeck.cards) : [])
const dealtCards = ref<CardModel[]>([])

const deckSettings = reactive({
  preset: 'golden-dark' as Preset,
  flipped: true,
  maxVisible: 6,
  scale: 1
})

const selectedDeckDetails = computed(() => deckScenarios.find((scenario) => scenario.key === selectedDeckScenario.value))

function selectDeckScenario(key: DeckScenarioKey) {
  const scenario = deckScenarios.find((item) => item.key === key)
  if (!scenario) return
  selectedDeckScenario.value = key
  deckCards.value = cloneCards(scenario.cards)
  dealtCards.value = []
}

function handleDeckDeal(card: CardModel) {
  if (!deckCards.value.length) return
  deckCards.value = deckCards.value.slice(0, -1)
  dealtCards.value = [card, ...dealtCards.value]
}

function dealMultiple(times: number) {
  for (let i = 0; i < times; i += 1) {
    const next = deckCards.value[deckCards.value.length - 1]
    if (!next) return
    handleDeckDeal(next)
  }
}

function resetDeckExample() {
  selectDeckScenario(selectedDeckScenario.value)
}

function shuffleDeck() {
  deckCards.value = deckCards.value
    .map((card) => ({ card, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ card }) => card)
}

const handScenarios = {
  royalFlush: {
    label: 'Royal Flush',
    hint: 'Abre bem o leque e destaca cartas altas.',
    cards: [
      { suit: 'heart', value: '10' },
      { suit: 'heart', value: 'J' },
      { suit: 'heart', value: 'Q' },
      { suit: 'heart', value: 'K' },
      { suit: 'heart', value: 'A' }
    ]
  },
  straightLow: {
    label: 'Sequência baixa',
    hint: 'Ideal para spreads fechados com muitas cartas.',
    cards: [
      { suit: 'club', value: '4' },
      { suit: 'diamond', value: '5' },
      { suit: 'club', value: '6' },
      { suit: 'diamond', value: '7' },
      { suit: 'club', value: '8' },
      { suit: 'diamond', value: '9' },
      { suit: 'club', value: '10' }
    ]
  },
  blackjack: {
    label: 'Blackjack',
    hint: 'Demonstra versões face up/down com poucas cartas.',
    cards: [
      { suit: 'spade', value: 'A' },
      { suit: 'diamond', value: 'K' }
    ]
  },
  showdown: {
    label: 'Showdown 7 cartas',
    hint: 'Mão longa simulando uma mesa final.',
    cards: [
      { suit: 'spade', value: '2' },
      { suit: 'spade', value: '3' },
      { suit: 'spade', value: '4' },
      { suit: 'heart', value: '5' },
      { suit: 'heart', value: '6' },
      { suit: 'club', value: '7' },
      { suit: 'diamond', value: '8' }
    ]
  }
} as const

type HandScenarioKey = keyof typeof handScenarios

const selectedHandScenario = ref<HandScenarioKey>('royalFlush')
const handCards = ref<CardModel[]>(handScenarios[selectedHandScenario.value].cards.map((card) => ({ ...card })))

const handSettings = reactive({
  preset: 'black' as Preset,
  spreadAngle: 70,
  spacing: 10,
  scale: 1,
  flipped: false
})

const selectedHandHint = computed(() => handScenarios[selectedHandScenario.value].hint)

function selectHandScenario(key: HandScenarioKey) {
  selectedHandScenario.value = key
  handCards.value = handScenarios[key].cards.map((card) => ({ ...card }))
}
</script>

<template>
  <div class="min-h-screen w-full bg-[#05050b] text-white flex flex-col gap-12 py-12 px-4">
    <section class="w-full max-w-5xl mx-auto text-center flex flex-col gap-5">
      <p class="uppercase text-xs tracking-[0.5em] text-white/40">
        Component Playground
      </p>
      <h1 class="text-4xl md:text-5xl font-semibold">
        Demonstrações interativas dos componentes de cartas
      </h1>
      <p class="text-white/70 max-w-3xl mx-auto">
        Combine cartas, decks e mãos em cenários diferentes. Use os botões e inputs para validar seu design sem sair da página.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3 text-sm">
        <a href="#card-playground" class="px-5 py-2 rounded-full bg-white text-black font-semibold transition hover:bg-white/80">
          Configurar carta
        </a>
        <a href="#deck-demos" class="px-5 py-2 rounded-full border border-white/30 hover:border-white/60 transition">
          Ver decks
        </a>
        <a href="#hand-demos" class="px-5 py-2 rounded-full border border-white/30 hover:border-white/60 transition">
          Ajustar mãos
        </a>
        <a href="#preset-gallery" class="px-5 py-2 rounded-full border border-white/30 hover:border-white/60 transition">
          Galeria de presets
        </a>
      </div>
    </section>

    <section id="card-playground" class="w-full max-w-6xl mx-auto bg-linear-to-br from-[#151515] to-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl p-8 flex flex-col gap-8">
      <header class="flex flex-col gap-2">
        <p class="text-xs uppercase tracking-[0.4em] text-white/40">
          Carta dinâmica
        </p>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-2xl font-semibold">
            Playground de presets e estados
          </h2>
          <button type="button" class="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition" @click="randomizeCard">
            Surpreenda-me
          </button>
        </div>
        <p class="text-white/60">
          Ajuste valor, naipe, preset, escala e face para validar rapidamente o componente `Card`.
        </p>
      </header>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
        <div class="space-y-6">
          <div class="space-y-2">
            <p class="text-sm text-white/70">Naipe</p>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="suit in suits"
                :key="suit"
                type="button"
                class="flex items-center justify-between px-4 py-3 rounded-2xl border transition"
                :class="cardPlayground.suit === suit ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'"
                @click="cardPlayground.suit = suit"
              >
                <span>{{ suitLabels[suit] }}</span>
                <span class="text-xs uppercase tracking-wide text-white/60">{{ suit }}</span>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-white/70" for="card-value">Valor</label>
            <USelect
              id="card-value"
              v-model:model-value="cardPlayground.value"
              :items="values"
              class="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 focus:outline-none focus:border-white/50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm text-white/70" for="card-preset">Preset</label>
            <USelect
              id="card-preset"
              v-model:model-value="cardPlayground.preset"
              :items="presets"
              class="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 focus:outline-none focus:border-white/50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm text-white/70" for="card-scale">Escala {{ cardPlayground.scale.toFixed(2) }}</label>
            <input
              id="card-scale"
              v-model.number="cardPlayground.scale"
              type="range"
              min="0.8"
              max="1.2"
              step="0.02"
              class="w-full accent-white"
            >
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 px-4 py-3 rounded-2xl border border-white/15 hover:border-white/40 transition"
              @click="cardPlayground.flipped = !cardPlayground.flipped"
            >
              {{ cardPlayground.flipped ? 'Mostrar frente' : 'Mostrar verso' }}
            </button>
            <button
              type="button"
              class="flex-1 px-4 py-3 rounded-2xl border border-white/15 hover:border-white/40 transition"
              @click="randomizeCard"
            >
              Randomizar
            </button>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-linear-to-b from-[#151515] to-[#0a0a0a] flex flex-col items-center gap-4 py-10">
          <Card
            :suit="cardPlayground.suit"
            :value="cardPlayground.value"
            :preset="cardPlayground.preset"
            :flipped="cardPlayground.flipped"
            :scale="cardPlayground.scale"
          />
          <p class="text-sm text-white/60">
            {{ presetLabels[cardPlayground.preset] }} · {{ suitLabels[cardPlayground.suit] }} de {{ cardPlayground.value }}
          </p>
        </div>
      </div>
    </section>

    <section id="deck-demos" class="w-full max-w-6xl mx-auto bg-linear-to-br from-[#151515] to-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl p-8 flex flex-col gap-8">
      <header class="flex flex-col gap-2">
        <p class="text-xs uppercase tracking-[0.4em] text-white/40">Deck interativo</p>
        <h2 class="text-2xl font-semibold">Teste distribuição, face e presets</h2>
        <p class="text-white/60">
          Escolha um cenário de cartas, ajuste o comportamento do `Deck` e distribua manualmente para ver a animação e a pilha resultante.
        </p>
      </header>

      <div class="grid gap-10 xl:grid-cols-[320px_1fr]">
        <div class="space-y-8">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-white/50">Cenários</p>
            <div class="flex flex-col gap-3">
              <button
                v-for="scenario in deckScenarios"
                :key="scenario.key"
                type="button"
                class="text-left p-4 rounded-2xl border transition"
                :class="selectedDeckScenario === scenario.key ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'"
                @click="selectDeckScenario(scenario.key)
                "
              >
                <p class="font-semibold">{{ scenario.label }}</p>
                <p class="text-sm text-white/60">{{ scenario.description }}</p>
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-xs uppercase tracking-[0.3em] text-white/50" for="deck-preset">Preset</label>
              <USelect
                id="deck-preset"
                v-model:model-value="deckSettings.preset"
                :items="presets"
                class="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 focus:outline-none focus:border-white/50"
              />
            </div>

            <div class="flex items-center justify-between text-sm">
              <span>Mostrar frente</span>
              <button
                type="button"
                class="px-3 py-1 rounded-full border border-white/20 text-xs"
                @click="deckSettings.flipped = !deckSettings.flipped"
              >
                {{ deckSettings.flipped ? 'Virado para baixo' : 'Virado para cima' }}
              </button>
            </div>

            <div class="space-y-1">
              <label class="text-sm text-white/70" for="deck-visible">Cartas visíveis {{ deckSettings.maxVisible }}</label>
              <input
                id="deck-visible"
                v-model.number="deckSettings.maxVisible"
                type="range"
                min="2"
                max="10"
                class="w-full accent-white"
              >
            </div>

            <div class="space-y-1">
              <label class="text-sm text-white/70" for="deck-scale">Escala {{ deckSettings.scale.toFixed(2) }}</label>
              <input
                id="deck-scale"
                v-model.number="deckSettings.scale"
                type="range"
                min="0.85"
                max="1.2"
                step="0.01"
                class="w-full accent-white"
              >
            </div>
          </div>

          <div class="flex flex-wrap gap-3 text-sm">
            <button type="button" class="flex-1 px-4 py-3 rounded-2xl border border-white/20 hover:border-white/50 transition" @click="dealMultiple(3)">
              Distribuir 3
            </button>
            <button type="button" class="flex-1 px-4 py-3 rounded-2xl border border-white/20 hover:border-white/50 transition" @click="shuffleDeck">
              Embaralhar
            </button>
            <button type="button" class="w-full px-4 py-3 rounded-2xl border border-white/20 hover:border-white/50 transition" @click="resetDeckExample">
              Reiniciar deck
            </button>
          </div>
        </div>

        <div class="rounded-3xl border border-white/5 bg-linear-to-b from-[#151515] to-[#0a0a0a] p-6">
          <div class="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <Deck
              :cards="deckCards"
              :preset="deckSettings.preset"
              :face-down="deckSettings.flipped"
              :max-visible="deckSettings.maxVisible"
              :scale="deckSettings.scale"
              @deal="handleDeckDeal"
            />

            <div class="flex-1 w-full">
              <p class="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">
                Cartas distribuídas
              </p>
              <div class="min-h-[120px] flex flex-wrap gap-3">
                <template v-if="!dealtCards.length">
                  <p class="text-white/50 text-sm">
                    Ainda não distribuído. Clique no deck ou use o botão "Distribuir 3".
                  </p>
                </template>
                <template v-else>
                  <Card
                    v-for="(card, index) in dealtCards"
                    :key="`dealt-${card.suit}-${card.value}-${index}`"
                    :suit="card.suit"
                    :value="card.value"
                    :preset="deckSettings.preset"
                    :scale="0.8"
                  />
                </template>
              </div>
            </div>
          </div>
          <div class="mt-6 grid grid-cols-2 gap-4 text-sm text-white/70">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-white/40">Deck atual</p>
              <p>{{ deckCards.length }} cartas restantes</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-white/40">Distribuídas</p>
              <p>{{ dealtCards.length }} cartas</p>
            </div>
            <div class="col-span-2 text-white/50 text-xs">
              {{ selectedDeckDetails?.description }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="hand-demos" class="w-full max-w-6xl mx-auto bg-linear-to-br from-[#151515] to-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl p-8 flex flex-col gap-8">
      <header class="flex flex-col gap-2">
        <p class="text-xs uppercase tracking-[0.4em] text-white/40">Mãos e leques</p>
        <h2 class="text-2xl font-semibold">Combine spreads, espaçamentos e presets</h2>
        <p class="text-white/60">
          Use o componente `DeckHand` em diferentes quantidades de cartas e presets. Ajuste o ângulo, espaçamento e exiba o verso para simular situações reais.
        </p>
      </header>

      <div class="grid gap-10 lg:grid-cols-2">
        <div class="space-y-6">
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-[0.3em] text-white/50">Cenários</p>
            <div class="flex flex-col gap-3">
              <button
                v-for="(scenario, key) in handScenarios"
                :key="key"
                type="button"
                class="text-left p-4 rounded-2xl border transition"
                :class="selectedHandScenario === key ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'"
                @click="selectHandScenario(key as HandScenarioKey)"
              >
                <p class="font-semibold">{{ scenario.label }}</p>
                <p class="text-sm text-white/60">{{ scenario.hint }}</p>
              </button>
            </div>
          </div>

          <div class="space-y-5">
            <div class="space-y-1">
              <label class="text-sm text-white/70" for="hand-spread">Ângulo {{ handSettings.spreadAngle }}°</label>
              <input
                id="hand-spread"
                v-model.number="handSettings.spreadAngle"
                type="range"
                min="30"
                max="110"
                class="w-full accent-white"
              >
            </div>

            <div class="space-y-1">
              <label class="text-sm text-white/70" for="hand-spacing">Espaçamento {{ handSettings.spacing }}px</label>
              <input
                id="hand-spacing"
                v-model.number="handSettings.spacing"
                type="range"
                min="6"
                max="18"
                class="w-full accent-white"
              >
            </div>

            <div class="space-y-1">
              <label class="text-sm text-white/70" for="hand-scale">Escala {{ handSettings.scale.toFixed(2) }}</label>
              <input
                id="hand-scale"
                v-model.number="handSettings.scale"
                type="range"
                min="0.8"
                max="1.15"
                step="0.01"
                class="w-full accent-white"
              >
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/70" for="hand-preset">Preset</label>
              <USelect
                id="hand-preset"
                v-model:model-value="handSettings.preset"
                :items="presets"
                class="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 focus:outline-none focus:border-white/50"
              />
            </div>

            <button
              type="button"
              class="w-full px-4 py-3 rounded-2xl border border-white/15 hover:border-white/40 transition"
              @click="handSettings.flipped = !handSettings.flipped"
            >
              {{ handSettings.flipped ? 'Mostrar frente' : 'Virar todas' }}
            </button>
          </div>
        </div>

        <div class="rounded-3xl border border-white/5 bg-linear-to-b from-[#151515] to-[#0a0a0a] px-4 py-10 flex flex-col gap-6 items-center">
          <DeckHand
            :cards="handCards"
            :spread-angle="handSettings.spreadAngle"
            :spacing="handSettings.spacing"
            :preset="handSettings.preset"
            :face-down="handSettings.flipped"
            :scale="handSettings.scale"
          />
          <p class="text-sm text-white/60">
            {{ handScenarios[selectedHandScenario].label }} · {{ selectedHandHint }}
          </p>
          <div class="flex flex-wrap justify-center gap-4 text-xs text-white/50">
            <span>{{ handCards.length }} cartas</span>
            <span>Preset {{ presetLabels[handSettings.preset] }}</span>
            <span>{{ handSettings.flipped ? 'Verso exibido' : 'Frente exibida' }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="preset-gallery" class="w-full max-w-6xl mx-auto bg-linear-to-br from-[#151515] to-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl p-8 flex flex-col gap-6">
      <header class="flex flex-col gap-2">
        <p class="text-xs uppercase tracking-[0.4em] text-white/40">Galeria rápida</p>
        <h2 class="text-2xl font-semibold">Comparativo de presets</h2>
        <p class="text-white/60">Cada bloco mostra frente e verso em dois naipes para validar rapidamente contraste e leitura.</p>
      </header>
      <div class="grid gap-6 md:grid-cols-2">
        <div
          v-for="preset in presets"
          :key="`gallery-${preset}`"
          class="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col gap-4"
        >
          <div>
            <p class="font-semibold">{{ presetLabels[preset] }}</p>
            <p class="text-sm text-white/60">{{ presetDescriptions[preset] }}</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <Card suit="heart" value="A" :preset="preset" />
            <Card suit="heart" value="A" :preset="preset" flipped />
            <Card suit="club" value="K" :preset="preset" />
            <Card suit="club" value="K" :preset="preset" flipped />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
