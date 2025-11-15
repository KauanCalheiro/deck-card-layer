<script setup lang="ts">
interface CardCornerProps {
  value: string;
  icon: string;
}

const {
  value,
  icon
} = defineProps<CardCornerProps>();
</script>

<template>
  <div class="flex w-full justify-start items-center">
    <span>{{ value }}</span>
    <UIcon :name="icon" />
  </div>
</template>
