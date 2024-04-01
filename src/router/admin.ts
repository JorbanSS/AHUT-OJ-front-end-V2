import {
  needLoginCertificate,
  needAdminCertificate,
  needContestAdminCertificate,
  needProblemListAdminCertificate,
  needProblemAdminCertificate,
  needSourceBorwserAdminCertificate,
  needSuperAdminCertificate
} from "./guard.ts"

const BaseTitle = "AHUT OJ | ";

const Admin = {
  name: "Admin",
  redirect: "/admin/dashboard",
  path: "/admin",
  component: () => import("@/pages/Admin.vue"),
  meta: { title: BaseTitle + "管理平台" },
  beforeEnter: (
    to: RouteLocationNormalized,
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
      redirect: "/admin/problem/list",
      component: () => import("@/pages/AdminChildren/Problem.vue"),
      beforeEnter: (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needProblemAdminCertificate()) next();
      },
      children: [
        {
          name: "ProblemsList",
          path: "list",
          component: () => import("@/pages/AdminChildren/ProblemChildren/List.vue"),
        },
        {
          name: "AddProblem",
          path: "add",
          component: () => import("@/pages/AdminChildren/ProblemChildren/Add.vue"),
        },
        {
          name: "EditProblem",
          path: "edit/:PID",
          component: () => import("@/pages/AdminChildren/ProblemChildren/Edit.vue"),
        },
        {
          name: "ProblemData",
          path: "data/:PID",
          component: () => import("@/pages/AdminChildren/ProblemChildren/Data.vue"),
        },
        {
          name: "ImportProblem",
          path: "import",
          component: () => import("@/pages/AdminChildren/ProblemChildren/Import.vue"),
        },
        {
          name: "ExportProblem",
          path: "export",
          component: () => import("@/pages/AdminChildren/ProblemChildren/Export.vue"),
        }
      ],
    },
    {
      name: "AdminProblemList",
      path: "problemlist",
      redirect: "/admin/problemlist/list",
      component: () => import("@/pages/AdminChildren/ProblemList.vue"),
      beforeEnter: (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needProblemListAdminCertificate()) next();
      },
      children: [
        {
          name: "ProblemListsList",
          path: "list",
          component: () => import("@/pages/AdminChildren/ProblemListChildren/List.vue"),
        },
        {
          name: "AddProblemList",
          path: "add",
          component: () => import("@/pages/AdminChildren/ProblemListChildren/Add.vue"),
        },
        {
          name: "EditProblemList",
          path: "edit/:LID",
          component: () => import("@/pages/AdminChildren/ProblemListChildren/Edit.vue"),
        },
      ],
    },
    {
      name: "AdminContest",
      path: "contest",
      redirect: "/admin/contest/list",
      component: () => import("@/pages/AdminChildren/Contest.vue"),
      beforeEnter: (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needContestAdminCertificate()) next();
      },
      children: [
        {
          name: "ContestsList",
          path: "list",
          component: () => import("@/pages/AdminChildren/ContestChildren/List.vue"),
        },
        {
          name: "AddContest",
          path: "add",
          component: () => import("@/pages/AdminChildren/ContestChildren/Add.vue"),
        },
        {
          name: "EditContest",
          path: "edit/:CID",
          component: () => import("@/pages/AdminChildren/ContestChildren/Edit.vue"),
        },
      ],
    },
    {
      name: "AdminTraining",
      path: "training",
      component: () => import("@/pages/AdminChildren/Training.vue"),
    },
    {
      name: "AdminUser",
      path: "user",
      component: () => import("@/pages/AdminChildren/User.vue"),
      beforeEnter: (
        to: RouteLocationNormalized,
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
    },
  ]
};

export default Admin;