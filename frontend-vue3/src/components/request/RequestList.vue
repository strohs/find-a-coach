<script lang="ts">
// RequestList
// This component lists a page of coaching requests for the currently logged in Coach
import {computed, defineComponent, isRef, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {shortDateFormat} from "../../utils/date-format";
import {CoachingRequest, builder} from "../../models/CoachingRequest";
import BaseTable from "../ui/BaseTable.vue";
import ButtonDelete from "../ui/buttons/ButtonDelete.vue";
import PageNav from "../nav/PageNav.vue";
import logger from "../../utils/logger";
import {PagedResult} from "../../models/PagedResult";
import ApiResult from "../../models/ApiResult";
import {is} from "@vee-validate/rules";

export default defineComponent({
  name: "RequestList",
  components: {
    BaseTable,
    PageNav,
    ButtonDelete,
  },
  emits: ['error-event'],

  setup(props, context) {
    const store = useStore();
    const router = useRouter();

    // holds a page worth of coaching request data
    let requests = ref<Array<CoachingRequest>>([]);

    // current page number
    const pageNum = ref(1);

    // how many items to display in the table, per page
    const itemsPerPage = 12;

    // compute number of coaching requests currently stored in the Vuex request store
    const totalRequests = computed(() => store.getters["request/getTotalRequests"]);

    // maximum number of requests to fetch initially
    const maxRequests = 1000;

    // computes the starting index within the request store, to starting displaying at
    const indexStart = computed(() => {
      if (pageNum.value <= 1) {
        return 0;
      } else {
        return (pageNum.value - 1) * itemsPerPage
      }
    });

    // computes the ending index within the request store (exclusive), to stop displaying data at
    const indexEnd = computed(() => {
      let temp = indexStart.value + itemsPerPage;
      if (temp > totalRequests.value) {
        return totalRequests.value;
      } else {
        return temp;
      }
    });

    getCoachingRequests();

    // get requests for the currently logged in coach, OR if the logged-in user is an admin, fetch all requests
    async function getCoachingRequests() {

      let reqs: ApiResult<PagedResult<CoachingRequest>> | null = null;
      const isAuthenticated = store.getters["auth/isAuthenticated"];
      const isAdmin = store.getters["auth/isAdmin"];
      logger.debug(`isAuthenticated:${isAuthenticated} isAdmin:${isAdmin}`);


      if (isAdmin) {
        logger.debug("coach is admin, fetching all coaching requests...");
        reqs = await store.dispatch("request/fetchAllRequests", {coachId: '', pageNum: 1, limit: maxRequests});
      } else if (isAuthenticated) {
        // coach is logged in, get their coaching requests
        const coach = store.getters["auth/coach"];
        logger.debug("getting reqs for coach", coach.id);
        reqs = await store.dispatch("request/fetchRequestsForCoach", {
          coachId: coach.id,
          pageNum: 1,
          limit: maxRequests
        });
      } else {
        logger.warn("an unauthenticated user attempted to retrieve coaching request data");
        //todo display error message box
        const emptyRequest = builder();
        requests.value = [emptyRequest];
      }

      if (reqs && reqs.code === 200) {
        requests.value = store.getters["request/getSliceOfRequests"](indexStart.value, indexEnd.value);
      } else {
        const emptyRequest = builder();
        requests.value = [emptyRequest];
        context.emit("error-event", "could not fetch coaching requests");
      }
    }

    // truncates the coaching request message so that only 40 characters are displayed in the table
    function truncateMessage(msg: string, maxChars: number = 40): string {
      if (msg.length > maxChars) {
        return msg.substring(0, maxChars) + "...";
      } else {
        return msg;
      }
    }

    // handle a row click event, by navigating to the request-detail page
    function rowClick(id: string) {
      logger.debug("click for request", id);
      router.push({name: "request-detail", params: {requestId: id}});
    }

    // delete a coaching request by its primary id
    async function deleteRequest(id: string, event: Event) {
      event.stopPropagation();
      logger.debug("delete coaching request", id);
      const res = await store.dispatch("request/deleteRequest", id);
      if (res.code === 204) {
        requests.value = store.getters["request/getSliceOfRequests"](indexStart.value, indexEnd.value);
      } else {
        context.emit("error-event", res.message);
      }

    }

    // get the next page of requests by incrementing the current page number
    function getNextPage() {
      const totalPages = totalRequests.value / itemsPerPage;
      if (pageNum.value <= totalPages) {
        pageNum.value += 1;
        requests.value = store.getters["request/getSliceOfRequests"](indexStart.value, indexEnd.value);
      }
    }

    // get the previous page of requests by decrementing the current page number
    function getPreviousPage() {
      if (pageNum.value > 1) {
        pageNum.value -= 1;
        requests.value = store.getters["request/getSliceOfRequests"](indexStart.value, indexEnd.value);
      }
    }

    return {
      requests,
      shortDateFormat,
      truncateMessage,
      rowClick,
      deleteRequest,
      itemsPerPage,
      totalRequests,
      pageNum,
      getPreviousPage,
      getNextPage,
    }
  }
})
</script>

<template>
  <div class="flex flex-col xl:mx-auto">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <base-table>
            <template #header-rows>
              <tr>
                <th scope="col"
                    class="hidden md:inline-block px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Replied
                </th>
                <th scope="col"
                    class="hidden md:inline-block px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received At
                </th>
                <th scope="col"
                    class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To Coach
                </th>
                <th scope="col"
                    class="hidden md:inline-block px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th scope="col"
                    class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col"
                    class="hidden md:inline-block px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500">
                </th>
              </tr>
            </template>

            <template #body-rows>
              <tr v-for="(request, index) in requests"
                  :key="request.id" :class="{ 'bg-gray-100': index % 2 !== 0}"
                  class="hover:bg-blue-200 cursor-pointer"
                  @click="rowClick(request.id)"
              >
                <td class="hidden md:inline-block px-3 py-2 md:px-6 md:py-4 text-sm font-medium whitespace-normal"
                >
                  <img v-if="request.replyAt" class="h-5 w-5 rounded-full" src="../../assets/check-circle.svg"
                       alt="check mark">
                  <img v-else class="h-5 w-5 rounded-full" src="../../assets/question.svg" alt="not answered">
                </td>

                <td class="hidden md:inline-block px-3 py-2 md:px-6 md:py-4 text-sm font-medium whitespace-normal"
                >
                  {{ shortDateFormat(new Date(request.createdAt).getTime()) }}
                </td>

                <td class="px-3 py-2 md:px-6 md:py-4 text-sm font-medium whitespace-normal"
                >
                  {{ request.coach.firstName }} {{ request.coach.lastName }}
                </td>

                <td class="hidden md:inline-block px-3 py-2 md:px-6 md:py-4 text-sm font-medium whitespace-normal">
                  {{ request.fromEmail }}
                </td>

                <td class="px-3 py-2 md:px-6 md:py-4 text-sm font-medium whitespace-normal">
                  {{ truncateMessage(request.message) }}
                </td>

                <td class="hidden md:inline-block px-3 py-2 md:px-6 md:py-4 text-sm">
                  <ButtonDelete @click="deleteRequest(request.id, $event)">
                    Delete
                  </ButtonDelete>
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
              :total-items="totalRequests"
          >
          </page-nav>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>