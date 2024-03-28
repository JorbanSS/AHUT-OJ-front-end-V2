import { createRouter, createWebHistory } from "vue-router";
import { trackRouter } from "vue-gtag-next";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(), // 路由器的工作模式
  routes,
});

router.beforeEach((to, _, next) => {
  window.document.title = to.meta.title as string;
  next();
});

trackRouter(router);

export default router;