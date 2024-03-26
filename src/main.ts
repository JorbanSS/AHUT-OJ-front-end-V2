import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createNotivue } from 'notivue';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from './App.vue';
import router from './router';
import VCalendar from 'v-calendar';

import "./assets/scss/tailwind.scss";
import 'notivue/notifications.css';
import 'notivue/animations.css';
import 'v-calendar/style.css';

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

app.use(router);
app.use(store);
app.use(notivue);
app.use(autoAnimatePlugin);
app.use(VCalendar, {})

app.mount('#app');