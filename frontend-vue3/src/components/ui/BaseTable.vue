<template>
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-200">
      <slot name="header-rows"></slot>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <slot name="body-rows"></slot>
    </tbody>
  </table>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default  defineComponent({
  name: "BaseTable"
})
</script>

<style scoped>

</style>