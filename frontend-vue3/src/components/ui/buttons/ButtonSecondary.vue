<script setup lang="ts">
/**
 * A Secondary Button, with slightly dimmed colors when compared to a Primary Button
 */

defineEmits(['click'])

</script>

<template>
  <button class="btn btn-secondary" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  @apply inline-block px-2 py-1 rounded-lg focus:outline-none focus:ring focus:ring-offset-2
  tracking-wider font-semibold text-sm
  sm:mt-6 sm:text-base;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800
  hover:bg-gray-300
  focus:ring-gray-400 focus:ring-opacity-50
  active:bg-gray-400;
}
</style>