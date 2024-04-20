import {
  needAdminCertificate,
  needContestAdminCertificate,
  needLoginCertificate,
  needProblemAdminCertificate,
  needProblemListAdminCertificate,
  needSourceBorwserAdminCertificate,
  needSuperAdminCertificate,
} from "./guard.ts";

import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const BaseTitle = "AHUT OJ | ";

const Admin = {
  name: "Admin",
  redirect: { name: "AdminDashboard" },
  path: "/admin",
  component: () => import("@/pages/Admin.vue"),
  meta: { title: BaseTitle + "管理平台" },
  beforeEnter: (
    // @ts-ignore
    to: RouteLocationNormalized,
    // @ts-ignore
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (needAdminCertificate()) next();
  },
  children: [
    {
      name: "AdminDashboard",
      path: "dashboard",
      component: () => import("@/pages/AdminChildren/Dashboard.vue"),
    },
    {
      name: "AdminProblem",
      path: "problem",
      redirect: { name: "ProblemsList" },
      component: () => import("@/pages/AdminChildren/Problem.vue"),
      beforeEnter: (
        // @ts-ignore
        to: RouteLocationNormalized,
        // @ts-ignore
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needProblemAdminCertificate()) next();
      },
      children: [
        {
          name: "ProblemsList",
          path: "list",
          component: () =>
            import("@/pages/AdminChildren/ProblemChildren/List.vue"),
        },
        {
          name: "AddProblem",
          path: "add",
          component: () =>
            import("@/pages/AdminChildren/ProblemChildren/Add.vue"),
        },
        {
          name: "EditProblem",
          path: "edit/:PID",
          component: () =>
            import("@/pages/AdminChildren/ProblemChildren/Edit.vue"),
        },
        {
          name: "ProblemData",
          path: "data/:PID",
          component: () =>
            import("@/pages/AdminChildren/ProblemChildren/Data.vue"),
        },
        {
          name: "ImportProblem",
          path: "import",
          component: () =>
            import("@/pages/AdminChildren/ProblemChildren/Import.vue"),
        },
      ],
    },
    {
      name: "AdminProblemList",
      path: "problemlist",
      redirect: { name: "ProblemListsList" },
      component: () => import("@/pages/AdminChildren/ProblemList.vue"),
      beforeEnter: (
        // @ts-ignore
        to: RouteLocationNormalized,
        // @ts-ignore
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needProblemListAdminCertificate()) next();
      },
      children: [
        {
          name: "ProblemListsList",
          path: "list",
          component: () =>
            import("@/pages/AdminChildren/ProblemListChildren/List.vue"),
        },
        {
          name: "AddProblemList",
          path: "add",
          component: () =>
            import("@/pages/AdminChildren/ProblemListChildren/Add.vue"),
        },
        {
          name: "EditProblemList",
          path: "edit/:LID",
          component: () =>
            import("@/pages/AdminChildren/ProblemListChildren/Edit.vue"),
        },
      ],
    },
    {
      name: "AdminContest",
      path: "contest",
      redirect: { name: "ContestsList" },
      component: () => import("@/pages/AdminChildren/Contest.vue"),
      beforeEnter: (
        // @ts-ignore
        to: RouteLocationNormalized,
        // @ts-ignore
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needContestAdminCertificate()) next();
      },
      children: [
        {
          name: "ContestsList",
          path: "list",
          component: () =>
            import("@/pages/AdminChildren/ContestChildren/List.vue"),
        },
        {
          name: "AddContest",
          path: "add",
          component: () =>
            import("@/pages/AdminChildren/ContestChildren/Add.vue"),
        },
        {
          name: "EditContest",
          path: "edit/:CID",
          component: () =>
            import("@/pages/AdminChildren/ContestChildren/Edit.vue"),
        },
        {
          name: "EditBalloon",
          path: "balloon/:CID",
          component: () =>
            import("@/pages/AdminChildren/ContestChildren/Balloon.vue"),
        },
      ],
    },
    {
      name: "AdminTraining",
      path: "training",
      component: () => import("@/pages/AdminChildren/Training.vue"),
      beforeEnter: (
        // @ts-ignore
        to: RouteLocationNormalized,
        // @ts-ignore
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needProblemListAdminCertificate()) next();
      },
    },
    {
      name: "AdminUser",
      path: "user",
      component: () => import("@/pages/AdminChildren/User.vue"),
      beforeEnter: (
        // @ts-ignore
        to: RouteLocationNormalized,
        // @ts-ignore
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needSuperAdminCertificate()) next();
      },
    },
    {
      name: "AdminOther",
      path: "other",
      component: () => import("@/pages/AdminChildren/Other.vue"),
      redirect: { name: "AdminOss" },
      beforeEnter: (
        // @ts-ignore
        to: RouteLocationNormalized,
        // @ts-ignore
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needSuperAdminCertificate()) next();
      },
      children: [
        {
          name: "AdminOss",
          path: "oss",
          component: () =>
            import("@/pages/AdminChildren/OtherChildren/Oss.vue"),
        },
      ],
    },
  ],
};

export default Admin;
