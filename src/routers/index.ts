import { createRouter, createWebHistory } from "vue-router";

import routes from "./routes";

const router = createRouter({
  history: createWebHistory(), // 路由器的工作模式
  routes,
});

router.beforeEach((to, _, next) => {
  window.document.title = to.meta.title as string;
  next();
});

export default router;