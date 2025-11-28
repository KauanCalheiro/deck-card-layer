<script setup lang="ts">
import type { Card as CardModel, Preset } from '~/types/card'

export interface DeckProps {
  cards: CardModel[] | undefined
  preset?: Preset
  flipped?: boolean
  maxVisible?: number
  scale?: number
  hoverable?: boolean
}

const {
  cards,
  preset = 'classic',
  flipped = true,
  maxVisible = 5,
  scale = 1,
  hoverable = false
} = defineProps<DeckProps>()

const emit = defineEmits<{ (event: 'deal', card: CardModel): void }>()

const visibleCards = computed(() => {
  if (!cards?.length) return []

  const visible = cards.slice(-maxVisible)

  return visible.map((card, index, arr) => {
    const depth = arr.length - index - 1
    const translateZ = depth * 6
    const translateY = depth * 2.5
    const rotateX = 2 + depth * 0.4
    const rotateY = depth * 0.6

    return {
      card,
      translateY,
      translateX: 10,
      translateZ,
      rotateX,
      rotateY,
      zIndex: 200 + index,
      isTop: index === arr.length - 1
    }
  })
})

const topCard = computed(() => cards?.[cards.length - 1])

const isHovered = ref(false)
const hoverLiftY = -6
const hoverLiftX = 6
const hoverPullZ = 10
const hoverTilt = 1.5

const getCardStyle = (
  translateY: number,
  translateZ: number,
  rotateX: number,
  rotateY: number,
  zIndex: number,
  isTop: boolean
) => {
  const lifted = isTop && isHovered.value
  const liftedTranslateY = translateY + (lifted ? hoverLiftY : 0)
  const liftedTranslateX = 0 + (lifted ? hoverLiftX : 0)
  const liftedTranslateZ = Math.max(0, translateZ - (lifted ? hoverPullZ : 0))
  const liftedRotateX = rotateX - (lifted ? hoverTilt : 0)
  const liftedRotateY = rotateY + (lifted ? hoverTilt : 0)

  return {
    transform: `translate(-50%, -50%) translate3d(${liftedTranslateX}px, ${liftedTranslateY}px, -${liftedTranslateZ}px) rotateX(${liftedRotateX}deg) rotateY(${liftedRotateY}deg) scale(${scale})`,
    zIndex
  }
}

const handleDeal = () => {
  if (!topCard.value) return
  emit('deal', topCard.value)
}
</script>

<template>
  <div
    class="deck-stack"
    :class="{ 'deck-stack--empty': !cards?.length }"
    role="button"
    tabindex="0"
    @click="handleDeal"
    @keyup.enter.prevent="handleDeal"
    @keyup.space.prevent="handleDeal"
    @mouseenter="hoverable ? (isHovered = true) : null"
    @mouseleave="hoverable ? (isHovered = false) : null"
  >
    <div class="deck-card-area">
      <TransitionGroup name="deck-card">
        <div
          v-if="cards"
          v-for="({ card, translateY, translateZ, rotateX, rotateY, zIndex, isTop }) in visibleCards"
          :key="`${card.suit}-${card.value}-${zIndex}`"
          class="deck-card"
          :class="{
            'deck-card--top': isTop,
            'deck-card--hovered': isTop && isHovered
          }"
          :style="getCardStyle(translateY, translateZ, rotateX, rotateY, zIndex, isTop)"
        >
          <Card
            :suit="card.suit"
            :value="card.value"
            :preset="preset"
            :flipped="flipped"
          />
        </div>
        <div
          v-else
          class="deck-card"
          :style="getCardStyle(0, 0, 0, 0, 100, false)"
        >
          <Card
            :preset="preset"
            :flipped="flipped"
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.deck-stack {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1rem;
  transition: transform 150ms ease;
  width: fit-content;
}

.deck-stack:focus-visible {
  outline: 2px solid #f5f5f5;
  outline-offset: 6px;
}

.deck-stack--empty {
  cursor: not-allowed;
  opacity: 0.6;
}

.deck-shadow {
  position: absolute;
  inset: auto 1.2rem 0.5rem;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.4), transparent 70%);
  pointer-events: none;
}

.deck-card-area {
  position: relative;
  width: 96px;
  height: 140px;
  perspective: inherit;
}

.deck-card-enter-active,
.deck-card-leave-active,
.deck-card-move {
  transition: transform 250ms ease, opacity 250ms ease;
}

.deck-card-enter-from,
.deck-card-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) translate3d(0, 0, 30px) rotateX(-10deg);
}

.deck-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  transition: transform 180ms ease, filter 180ms ease;
}

.deck-counter {
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}
</style>
