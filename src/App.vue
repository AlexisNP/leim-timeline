<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { RouterView } from 'vue-router'

useDark()
</script>

<template>
  <div class="h-screen">
    <RouterView />
  </div>
</template>
