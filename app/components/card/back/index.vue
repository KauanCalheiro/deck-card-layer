<script setup lang="ts">
import {
  CardBackPatternDiagonal,
  CardBackPatternGrid,
  CardBackPatternCircles,
  CardBackPatternWaves,
  CardBackPatternSolid
} from '#components';
import { STYLE } from '~/types/card';
import type { CardProps } from '../index.vue';

const {
  preset = 'classic'
} = defineProps<CardProps>();

const style = STYLE[preset];

const CardBackPatternFacade = computed(() => {
  switch (style.back.pattern) {
    case 'diagonal':
      return CardBackPatternDiagonal;
    case 'grid':
      return CardBackPatternGrid;
    case 'circles':
      return CardBackPatternCircles;
    case 'waves':
      return CardBackPatternWaves;
    default:
      return CardBackPatternSolid;
  }
});
</script>

<template>
  <div
    class="w-full h-full"
    :style="{
      'background-color': style.back.background,
      'border-color': style.border.color,
      'border-width': style.border.size,
    }"
  >
    <CardBackPatternFacade
      :color="style.back.background"
      :style="{
        'color': style.border.color,
      }"
    />

    <div class="absolute inset-0 flex items-center justify-center">
      <UIcon
        :name="style.back.icon.name"
        :style="{ color: style.back.icon.color }"
        class="text-5xl"
      />
    </div>
  </div>
</template>
