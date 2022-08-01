<template>
  <button class="btn btn-delete">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ButtonDelete",
  // emits: ["click"],

  setup() {

  }
})
</script>

<style scoped>
.btn {
  @apply inline-block px-2 py-1 rounded-md focus:outline-none focus:ring focus:ring-offset-2
  tracking-wider font-semibold text-sm
  sm:text-base;
}

.btn-delete {
  @apply bg-red-200 text-white
  hover:bg-red-500
  focus:ring-red-500 focus:ring-opacity-50
  active:bg-red-500;
}
</style>