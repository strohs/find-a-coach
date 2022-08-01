<template>
  <!-- A card component that can display an optional, card header -->
  <div class="flex flex-col rounded-xl filter drop-shadow-lg">
    <!-- optional card header -->
    <header v-if="$slots.header" class="flex flex-row bg-gray-100">
      <slot name="header"></slot>
    </header>

    <!-- main body of the card -->
    <div class="border-gray-300" :class="{'border-t': $slots.header}">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "BaseCard"
})

</script>

<style scoped>

</style>