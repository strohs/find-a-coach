<script lang="ts">
// MainHeader
// This is the main navigation bar that appears across the top of ALL pages
import {computed, defineComponent, ref} from "vue";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import logger from "../../utils/logger";

export default defineComponent({
  name: "MainHeader",

  setup() {
    const store = useStore();
    const router = useRouter();

    let isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);
    let showMobileMenu = ref(false);

    // function toggleMobileMenu() {
    //   showMobileMenu.value = !showMobileMenu.value;
    // }

    // log the coach out, and then navigate to the login screen
    async function doLogout() {
      logger.debug(`logging out user`, store.getters["auth/coach"].id);
      await store.dispatch('auth/logout');
      router.push({name: 'login', params: { message: 'you have been logged out' }});
    }

    return {
      showMobileMenu,
      isAuthenticated,
      doLogout,
    }
  }

})
</script>

<template>

  <nav class="bg-indigo_dye">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false" @click="showMobileMenu = !showMobileMenu">
            <span class="sr-only">Open main menu</span>
            <!--
              Icon when menu is closed.

              Heroicon name: outline/menu

              Menu open: "hidden", Menu closed: "block"
            -->
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!--
              Icon when menu is open.

              Heroicon name: outline/x

              Menu open: "block", Menu closed: "hidden"
            -->
            <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">

          <!-- find a coach logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link :to="{ name: 'hero' }">
              <img class="block lg:hidden h-8 w-auto" src="../../assets/whistle.svg" alt="whistle">
              <div class="hidden lg:flex justify-evenly h-8 w-auto">
                <img class="h-8 w-auto" src="../../assets/whistle.svg" alt="whistle">
                <img class="h-8 w-auto" src="../../assets/findacoach.svg" alt="find a coach">
              </div>
            </router-link>
          </div>

          <!-- nav-links -->
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <router-link class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                           active-class="bg-gray-900 text-white"
                           :to="{ name: 'coaches'}"
              >Search Coaches
              </router-link>

              <router-link v-if="isAuthenticated" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                           active-class="bg-gray-900 text-white"
                           :to="{ name: 'requests'}"
              >
                Your Coaching Requests
              </router-link>

            </div>
          </div>
        </div>

        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <a v-if="isAuthenticated"
             @click="doLogout"
             class="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer px-3 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </a>
          <router-link v-else class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                       active-class="bg-gray-900 text-white"
                       :to="{ name: 'register-coach'}"
          >Register
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div v-if="showMobileMenu" class="sm:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 flex flex-col">
        <router-link class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                     active-class="bg-gray-900 text-white"
                     :to="{ name: 'coaches'}"
        >Search Coaches
        </router-link>

        <router-link v-if="isAuthenticated" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                     active-class="bg-gray-900 text-white"
                     :to="{ name: 'requests'}"
        >Your Coaching Requests
        </router-link>

        <router-link class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                     active-class="bg-gray-900 text-white"
                     :to="{ name: 'register-coach'}"
        >Register
        </router-link>
      </div>
    </div>

  </nav>

</template>

<style scoped>

</style>