import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor';
import { createNotivue } from 'notivue';
import VCalendar from 'v-calendar';
import VueGtag from "vue-gtag-next";

import App from './App.vue';
import router from './router';

import 'notivue/animations.css';
import 'notivue/notifications.css';
import 'v-calendar/style.css';
import "./assets/scss/tailwind.scss";

const app = createApp(App);
const store = createPinia();
const notivue = createNotivue({
  enqueue: false,
  limit: 5,
  position: 'bottom-right',
  notifications: {
    global: {
      duration: 3200
    }
  }
});

app.use(store);
app.use(router);
app.use(notivue);
app.use(autoAnimatePlugin);
app.use(VCalendar, {})
if (import.meta.env.MODE == "production") {
  app.use(VueGtag, {
    property: {
      id: "G-9T4V1HQNSN"
    },
  });
};
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  },
  "vs/nls": { availableLanguages: { "*": "de" } }
});

app.mount('#app');