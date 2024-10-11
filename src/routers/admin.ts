import {
  needAdminCertificate,
  needContestAdminCertificate,
  needLoginCertificate,
  needProblemAdminCertificate,
  needProblemListAdminCertificate,
  needSourceBorwserAdminCertificate,
  needSuperAdminCertificate,
  needGroupAdminCertificate,
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
      redirect: { name: "ProblemListList" },
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
          name: "ProblemListList",
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
      redirect: { name: "ContestList" },
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
          name: "ContestList",
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
      name: "AdminGroup",
      path: "group",
      redirect: { name: "GroupList" },
      component: () => import("@/views/AdminChildren/Group.vue"),
      beforeEnter: (
        // @ts-ignore
        to: RouteLocationNormalized,
        // @ts-ignore
        from: RouteLocationNormalized,
        next: NavigationGuardNext
      ) => {
        if (needGroupAdminCertificate()) next();
      },
      children: [
        {
          name: "AddGroup",
          path: "add",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/Add.vue"),
        },
        {
          name: "GroupList",
          path: "list",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/List.vue"),
        },
        {
          name: "EditGroup",
          path: "edit/:GID/:PID/:CID/:LID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/Edit.vue"),
        },
        {
          name: "ContestAddTask",
          path: "contestaddtask/:GID/:LID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/ContestAddTask.vue"),
        },
        {
          name: "ProblemAddTask",
          path: "problemaddtask:GID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/ProblemAddTask.vue"),
        },
        {
          name: "ProblemListAddTask",
          path: "problemlistaddtask:GID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/ProblemListTaskAdd.vue"),
        },
        {
          name: "ProblemListTaskEdit",
          path: "ProblemListTaskEdit/:GID/:LID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/ProblemListTaskEdit.vue"),
        },
        {
          name: "ContestTaskEdit",
          path: "ContestTaskEdit/:GID/:CID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/ContestTaskEdit.vue"),
        },
        {
          name: "GroupTaskList",
          path: "GroupTaskList/:GID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/GroupTaskList.vue"),
        },
        {
          name: "GroupProgress",
          path: "GroupProgress/:GID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/GroupProgress.vue"),
        },
        {
          name: "GroupTaskProblemRecord",
          path: "GroupTaskProblemRecord/:SID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/TaskRecord.vue"),
        },
        {
          name: "ProblemListSelect",
          path: "ProblemListSelect:GID",
          component: () =>
            import("@/views/AdminChildren/GroupChildren/ProblemListSelect.vue"),
        }
      ],
    },
    {
      name: "AdminUser",
      path: "user",
      redirect: { name: "AdminList" },
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
      children: [
        {
          name: "AdminList",
          path: "adminlist",
          component: () =>
            import("@/views/AdminChildren/UserChildren/AdminList.vue"),
        },
        {
          name: "UserList",
          path: "userlist",
          component: () =>
            import("@/views/AdminChildren/UserChildren/UserList.vue"),
        },
        {
          name: "ImportUsers",
          path: "import",
          component: () =>
            import("@/views/AdminChildren/UserChildren/Import.vue"),
        },
      ],
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
          name: "AdminUpdateLog",
          path: "updatelog",
          component: () =>
            import("@/views/AdminChildren/OtherChildren/UpdateLog.vue"),
        },
        {
          name: "AdminAskAI",
          path: "askai",
          component: () =>
            import("@/views/AdminChildren/OtherChildren/AskAI.vue"),
        },
      ],
    },
    {
      name: "AdminCodeReview",
      path: "codereview",
      component: () => import("@/views/AdminChildren/CodeReview.vue"),
      redirect: { name: "AdminCodeReviewTips" },
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
          name: "AdminCodeReviewTips",
          path: "tips",
          component: () =>
            import("@/views/AdminChildren/CodeReviewChildren/Tips.vue"),
        },
        {
          name: "AdminCodeReviewProblemSelect",
          path: "problemselect/:CID",
          component: () =>
            import(
              "@/views/AdminChildren/CodeReviewChildren/ProblemSelect.vue"
            ),
        },
        {
          name: "AdminCodeReviewRecordList",
          path: "recordlist/:CID/:PID",
          component: () =>
            import("@/views/AdminChildren/CodeReviewChildren/RecordList.vue"),
        },
      ],
    },
  ],
};

export default Admin;
