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
  component: () => import("@/views/Admin.vue"),
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
      component: () => import("@/views/AdminChildren/Dashboard.vue"),
    },
    {
      name: "AdminProblem",
      path: "problem",
      redirect: { name: "ProblemsList" },
      component: () => import("@/views/AdminChildren/Problem.vue"),
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
            import("@/views/AdminChildren/ProblemChildren/List.vue"),
        },
        {
          name: "AddProblem",
          path: "add",
          component: () =>
            import("@/views/AdminChildren/ProblemChildren/Add.vue"),
        },
        {
          name: "EditProblem",
          path: "edit/:PID",
          component: () =>
            import("@/views/AdminChildren/ProblemChildren/Edit.vue"),
        },
        {
          name: "ProblemData",
          path: "data/:PID",
          component: () =>
            import("@/views/AdminChildren/ProblemChildren/Data.vue"),
        },
        {
          name: "ImportProblem",
          path: "import",
          component: () =>
            import("@/views/AdminChildren/ProblemChildren/Import.vue"),
        },
      ],
    },
    {
      name: "AdminProblemList",
      path: "problemlist",
      redirect: { name: "ProblemListsList" },
      component: () => import("@/views/AdminChildren/ProblemList.vue"),
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
            import("@/views/AdminChildren/ProblemListChildren/List.vue"),
        },
        {
          name: "AddProblemList",
          path: "add",
          component: () =>
            import("@/views/AdminChildren/ProblemListChildren/Add.vue"),
        },
        {
          name: "EditProblemList",
          path: "edit/:LID",
          component: () =>
            import("@/views/AdminChildren/ProblemListChildren/Edit.vue"),
        },
      ],
    },
    {
      name: "AdminContest",
      path: "contest",
      redirect: { name: "ContestsList" },
      component: () => import("@/views/AdminChildren/Contest.vue"),
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
            import("@/views/AdminChildren/ContestChildren/List.vue"),
        },
        {
          name: "AddContest",
          path: "add",
          component: () =>
            import("@/views/AdminChildren/ContestChildren/Add.vue"),
        },
        {
          name: "EditContest",
          path: "edit/:CID",
          component: () =>
            import("@/views/AdminChildren/ContestChildren/Edit.vue"),
        },
        {
          name: "EditBalloon",
          path: "balloon/:CID",
          component: () =>
            import("@/views/AdminChildren/ContestChildren/Balloon.vue"),
        },
      ],
    },
    {
      name: "AdminTraining",
      path: "training",
      component: () => import("@/views/AdminChildren/Training.vue"),
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
      component: () => import("@/views/AdminChildren/User.vue"),
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
      component: () => import("@/views/AdminChildren/Other.vue"),
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
            import("@/views/AdminChildren/OtherChildren/Oss.vue"),
        },
        {
          name: "AdminUpdateLogs",
          path: "updatelogs",
          component: () =>
            import("@/views/AdminChildren/OtherChildren/UpdateLogs.vue"),
        },
      ],
    },
  ],
};

export default Admin;
