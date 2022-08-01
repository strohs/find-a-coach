/// CoachList
/// a Vue component that displays a list of coaches within a table

<template>

  <div class="flex flex-col max-w-screen-xl xl:mx-auto mt-6">

    <expertise-search
        class="mb-3 self-center md:w-1/2"
        @search-result="updateCoachList"
        @clear="resetPage"
    >
    </expertise-search>

    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <base-table>
            <template #header-rows>
              <tr>
                <th scope="col" class="px-3 py-2 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-3 py-2 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expertise
                </th>
                <th scope="col" class="hidden md:block relative px-6 py-3">
                  <span class="sr-only">Details</span>
                </th>
              </tr>
            </template>

            <template #body-rows>
              <tr v-for="(coach, index) in coaches"
                  :key="coach.id" :class="{ 'bg-gray-100': index % 2 !== 0}"
              >
                <td class="px-3 py-2 md:px-6 md:py-4">
                  <div class="flex items-center">
                    <div class="hidden md:block flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" :src="coach.imageUrl" alt="coach picture">
                    </div>
                    <div class=" md:ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ coach.firstName }} {{ coach.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ coach.email }}
                      </div>
                      <div class="md:hidden py-2 text-sm font-medium">
                        <router-link
                            class="text-ming-light hover:text-ming underline"
                            :to="{ name: 'contact', params: { coachId: coach.id }}"
                        >
                          Contact
                        </router-link>
                      </div>
                      <div class="md:block flex-shrink-0">
                        <img @click="routeToCoachDetail(coach.id)" class="h-6 w-6 rounded-full cursor-pointer hover:bg-blue-100" src="../../assets/information.svg" alt="information">
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 md:px-6 md:py-4 whitespace-normal align-top">
                <span v-for="item in coach.expertise" :key="item">
                  <b class="md:px-2 text-xs font-semibold md:rounded-full md:bg-blue-100 text-blue-800">{{ item }}</b>
                  &nbsp;
                </span>
                </td>
                <td class="hidden md:block px-3 py-2 md:px-6 md:py-4 text-right text-sm font-medium">
                  <router-link
                      class="text-ming-light hover:text-ming underline"
                      :to="{ name: 'contact', params: { coachId: coach.id }}"
                  >
                    Contact
                  </router-link>
                </td>
              </tr>
            </template>
          </base-table>

          <!-- PageNav -->
          <page-nav
              @prev="getPreviousPage"
              @next="getNextPage"
              :page-num="pageNum"
              :page-limit="itemsPerPage"
              :total-items="totalCoaches"
          >
          </page-nav>

        </div>
      </div>
    </div>
  </div>


</template>

<script lang="ts">
import { useStore } from 'vuex';
import {defineComponent, ref, computed} from "vue";
import {useRouter} from 'vue-router';
import ButtonPrimary from "../ui/buttons/ButtonPrimary.vue";
import {Coach} from "../../models/Coach";
import ExpertiseSearch from "./ExpertiseSearch.vue";
import BaseTable from "../ui/BaseTable.vue";
import PageNav from "../nav/PageNav.vue";
import logger from "../../utils/logger";
import ApiResult from "../../models/ApiResult";
import {PagedResult} from "../../models/PagedResult";


export default defineComponent({
  name: "CoachList",
  components: {
    ButtonPrimary,
    ExpertiseSearch,
    BaseTable,
    PageNav,
  },
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    // stores a "page" of coaches to display within this component
    let coaches = ref<Array<Coach>>([]);
    let pageNum = ref(0);
    let totalCoaches = computed(() => store.getters["coach/getTotalCoaches"]);
    // maximum number of coaches to fetch initially
    const maxCoaches = 50;
    // total number of coaches to display per page
    const itemsPerPage = 10;

    // fetch coach data
    fetchCoaches( pageNum.value, maxCoaches);

    // if any coach in the list is clicked, navigate to the coach details page
    function routeToCoachDetail(id: string) {
      logger.debug('coach clicked', id);
      router.push({name: 'coach-detail', params: { coachId: id }});
    }

    // update the list of coaches with new coach data
    function updateCoachList(updatedCoaches: Array<Coach>) {
      logger.debug(`updateCoachList`, updatedCoaches);
      pageNum.value = 1;
      coaches.value = store.getters["coach/getPageOfCoaches"](pageNum.value, itemsPerPage);
    }

    function getPreviousPage() {
      if (pageNum.value > 1) {
        pageNum.value -= 1;
        logger.debug(`CoachList: get page ${pageNum.value} of coach data`);
        coaches.value = store.getters["coach/getPageOfCoaches"](pageNum.value, itemsPerPage);
      }
    }

    function getNextPage() {
      // todo how prevent fetching next page if we are at end? Check PageResult.length?
      pageNum.value += 1;
      logger.debug(`CoachList: get page ${pageNum.value} of coach data`);
      coaches.value = store.getters["coach/getPageOfCoaches"](pageNum.value, itemsPerPage);
    }


    // fetches a page of coach data from the API and store it in our local coaches ref
    // limit = the total number of coach data to try an fetch
    async function fetchCoaches(pageNum: number, limit = maxCoaches) {
      try {

        // fetch initial page of coaches
        const res: ApiResult<PagedResult<Coach>> = await store.dispatch('coach/fetchCoachesPage', { page: pageNum, limit: limit });
        if (res.code === 200) {
          // set our local coaches array to only contain "itemsPerPage" amount of coach data
          getNextPage();
        } else if (res.code >= 500) {
          // todo display global error for some backend error
          coaches.value = [];
        }

      } catch(e) {
        // todo display global error, some axios failure occurred
        coaches.value = [];
      }
    }

    async function resetPage() {
      pageNum.value = 0;
      await fetchCoaches(1, maxCoaches);
    }


    return {
      coaches,
      updateCoachList,
      routeToCoachDetail,
      getNextPage,
      getPreviousPage,
      pageNum,
      totalCoaches,
      itemsPerPage,
      fetchCoaches,
      resetPage,
    }
  }
})
</script>

<style scoped>

</style>