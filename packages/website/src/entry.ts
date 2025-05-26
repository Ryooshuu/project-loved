import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { routes } from "vue-router/auto-routes";

import App from "./App.vue";
import "./styles/index.css";
import "unfonts.css"; // what

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App)
    .use(router)
    .use(createPinia())
    .mount("#app");
