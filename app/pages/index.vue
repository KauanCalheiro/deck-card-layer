<script setup lang="ts">
import { WHITE_PRESET } from '~/types/card';

</script>

<template>
  <div class="h-screen w-full flex flex-col justify-center items-center gap-2">

    <div class="flex gap-4">
      <Card suit="heart" value="A" />
      <Card suit="heart" value="A" flipped />
      <Card suit="club" value="A" />
      <Card suit="club" value="A" flipped />
    </div>

    <div class="flex gap-4">
      <Card suit="heart" value="A" preset="white"/>
      <Card suit="heart" value="A" flipped preset="white"/>
      <Card suit="club" value="A" preset="white"/>
      <Card suit="club" value="A" flipped preset="white"/>
    </div>

    <div class="flex gap-4">
      <Card suit="heart" value="A" preset="black"/>
      <Card suit="heart" value="A" flipped preset="black"/>
       <Card suit="club" value="A" preset="black"/>
      <Card suit="club" value="A" flipped preset="black"/>
    </div>


  </div>
</template>
