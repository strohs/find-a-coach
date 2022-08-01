import {createStore, StoreOptions} from 'vuex';
import {RootState} from "./types";
import {coach} from "./coaches";
import {request} from "./requests";
import {auth} from "./auth";

const root: StoreOptions<RootState> = {
    modules: {
        auth: auth,
        coach: coach,
        request: request,
    },

    // state: {},

    // mutations: {},

    // actions: {}

}

export default createStore(root);


