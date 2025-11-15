<script setup lang="ts">
import { CardBack, CardFront } from '#components';
import type { Value, Suit, Preset } from '~/types/card';

export interface CardProps {
  value: Value;
  suit: Suit;
  flipped?: boolean;
  scale?: number;
  preset?: Preset;
}

const {
  flipped = false,
  scale = 1,
} = defineProps<CardProps>();

const CardFacade = computed(() => (flipped ? CardBack : CardFront));
</script>

<template>
  <div
    class="w-24 h-32 flex flex-col justify-between"
    :style="{ transform: `scale(${scale})` }"
  >
    <CardFacade
      v-bind="$props"
      class="rounded-lg border-[3px]"
      :class="{
        'p-2': !flipped
      }"
    />
  </div>
</template>
