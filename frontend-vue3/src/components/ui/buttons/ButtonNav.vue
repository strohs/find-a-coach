<template>
  <button class="btn btn-nav">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ButtonNav",

  setup() {},

})
</script>

<style scoped>

.btn {
  @apply inline-block px-1 py-1 border border-black rounded-sm focus:outline-none focus:ring focus:ring-offset-1
  uppercase tracking-tight font-semibold text-xs
  sm:tracking-normal sm:text-sm
}

.btn-nav {
  @apply text-gray-800
  hover:bg-gray-300
  focus:ring-gray-500 focus:ring-opacity-50
  active:bg-gray-600;
}


</style>