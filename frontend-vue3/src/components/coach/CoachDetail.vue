/// CoachDetail
// a component that displays a Coaches "coaching" details within a card component
// The coach data will be retrieved from vuex coaches store using the coaches ID as the lookup parameter
<template>

  <div>
    <base-card>
      <template #header>
        <div class="p-3">
          <img class="h-10 w-10 md:h-20 md:w-20 rounded-full" :src="coach.imageUrl" alt="coach picture">
        </div>
        <div class="px-4 text-lg md:text-2xl text-jet self-center">
          {{ coach.firstName }} {{ coach.lastName }}
        </div>
      </template>

      <template #default>
        <dl>

          <div class="bg-white px-4 py-5">
            <dt class="text-sm font-medium text-gray-500">E-mail</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ coach.email }}</dd>
          </div>

          <div class="bg-gray-50 px-4 py-5">
            <dt class="text-sm font-medium text-gray-500">Hourly Rate</dt>
            <dd class="mt-1 text-sm text-gray-900">${{ formatHourlyRate(coach.hourlyRate) }}</dd>
          </div>

          <div class="bg-white px-4 py-5">
            <dt class="text-sm font-medium text-gray-500">Description</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ coach.description }}</dd>
          </div>

          <div class="bg-gray-50 px-4 py-5">
            <dt class="text-sm font-medium text-gray-500">Expertise</dt>
            <dd class="mt-1 text-sm text-gray-900 flex flex-wrap">
            <span v-for="expertise in coach.expertise"
                  :key="expertise"
                  class="px-2 md:px-4 text-xs md:text-small leading-5 font-semibold rounded-full bg-green-100 text-green-900"
            >
                  {{ expertise }}
            </span>
            </dd>
          </div>

        </dl>
      </template>
    </base-card>

    <button-secondary @click="$router.push({ name: 'coaches' })">
      Back
    </button-secondary>
  </div>


</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, isRef } from "vue";
import { useRouter } from 'vue-router'
import {Coach} from "../../models/Coach";
import ButtonSecondary from "../ui/buttons/ButtonSecondary.vue";
import BaseCard from "../ui/BaseCard.vue";
import logger from "../../utils/logger";

export default defineComponent({
  name: "CoachDetail",
  components: {
    ButtonSecondary,
    BaseCard,
  },
  props:  {
    coachId: {
      type: String,
      required: true,
    }
  },
  setup(props, context) {
    const store = useStore();
    const router = useRouter();

    const coach: Coach = store.getters["coach/getCoachById"](props.coachId);
    logger.debug('got coach', coach);

    // formats the hourlyRate (which is stored in cents, in the db) by dividing it by 100
    const formatHourlyRate = function(hourlyRate: number): string {
      const temp = hourlyRate / 100;
      return temp.toFixed(2);
    }

    return {
      coach,
      formatHourlyRate,
    }
  }
})
</script>

<style scoped>

</style>