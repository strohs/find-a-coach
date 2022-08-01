/// MessageBox
// a message box for displaying a text based message to users.
// It contains a close button and allows configuring the background color of the box
//
// Props:
//  bgColor: the background color of the message box, must be one of "red" (default), "green", or "yellow"
// Emits:
// 'close': when the close button is clicked

<template>
  <div v-show="showMessageBox" class="flex flex-col justify-center rounded-md border-2" :class="[backgroundColor, borderColor]">
    <button-close
        class="m-2 self-end"
        :class="closeBtnClasses"
        @click="$emit('close')"
    >
    </button-close>

    <p class="m-2 text-sm self-center" :class="textColor">{{ props.message }}</p>
  </div>

</template>

<script lang="ts">

import {computed, defineComponent} from "vue";
import ButtonClose from "./buttons/ButtonClose.vue";

export default defineComponent({
  name: "MessageBox",
  components: { ButtonClose },
  props: {
    // the background color of the box
    bgColor: {
      type: String,
      required: false,
      default: "red",
    },
    message: {
      type: String,
      required: false,
      default: "",
    }
  },
  emits: ['close'],

  setup(props) {
    let showMessageBox = computed(() => props.message.length > 0);
    const backgroundColor = `bg-${props.bgColor}-100`;
    const borderColor = `border-${props.bgColor}-900`;
    const textColor = `text-${props.bgColor}-900`;
    const closeBtnClasses = [`border-${props.bgColor}-700`, `text-${props.bgColor}-700`, `hover:bg-${props.bgColor}-500`];

    return {
      props,
      showMessageBox,
      backgroundColor,
      borderColor,
      textColor,
      closeBtnClasses,
    }
  }

})
</script>

<style scoped>

</style>