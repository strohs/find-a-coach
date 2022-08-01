<template>
  <main-header class="mb-3"></main-header>
  <div class="flex flex-col justify-start items-center space-y-4 mx-auto max-w-screen-xl">
    <message-box @close="errorMessage=''" class="min-w-full" bg-color="red" :message="errorMessage"></message-box>
    <p class="text-2xl">Your Coaching Requests</p>
    <router-view
      @error-event="showErrorBox"
    >
    </router-view>
  </div>


</template>

<script lang="ts">
/**
 * The main page "view" for displaying coaching request related components
 */
import {defineComponent, ref} from "vue";
import MainHeader from "../components/nav/MainHeader.vue";
import MessageBox from "../components/ui/MessageBox.vue";

export default defineComponent({
  name: "Requests",
  components: {
    MainHeader,
    MessageBox,
  },

  setup() {
    let errorMessage = ref("");

    function showErrorBox(msg: string) {
      console.log("in show error box: ", msg);
      errorMessage.value = msg;
    }

    return {
      errorMessage,
      showErrorBox,
    }
  }
});

</script>

<style scoped>

</style>