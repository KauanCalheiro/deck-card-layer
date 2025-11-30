<script setup lang="ts">
import { STYLE, SUIT_ICON } from '~/types/card';
import type { CardProps } from '../index.vue';

const {
  value,
  suit,
  preset = 'classic'
} = defineProps<CardProps>();

const style = STYLE[preset];

const icon = computed(() => suit ? SUIT_ICON[suit] : undefined);
</script>

<template>
  <div
    class="flex flex-col h-full justify-between"
    :style="{
      'color': style.front.color?.[suit ?? 'club'],
      'background': style.front.background,
      'border-color': style.border.color,
      'border-width': style.border.size,
    }"
  >

    <CardFrontCorner
      v-if="value"
      :value="value"
      :icon="icon!"
    />

    <div class="flex w-full justify-center items-center text-4xl">
      <UIcon v-if="suit" :name="icon!" />
    </div>

    <CardFrontCorner
      v-if="value"
      :value="value"
      :icon="icon!"
      class="rotate-180"
    />

  </div>
</template>
