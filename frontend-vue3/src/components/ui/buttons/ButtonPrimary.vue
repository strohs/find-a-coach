<template>
  <button class="btn btn-primary">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ButtonPrimary",
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

.btn-primary {
  @apply bg-indigo_dye-light text-white
  hover:bg-indigo_dye-dark
  focus:ring-indigo_dye focus:ring-opacity-50
  active:bg-indigo_dye-dark;
}
</style>