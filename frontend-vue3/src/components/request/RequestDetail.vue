<script setup lang="ts">
// RequestDetail
// this component allows viewing the details of a specific coaching request, and also allows a coach to
// respond to a potential coaching client
import {ref} from "vue";
import ButtonPrimary from "../ui/buttons/ButtonPrimary.vue";
import ButtonSecondary from "../ui/buttons/ButtonSecondary.vue";
import OkModal from "../ui/modals/OkModal.vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {longDateFormat} from "../../utils/date-format";
import BaseCard from "../ui/BaseCard.vue";
import {CoachingRequest} from "../../models/CoachingRequest";
import logger from "../../utils/logger";

const props = defineProps({
  // id of the coaching request
  requestId: {
    type: String,
    required: true,
  }
});

const store = useStore();
const router = useRouter();
const coachingRequest: CoachingRequest = store.getters['request/getRequestById'](props.requestId);
const isOkModalVisible = ref(false);

// store the response then send it to the client via email
async function doSubmit() {
  logger.debug("submitting coaches reply: ", coachingRequest.reply);
  const res = await store.dispatch("request/replyToRequest", coachingRequest);
  if (res.code === 200 || res.code === 204) {
    isOkModalVisible.value = true;
  } else {
    // display error box and then navigate somewhere
    logger.error(`an error has occurred, code:${res.code} ${res.message}`);
  }

}

// navigate to requests page
function navToRequests() {
  isOkModalVisible.value = false;
  router.push({name: 'requests'});
}

</script>

<template>
  <div>
    <base-card>
      <template #header>
        <div class="px-4 py-4 text-lg md:text-2xl font-bold text-jet">
          Coaching Request
        </div>
      </template>

      <template #default>
        <dl>

          <div class="bg-white px-4 py-5">
            <dt class="text-sm font-medium text-gray-500">From</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ coachingRequest.fromEmail }}</dd>
          </div>

          <div class="bg-white px-4 py-5">
            <dt class="text-sm font-medium text-gray-500">Time Sent</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ longDateFormat( new Date(coachingRequest.createdAt).getTime()) }}</dd>
          </div>

          <div class="bg-white px-4 py-5">
            <dt class="text-sm font-medium text-gray-500">Message</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ coachingRequest.message }}</dd>
          </div>

        </dl>

        <div class="border-gray-200 border-t border-solid">
          <form action="#" method="POST" @submit.prevent="doSubmit">
            <div class="shadow sm:rounded-md sm:overflow-hidden">
              <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label for="response" class="block text-sm font-medium text-gray-700">
                    Your Response
                    <span v-if="coachingRequest.replyAt"
                          class="text-sm font-medium italic">
                      (on {{ longDateFormat(new Date(coachingRequest.replyAt).getTime()) }})
                    </span>
                  </label>
                  <div class="mt-1">
                  <textarea v-model="coachingRequest.reply" id="response" name="response" :rows="4"
                            class="shadow-sm focus:ring-ming-light focus:border-ming-light mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  ></textarea>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    If you wish to coach this student, go ahead and send them a message
                  </p>
                </div>
              </div>

              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-4">
                <button-secondary @click="navToRequests">
                  Cancel
                </button-secondary>
                <button-primary type="submit">
                  Send
                </button-primary>

              </div>
            </div>
          </form>
        </div>
      </template>

    </base-card>

    <Teleport to="body">
      <ok-modal
          v-show="isOkModalVisible"
          @continue="navToRequests"
      >
        <template #header>Reply Sent</template>
        <template #body>We've sent your reply to {{ coachingRequest.fromEmail }}</template>
      </ok-modal>
    </Teleport>
  </div>

</template>

<style scoped>

</style>