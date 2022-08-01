<script lang="ts">
// PageNav
// This is a reactive page navigation component that displays a PREV and NEXT button, along with a paragraph
// element that displays a count of the current items being displayed
//
import {defineComponent, computed} from "vue";
import ButtonNav from "../ui/buttons/ButtonNav.vue";
import logger from "../../utils/logger";

export default defineComponent({
  name: "PageNav",
  emits: ['next', 'prev'],
  props: {

    // a count of the total number of items being displayed PER page
    pageLimit: {
      type: Number,
      required: true,
    },
    // the page number being displayed (uses 1-based indexing)
    pageNum: {
      type: Number,
      required: true,
    },
    // the number of total items across all pages
    totalItems: {
      type: Number,
      required: true,
    }

  },
  components: {
    ButtonNav,
  },

  setup(props, context) {
    const itemStart = computed(() => (props.pageNum - 1) * props.pageLimit + 1);
    const itemEnd = computed(() => {
      let temp = itemStart.value + props.pageLimit - 1;
      if (temp > props.totalItems) {
        temp = props.totalItems;
      }
      return temp;
    });

    const disablePrev = computed(() => itemStart.value <= 1);
    const disableNext = computed(() => itemEnd.value >= props.totalItems);

    return {
      disablePrev,
      disableNext,
      itemStart,
      itemEnd,
    }
  }

})
</script>

<template>
  <div class="flex flex-col my-4 mx-4  md:flex-row justify-between items-center">
    <div>
      <p class="inline-block text-sm text-black font-normal">
        Items
        <span class="font-semibold">{{ itemStart }}</span>
         thru <span class="font-semibold">{{ itemEnd }}</span>
         of <span class="font-semibold">{{ totalItems }}</span>
      </p>
    </div>
    <div class="space-x-2">
      <button-nav
          @click="$emit('prev')"
          :disabled="disablePrev"
          :class="{ 'disabled:opacity-30': disablePrev, 'pointer-events-none': disablePrev }"
      >Prev
      </button-nav>
      <button-nav
          @click="$emit('next')"
          :disabled="disableNext"
          :class="{ 'disabled:opacity-30': disableNext, 'pointer-events-none': disableNext }"
      >Next
      </button-nav>
    </div>
  </div>
</template>

<style scoped>
</style>