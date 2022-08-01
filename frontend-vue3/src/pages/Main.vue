<script lang="ts">
/**
 * The main page "view" for users that are logged in. It will display the main nav header, and also provide a
 * router-view
 */
import MainHeader from "../components/nav/MainHeader.vue";

export default {
  name: "Main",
  components: {
    MainHeader,
  },
  setup() {}
}
</script>

<template>
  <main-header class="mb-3"></main-header>
  <main class="p-5 m-auto max-w-screen-xl">
    <router-view></router-view>
  </main>
</template>

<style scoped>
</style>