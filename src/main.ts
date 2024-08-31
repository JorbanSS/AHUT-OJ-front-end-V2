import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { createNotivue } from 'notivue';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

import App from './App.vue';
import router from './routers';

import 'notivue/animations.css';
import 'notivue/notifications.css';
import "@/assets/scss/tailwind.scss";

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

app.mount('#app');