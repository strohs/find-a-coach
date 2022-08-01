<script lang="ts">
// Login
// this is a Login form component used by coaches to log into the find-a-coach website
//
import {defineComponent, inject} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {Form, Field, ErrorMessage, SubmissionContext} from "vee-validate";
import * as validator from "../validators/formValidators";
import ButtonPrimary from "../components/ui/buttons/ButtonPrimary.vue";
import ButtonSecondary from "../components/ui/buttons/ButtonSecondary.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import {Coach} from "../models/Coach";
import ApiResult from "../models/ApiResult";
import logger from "../utils/logger";
import {LoginResult} from "../models/LoginResult";

// the type of data accepted by this form
type FormDataType = {
  email: string;
  password: string;
};

export default defineComponent({
  name: "Login",
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage,
    ButtonPrimary,
    ButtonSecondary,
    BaseCard,
  },
  props: {
    message: {
      type: String,
      default: null,
    }
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();

    // initial values for the login form
    const formValues: FormDataType = {
      email: "",
      password: "",
    }

    const validationSchema = {
      email(value: string) {
        return validator.required(value, "email");
      },
      password(value: string) {
        return validator.required(value, "password");
      },
    }

    // submit login credentials to api
    async function onSubmit(values: FormDataType, actions: SubmissionContext) {
      logger.debug("login credentials are:", values);

      const res: ApiResult<Coach> = await store.dispatch("auth/loginCoach", {
        email: values.email,
        password: values.password
      });

      if (res.code === 200) {
        // login was successful
        router.push({name: "requests"});
      } else if (res.code >= 400 && res.code < 500) {
        // bad credentials were sent
        actions.setFieldError("password", res.message);
      } else {
        // some other error occurred, todo display message in some global error message component
        actions.setFieldError("password", res.message);
      }

    }

    function doCancel() {
      router.push({name: "hero"});
    }

    return {
      formValues,
      validationSchema,
      onSubmit,
      doCancel,
      props
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- login "header" -->
      <div>
        <img class="mx-auto h-12 w-auto" src="../assets/whistle.svg" alt="whistle"/>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Log in to your coaching page
        </h2>
        <!--        <p class="mt-2 text-center text-sm text-gray-600">-->
        <!--          Or-->
        <!--          {{ ' ' }}-->
        <!--          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">-->
        <!--            start your 14-day free trial-->
        <!--          </a>-->
        <!--        </p>-->
      </div>

      <div class="mt-8 p-6 space-y-6 border border-solid border-gray-200 filter shadow-sm">
        <v-form v-slot="{ handleSubmit, errors, isSubmitting }" :initial-values="formValues"
                :validation-schema="validationSchema" class="pt-4">
          <form @submit="handleSubmit($event, onSubmit)">

            <div v-show="props.message">
              <p class="text-sm text-center font-medium italic md:text-base text-green-400">{{ props.message }}</p>
            </div>

            <div class="rounded-md shadow-sm -space-y-px px-4">
              <div>
                <v-field type="text" id="email" name="email" placeholder="email"
                         class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-ming focus:border-ming focus:z-10 sm:text-sm"
                />
              </div>

              <div>
                <v-field type="password" id="password" name="password" placeholder="password"
                         class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-ming focus:border-ming focus:z-10 sm:text-sm"
                />
              </div>
              <p class="text-sm font-medium italic md:text-base text-red-400"> {{ errors.email || errors.password }}</p>
            </div>

            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-4">
              <button-secondary @click="doCancel">
                Cancel
              </button-secondary>
              <button-primary type="submit" :disabled="isSubmitting">
                LogIn
              </button-primary>

            </div>
          </form>
        </v-form>
      </div>

    </div>
  </div>
</template>


<style scoped>

</style>