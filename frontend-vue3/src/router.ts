import {createRouter, createWebHistory} from "vue-router";
import CoachList from "./components/coach/CoachList.vue";
import RequestList from "./components/request/RequestList.vue";
import CoachDetail from "./components/coach/CoachDetail.vue";
import ContactCoachForm from "./components/coach/ContactCoachForm.vue";
import RegisterCoachForm from "./components/coach/RegisterCoachForm.vue";
import NotFound from "./pages/NotFound.vue";
import RequestDetail from "./components/request/RequestDetail.vue";
import Hero from "./pages/Hero.vue";
import Requests from "./pages/Requests.vue";
import MainHeader from "./components/nav/MainHeader.vue";
import Coaches from "./pages/Coaches.vue";
import Login from "./pages/Login.vue";
import Company from "./pages/Company.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [

        //// main "hero" page
        { name:"hero", path: '/', component: Hero },

        //// coach login page
        { name:"login", path: '/login', props: true, component: Login },

        //// Company Information Page
        { name:"company", path: '/company', component: Company },

        //// Coach search by expertise page
        {
            path: '/coaches',
            component: Coaches,
            children: [
                {
                    path: '',
                    name: 'coaches',
                    component: CoachList,
                },
            ]
        },

        //// Coach information routes. These routes will either display
        //// a coaches contact form, or a coaches details
        {
            path: '/coach',
            component: Coaches,
            children: [
                {
                    path: ':coachId/contact',
                    name: 'contact',
                    props: true,
                    component: ContactCoachForm,
                },
                {
                    path: ':coachId',
                    name: 'coach-detail',
                    component: CoachDetail,
                    props: true,
                },
            ]
        },


        //// CoachingRequest related routes. These components display a coaches
        //// current coaching requests
        {
            path: '/requests',
            component: Requests,
            children: [
                // the default component lists coaching requests by page
                {
                    path: "",
                    name: "requests",
                    component: RequestList,
                }
            ]
        },

        // display details of a specific request for coaching
        {
            path: '/request',
            component: Requests,
            children: [
                {
                    path: ':requestId',
                    name: 'request-detail',
                    component: RequestDetail,
                    props: true,
                }
            ]
        },

        //// New coach registration
        {
            path: '/register',
            name: 'register-coach',
            props: true,
            components: {
                default: RegisterCoachForm,
                MainHeader,
            },
        },


        // dynamic segment that matched all routes. Catch all for any unmatched routes, must be at end of routes list
        { path: '/:notFound(.*)', component: NotFound }
    ],

    // Globally configure <router-link> default active class, there is also linkExactActiveClass
    linkActiveClass: 'active',

});

export default router;
