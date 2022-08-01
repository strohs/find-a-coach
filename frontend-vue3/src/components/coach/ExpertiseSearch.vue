<template>
  <div class="flex flex-col items-center">
    <div class="flex space-x-2 items-center my-1">
      <input v-model.trim="searchText"
             @keyup.enter="searchExpertise"
             type="text" name="search" id="search" placeholder="I need expertise in..."
             class="hover:bg-gray-50 focus:ring-ming-light focus:border-blue-50 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      >
      <button-primary @click="doClear">clear</button-primary>
    </div>
    <p class="sm:text-sm"> {{ formatSearchCriteria }}</p>
  </div>
</template>

<script lang="ts">
/**
 * a search input that will search coaches for the specified expertise and return them as an emitted event
 */


import {computed, defineComponent, ref} from "vue";
import {useStore} from "vuex";
import {Coach} from "../../models/Coach";
import ButtonPrimary from "../ui/buttons/ButtonPrimary.vue";
import logger from "../../utils/logger";

export default defineComponent({
  name: "ExpertiseSearch",
  emits: {
    searchResult: (payload: Array<Coach>) => {
      return true;
    },
    clear: null,
  },
  components: {
      ButtonPrimary,
  },

  setup(props, context) {
    const store = useStore();
    const searchText = ref('');
    const foundCoachesCount = ref(0);
    const currSearchCriteria = ref<Array<string>>([]);

    async function searchExpertise() {
      if (searchText.value) {
        logger.debug('searching for expertise in:', searchText.value);
        const res = await store.dispatch('coach/searchExpertiseByOr', { searchTerm: searchText.value, page: 1, limit: 100 });
        let foundCoaches: Array<Coach> = [];
        if (res.code === 200) {
          foundCoaches = res.data.data;
          foundCoachesCount.value = foundCoaches.length;
        } else {
          // invalid request or some backend error
        }
        // send back the found coaches
        context.emit('searchResult', foundCoaches);
        currSearchCriteria.value = searchText.value.split(' ');
      } else {
        currSearchCriteria.value = [];
      }
    }

    const formatSearchCriteria = computed(() => {
      if (currSearchCriteria.value.length > 0) {
        if (foundCoachesCount.value === 0) {
          return `0 coaches found with expertise in ${currSearchCriteria.value.join(' ')}`;
        } else {
          return `Found ${foundCoachesCount.value} coaches with expertise in ${currSearchCriteria.value.join(' ')}`;
        }
      } else {
        return '';
      }

    });

    function doClear() {
      searchText.value = '';
      currSearchCriteria.value = [];
      context.emit('clear');
    }

    return {
      searchText,
      searchExpertise,
      currSearchCriteria,
      formatSearchCriteria,
      doClear,
    }
  }
})
</script>

<style scoped>

</style>