<script setup lang="ts">
// RegisterCoachForm
// A form for registering new coaches with Find-A-Coach
// Uses vee-validate to handle form input and validation
import {reactive, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import { Form as VForm, Field as VField, ErrorMessage } from "vee-validate";
import OkModal from "../ui/modals/OkModal.vue";
import ButtonPrimary from "../ui/buttons/ButtonPrimary.vue";
import avatarUrl from "../../assets/avatar.png";
import {Coach, buildCoach} from "../../models/Coach";
import ButtonSecondary from "../ui/buttons/ButtonSecondary.vue";
import * as validator from "../../validators/formValidators";
import ApiResult from "../../models/ApiResult";
import CoachesApi from "../../api/CoachesApi";
import logger from "../../utils/logger";

// the type of data returned by this form
type FormDataType = {
  first_name: string;
  last_name: string;
  email: string;
  hourly_rate: string;
  description: string;
  expertise: string;
  password: string;
};

const props = defineProps({
  // if id is passed, then we want to edit an existing coach's info
  id: {
    type: String,
    required: false,
  }
})

const store = useStore();
const router = useRouter();
let coach = reactive(getCoach(props.id));
const isOkModalVisible = ref(false);

// initial form values
const formValues: FormDataType = {
  first_name: '',
  last_name: '',
  email: '',
  hourly_rate: "0.00",
  description: '',
  expertise: '',
  password: '',
};

const validationSchema = {
  first_name(value: string) {
    return validator.requiredWithMaxLength(value, 20);
  },
  last_name(value: string) {
    return validator.requiredWithMaxLength(value, 20);
  },
  async email(value: string) {
    // check if email is well-formed
    let isWellFormed = validator.validEmail(value);
    if (isWellFormed === true) {
      // call API to check if email exists
      const res: ApiResult<boolean> = await CoachesApi.coachEmailExists(value);
      if (res.code === 200) {
        if (res.data) {
          isWellFormed = "email address is taken";
        }
      } else {
        isWellFormed = "all systems are currently busy, please register later";
      }
    }
    return isWellFormed;
  },
  hourly_rate(value: string) {
    return validator.betweenValues(value, 0.0, 999.99);
  },
  description(value: string) {
    return validator.requiredWithMaxLength(value, 250);
  },
  expertise(value: string) {
    return validator.requiredWithMaxLength(value, 250);
  },
  password(value: string) {
    return validator.requiredWithMaxLength(value, 80);
  }
}

// submit a new coach to vuex
async function onSubmit(values: FormDataType) {
  const expertiseArr = parseExpertise(values.expertise.trim());
  // api expects the hourly rate to be stored as the total number of cents, so multiply rate by 100
  const parsedHourlyRate: number = Number.parseFloat(formatHourlyRate(values.hourly_rate.trim())) * 100;

  const newCoach: Coach = buildCoach(
      "0",
      values.first_name.trim(),
      values.last_name.trim(),
      values.email.trim(),
      values.description.trim(),
      values.password.trim(),
      parsedHourlyRate,
      expertiseArr,
      ["user"],
      avatarUrl
  );
  logger.debug('parsed new coach is', newCoach);

  const res: ApiResult<Coach> = await store.dispatch('coach/registerCoach', newCoach);
  if (res.code === 201) {
    isOkModalVisible.value = true;
  } else {
    // todo display error message box on page
  }
}



// parse and format the hourly rate into a two decimal, numeric string
function formatHourlyRate(rate: string): string {
  return Number.parseFloat(rate).toFixed(2);
}

// parse and clean the expertise input and return an Array of strings.
// the expertise param should be a space separated string containing the expertise(s)
function parseExpertise(expertise: string): Array<string> {
  // regex for two or more consecutive whitespace
  const re = /\s\s+/g;
  const cleanStr = expertise.trim().replaceAll(re, " ");
  return cleanStr.split(" ");
}

// get an existing coach by id, or else create an 'empty' coach object
function getCoach(id: string | undefined): Coach {
  if (id) {
    // id was passed, load coach from store
    const existingCoach = store.getters['coach/getCoachById'](props.id);
    // copy the properties into a temporary, new object
    return {...existingCoach};
  } else {
    // build an empty Coach object
    return buildCoach();
  }
}

// navigate to main coach search page
function navToCoaches() {
  isOkModalVisible.value = false;
  router.push({name: 'coaches'});
}

</script>

<template>

  <div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-ming font-semibold tracking-wide uppercase">Coaching</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Share your knowledge, and make some money.
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          When you register as a coach, we'll make your coaching profile available to thousands of people that need help
          and are willing to pay for your time. They'll contact you via e-mail, and you decide if you want to take
          the job.
        </p>
      </div>

      <div class="mt-5 w-3/4 lg:mx-auto">
        <v-form v-slot="{ handleSubmit, values }" :initial-values="formValues" :validation-schema="validationSchema">
          <form @submit="handleSubmit($event, onSubmit)">
            <div class="shadow sm:rounded-md sm:overflow-hidden">
              <div class="px-4 py-5 bg-white space-y-6 sm:p-6">

                <!-- First Name -->
                <div>
                  <label for="first_name" class="block text-sm font-medium text-gray-700">First name</label>
                  <v-field name="first_name" id="first_name" type="text" autocomplete="first-name"
                           :label="'First Name'"
                           class="mt-1 focus:ring-ming-light focus:border-ming-light block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  >
                  </v-field>
                  <error-message name="first_name" as="p" class="text-sm font-medium italic md:text-base text-red-400"></error-message>
                </div>

                <!-- Last Name -->
                <div>
                  <label for="last_name" class="block text-sm font-medium text-gray-700">Last name</label>
                  <v-field name="last_name" id="last_name" type="text" autocomplete="first-name"
                           :label="'Last Name'"
                           class="mt-1 focus:ring-ming-light focus:border-ming-light block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  >
                  </v-field>
                  <error-message name="last_name" as="p" class="text-sm font-medium italic md:text-base text-red-400"></error-message>
                </div>

                <!-- email -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                  <v-field name="email" id="email" type="text" autocomplete="email"
                           class="mt-1 focus:ring-ming-light focus:border-ming-light block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  >
                  </v-field>
                  <error-message name="email" as="p" class="text-sm font-medium italic md:text-base text-red-400"></error-message>
                </div>

                <!-- password -->
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                  <v-field name="password" id="password" type="password" autocomplete="password"
                           class="mt-1 focus:ring-ming-light focus:border-ming-light block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  >
                  </v-field>
                  <error-message name="password" as="p" class="text-sm font-medium italic md:text-base text-red-400"></error-message>
                </div>

                <!-- Hourly Rate -->
                <div class="grid grid-cols-3 gap-x-6 gap-y-1">
                  <div class="col-span-3 sm:col-span-2">
                    <label for="hourly_rate" class="block text-sm font-medium text-gray-700">
                      Hourly Rate
                    </label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                    <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      $
                    </span>
                      <v-field name="hourly_rate" id="hourly_rate" type="text"
                               class="focus:ring-ming-light focus:border-ming-light flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                      >
                      </v-field>
                    </div>
                  </div>
                  <error-message name="hourly_rate" as="p" class="col-span-3 sm:col-span-2 gap-1 text-sm font-medium italic md:text-base text-red-400"></error-message>
                </div>

                <!-- about - textarea -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">
                    About
                  </label>
                  <div class="mt-1">
                    <v-field as="textarea" name="description" id="description" type="text"
                             :label="'About'"
                             class="shadow-sm focus:ring-ming-light focus:border-ming-light mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                             placeholder="I love coaching..."
                    >
                    </v-field>
                    <error-message name="description" as="p" class="text-sm font-medium italic md:text-base text-red-400"></error-message>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    Brief description about yourself.
                  </p>
                </div>

                <!-- Photo upload, not currently used -->
<!--                <div>-->
<!--                  <label class="block text-sm font-medium text-gray-700">-->
<!--                    Photo-->
<!--                  </label>-->
<!--                  <div class="mt-1 flex items-center">-->
<!--                <span class="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">-->
<!--                  <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">-->
<!--                    <path-->
<!--                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>-->
<!--                  </svg>-->
<!--                </span>-->
<!--                    <button type="button"-->
<!--                            class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ming-light">-->
<!--                      Change-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->

                <!-- Expertise - textarea -->
                <div>
                  <label for="expertise" class="block text-sm font-medium text-gray-700">
                    Expertise
                  </label>
                  <div class="mt-1">
                    <v-field as="textarea" name="expertise" id="expertise" type="text" rows="3"
                             class="shadow-sm focus:ring-ming-light focus:border-ming-light mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                             placeholder="javascript css ..."
                    >
                    </v-field>
                    <error-message name="expertise" as="p" class="text-sm font-medium italic md:text-base text-red-400"></error-message>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    Enter your areas of expertise, separated by spaces
                  </p>
                </div>

              </div>

              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-4">
                <button-secondary @click="$router.push({ name: 'hero' })">
                  Cancel
                </button-secondary>
                <button-primary type="submit">
                  Save
                </button-primary>
                <!--              <button type="submit"-->
                <!--                      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ming-light">-->
                <!--                Save-->
                <!--              </button>-->
              </div>
            </div>
          </form>

        </v-form>
      </div>

    </div>
  </div>

  <Teleport to="body">
    <ok-modal
        v-show="isOkModalVisible"
        @continue="navToCoaches"
    >
      <template #header>Thank You for Registering</template>
      <template #body>We've received your application and will contact you via email within 24 hours.</template>
    </ok-modal>
  </Teleport>

</template>



<style scoped>

</style>