<script setup lang="ts">
// ContactCoachForm
// A form that end users can use to send a coach their contact information.
// Uses vee-validate as the form component

import { ref } from "vue";
import { useStore } from "vuex";
import { Form as VForm, Field as VField, ErrorMessage } from "vee-validate";
import { Coach, buildCoach } from "../../models/Coach";
import ButtonPrimary from "../ui/buttons/ButtonPrimary.vue";
import ButtonSecondary from "../ui/buttons/ButtonSecondary.vue";
import OkModal from "../ui/modals/OkModal.vue";
import {useRouter} from "vue-router";
import { builder } from "../../models/CoachingRequest";
import * as validator from "../../validators/formValidators";
import logger from "../../utils/logger";

// the type of data returned by this form
type FormDataType = {
  message: string;
  from_email: string;
};

const props = defineProps({
  coachId: {
    type: String,
    required: true,
  }
})

const store = useStore();
const router = useRouter();
// initial form values
let formValues: FormDataType = {
  from_email: "",
  message: "",
};
const isOkModalVisible = ref(false);

const coach: Coach = store.getters['coach/getCoachById'](props.coachId);
logger.debug('ContactCoachForm: retrieved coach', coach.id);

// validation schema for this form
const validationSchema = {
  from_email(value: string) {
    return validator.validEmail(value);
  },
  message(value: string) {
    return validator.requiredWithMaxLength(value, 250);
  },
}

// const onSubmit = (a: FormDataType) => {
//   debugger;
//   alert("Form has been submitted!");
//   console.log(a);
// };

async function onSubmit(values: FormDataType) {
  // build a new coaching request and call the API to store it
  const newRequest = builder("-1", buildCoach(props.coachId), values.message, values.from_email);
  const res = await store.dispatch("request/createRequest", newRequest);

  if (res.code === 201) {
    formValues.from_email = values.from_email;
    isOkModalVisible.value = true;
  } else {
    // todo display error message box on this page
  }
}

function doCancel() {
  // navigate back to coachList component
  router.push({ name: 'coaches' });
}

// navigate to main coach search page
function modalNavToCoaches() {
  isOkModalVisible.value = false;
  router.push({name: 'coaches'});
}


</script>

<template>
  <div>
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Contact Coach <b class="text-ming">{{ coach.firstName }} {{ coach.lastName }}</b></h3>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <v-form v-slot="{ handleSubmit }" :initial-values="formValues" :validation-schema="validationSchema">
          <form @submit="handleSubmit($event, onSubmit)">
            <div class="shadow sm:rounded-md sm:overflow-hidden">
              <div class="px-4 py-5 bg-white space-y-6 sm:p-6">

                <!-- email -->
                <div>
                  <label for="from_email" class="block text-sm font-medium text-gray-700">Email address</label>
                  <v-field type="email" name="from_email" id="from_email" autocomplete="email" placeholder="me@example.com" class="mt-1 focus:ring-ming-light focus:border-ming-light block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></v-field>
                  <error-message name="from_email" as="p" class="text-sm font-medium italic md:text-base text-red-400"></error-message>
                </div>

                <!-- message - textarea -->
                <div>
                  <label for="message" class="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div class="mt-1">
                    <v-field as="textarea" id="message" name="message" rows="4"
                             class="shadow-sm focus:ring-ming-light focus:border-ming-light mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                             placeholder="Hi. I need coaching with..."></v-field>
                    <error-message name="message" as="p" class="text-sm font-medium italic md:text-base text-red-400"></error-message>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    Write a message to the coach
                  </p>
                </div>

              </div>
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-4">
                <button-secondary @click="doCancel">
                  Cancel
                </button-secondary>
                <button-primary type="submit">
                  Save
                </button-primary>

              </div>
            </div>
          </form>

        </v-form>
      </div>
    </div>
    <Teleport to="body">
      <ok-modal
          v-show="isOkModalVisible"
          @continue="modalNavToCoaches"
      >
        <template #header>We received your coaching request</template>
        <template #body>Coach {{ coach.firstName }} {{ coach.lastName }} will contact you at {{ formValues.from_email }} within 24 hours.</template>
      </ok-modal>
    </Teleport>
  </div>

</template>



<style scoped>

</style>