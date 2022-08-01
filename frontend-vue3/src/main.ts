import { createApp } from 'vue'

import App from './App.vue'
import router from './router';
import store from './store/index';
import VueLogger from "vuejs3-logger";
import vue3LoggerConfig from "./configs/vue.logger.config";

// import our tailwind .css file
import './index.css'

const app = createApp(App);

app.use(VueLogger, vue3LoggerConfig);
app.use(router);
app.use(store);

app.mount('#app');

