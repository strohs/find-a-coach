

<script lang="ts">
/**
 * The main page "view" for listing coach related components
 */
import MainHeader from "../components/nav/MainHeader.vue";

export default {
  name: "Coaches",
  components: {
    MainHeader,
  },
  setup() {}
}
</script>

<template>
  <main-header class="mb-3"></main-header>
  <router-view class="px-5 m-auto max-w-screen-xl"></router-view>
</template>

<style scoped>
</style>