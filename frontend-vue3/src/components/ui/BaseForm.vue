<!--<template>-->
<!--  <form action="#" method="POST" @submit.prevent="doSubmit">-->
<!--    <div class="shadow sm:rounded-md sm:overflow-hidden">-->
<!--      <div class="px-4 py-5 bg-white space-y-6 sm:p-6">-->

<!--        &lt;!&ndash; email &ndash;&gt;-->
<!--        <div>-->
<!--          <label for="email_address" class="block text-sm font-medium text-gray-700">-->
<!--            <slot name="email-label"></slot>-->
<!--          </label>-->
<!--          <slot name="email-input">-->
<!--            <input v-model="email" type="email" name="email_address" id="email_address" autocomplete="email" placeholder="me@example.com" class="mt-1 focus:ring-ming-light focus:border-ming-light block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">-->
<!--          </slot>-->

<!--        </div>-->

<!--        &lt;!&ndash; message - textarea &ndash;&gt;-->
<!--        <div>-->
<!--          <label for="message" class="block text-sm font-medium text-gray-700">-->
<!--            Message-->
<!--          </label>-->
<!--          <div class="mt-1">-->
<!--                  <textarea v-model="message" id="message" name="message" rows="4"-->
<!--                            class="shadow-sm focus:ring-ming-light focus:border-ming-light mt-1 block w-full sm:text-sm border-gray-300 rounded-md"-->
<!--                            placeholder="Hi. I need coaching with..."></textarea>-->
<!--          </div>-->
<!--          <p class="mt-2 text-sm text-gray-500">-->
<!--            Write a message to the coach-->
<!--          </p>-->
<!--        </div>-->

<!--      </div>-->
<!--      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-4">-->
<!--        <button-secondary @click="cancel">-->
<!--          Cancel-->
<!--        </button-secondary>-->
<!--        <button-primary type="submit" @click="submit">-->
<!--          Save-->
<!--        </button-primary>-->

<!--      </div>-->
<!--    </div>-->
<!--  </form>-->

<!--</template>-->

<!--<script lang="ts">-->
<!--import {defineComponent} from "vue";-->
<!--import ButtonPrimary from "./buttons/ButtonPrimary.vue";-->
<!--import ButtonSecondary from "./buttons/ButtonSecondary.vue";-->


<!--export default defineComponent({-->
<!--  name: "BaseForm",-->
<!--  emits: ["submit", "cancel"],-->
<!--  components: {-->
<!--    ButtonPrimary,-->
<!--    ButtonSecondary,-->
<!--  }-->
<!--})-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->