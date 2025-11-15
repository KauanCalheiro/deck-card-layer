<script setup lang="ts">
import type { Card as CardModel, Preset } from '~/types/card'

export interface DeckHandProps {
  cards: CardModel[]
  spreadAngle?: number
  spacing?: number
  preset?: Preset
  flipped?: boolean
  hoverable?: boolean
  scale?: number
}

const {
  cards,
  spreadAngle = 60,
  spacing = 8,
  preset,
  flipped = false,
  hoverable = false,
  scale = 1
} = defineProps<DeckHandProps>()

const hoveredIndex = ref<number | null>(null)
const hoverLift = 20

const positions = computed(() => {
  if (!cards?.length) return []

  const total = cards.length
  const half = (total - 1) / 2

  const maxAngle = spreadAngle
  const curveFactor = Math.min(1, Math.max(0.2, total / 8))
  const radius = spacing * total * (0.8 + curveFactor)
  const angleStep = total > 1 ? maxAngle / (total - 1) : 0

  return cards.map((card, index) => {
    const offset = index - half
    const linearAngle = -maxAngle / 2 + angleStep * index
    const angle = linearAngle * curveFactor
    const rad = (angle * Math.PI) / 180

    const linearX = offset * spacing * 1.6
    const arcX = Math.sin(rad) * radius * total / half
    const translateX = linearX * (1 - curveFactor) + arcX * curveFactor

    const arcY = (Math.cos(rad) * radius - radius) * -0.7 * (total / half)
    const translateY = arcY * curveFactor

    return {
      card,
      angle,
      translateX,
      translateY,
      zIndex: index + 1
    }
  })
})

const getCardStyle = (index: number, translateX: number, translateY: number, angle: number, zIndex: number) => {
  const isHovered = hoveredIndex.value === index
  const hoverY = isHovered ? translateY - hoverLift : translateY

  return {
    transform: `translateX(-50%) translate(${translateX}px, ${hoverY}px) rotate(${angle}deg)`,
    zIndex: zIndex
  }
}
</script>

<template>
  <div class="relative flex items-end justify-center w-full">
    <div class="relative h-32 mt-2 mb-6 w-full max-w-2xl">
      <TransitionGroup
        name="hand-card"
        tag="div"
      >
        <div
          v-for="({ card, angle, translateX, translateY, zIndex }, index) in positions"
          :key="`${card.suit}-${card.value}-${index}`"
          class="card-container absolute bottom-0 left-1/2 origin-bottom cursor-pointer transition-transform duration-200"
          :style="getCardStyle(index, translateX, translateY, angle, zIndex)"
          @mouseenter="hoverable ? (hoveredIndex = index) : null"
          @mouseleave="hoverable ? (hoveredIndex = null) : null"
        >
          <Card
            :suit="card.suit"
            :value="card.value"
            :preset="preset"
            :flipped="flipped"
            :scale="scale"
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.hand-card-enter-active,
.hand-card-leave-active,
.hand-card-move {
  transition: transform 300ms ease, opacity 300ms ease;
}

.hand-card-enter-from,
.hand-card-leave-to {
  opacity: 0;
  transform: translateX(-50%) translate(0, 20px) rotate(0deg);
}
</style>
