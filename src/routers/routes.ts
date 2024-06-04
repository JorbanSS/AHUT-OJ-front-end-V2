import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import Admin from "./admin";
import { needLoginCertificate } from "./guard";

const BaseTitle = "AHUT OJ | ";

const routes = [
  {
    path: "/",
    redirect: { name: "Index" },
    meta: { title: BaseTitle + "Home" },
  },
  {
    name: "Index",
    path: "/index",
    component: () => import("@/views/Index.vue"),
    meta: { title: BaseTitle + "Home" },
  },
  {
    name: "Problems",
    path: "/problems",
    component: () => import("@/views/Problems.vue"),
    meta: { title: BaseTitle + "题库" },
  },
  {
    name: "ProblemList",
    path: "/problemlist/:LID",
    redirect: { name: "ProblemListDescription" },
    component: () => import("@/views/ProblemList.vue"),
    meta: { title: BaseTitle + "题单" },
    children: [
      {
        name: "ProblemListDescription",
        path: "description",
        component: () => import("@/components/ProblemList/Description.vue"),
      },
      {
        name: "ProblemListProblems",
        path: "problems",
        component: () => import("@/components/ProblemList/Problems.vue"),
      },
      {
        name: "ProblemListRanking",
        path: "ranking",
        component: () => import("@/components/ProblemList/Ranking.vue"),
      },
      {
        name: "ProblemListRecords",
        path: "records",
        component: () => import("@/components/ProblemList/Records.vue"),
      },
      {
        name: "ProblemListDiscussions",
        path: "discussions",
        component: () => import("@/components/ProblemList/Discussions.vue"),
      },
    ],
  },
  {
    name: "ProblemLists",
    path: "/problemlists",
    component: () => import("@/views/ProblemLists.vue"),
    meta: { title: BaseTitle + "题单" },
  },
  {
    name: "Contest",
    path: "/contest/:CID",
    redirect: { name: "ContestDescription" },
    component: () => import("@/views/Contest.vue"),
    meta: { title: BaseTitle + "比赛" },
    children: [
      {
        name: "ContestDescription",
        path: "description",
        component: () => import("@/components/Contest/Description.vue"),
      },
      {
        name: "ContestProblems",
        path: "problems",
        component: () => import("@/components/Contest/Problems.vue"),
      },
      {
        name: "ContestRanking",
        path: "ranking",
        component: () => import("@/components/Contest/Ranking.vue"),
      },
      {
        name: "ContestRecords",
        path: "records",
        component: () => import("@/components/Contest/Records.vue"),
      },
      {
        name: "ContestDiscussions",
        path: "discussions",
        component: () => import("@/components/Contest/Discussions.vue"),
      },
    ],
  },
  {
    name: "Contests",
    path: "/contests",
    component: () => import("@/views/Contests.vue"),
    meta: { title: BaseTitle + "比赛" },
  },
  {
    name: "Toolkit",
    path: "/toolkit",
    children: [
      {
        name: "RecentContests",
        path: "recentcontests",
        component: () => import("@/views/ToolkitsChildren/RecentContests.vue"),
      },
      {
        name: "RankingList",
        path: "rankinglist",
        component: () => import("@/views/ToolkitsChildren/RankingList.vue"),
      },
    ],
  },
  {
    name: "Training",
    path: "/training",
    component: () => import("@/views/Training.vue"),
    meta: { title: BaseTitle + "训练" },
  },
  {
    name: "Records",
    path: "/records",
    component: () => import("@/views/Records.vue"),
    meta: { title: BaseTitle + "记录" },
  },
  {
    name: "Record",
    path: "/record/:SID",
    component: () => import("@/views/Record.vue"),
    meta: { title: BaseTitle + "记录" },
    beforeEnter: (
      // @ts-ignore
      to: RouteLocationNormalized,
      // @ts-ignore
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      if (needLoginCertificate()) next();
    },
  },
  {
    name: "About",
    path: "/about",
    component: () => import("@/views/About.vue"),
    meta: { title: BaseTitle + "关于" },
  },
  {
    name: "JoinUs",
    path: "/joinus",
    component: () => import("@/views/JoinUs.vue"),
    meta: { title: BaseTitle + "加入我们" },
  },
  {
    name: "Editor",
    path: "/editor",
    component: () => import("@/views/Editor.vue"),
    meta: { title: BaseTitle + "Editor" },
  },
  {
    name: "Problem",
    path: "/problem/:PID/:BindID?",
    component: () => import("@/views/Problem.vue"),
    meta: { title: BaseTitle + "题目" },
    redirect: { name: "ProblemDescription" },
    children: [
      {
        name: "ProblemDescription",
        path: "description",
        component: () => import("@/components/Problem/Description.vue"),
      },
      {
        name: "ProblemRecords",
        path: "records",
        component: () => import("@/components/Problem/Records.vue"),
      },
      {
        name: "ProblemDiscussions",
        path: "discussions",
        component: () => import("@/components/Problem/Discussions.vue"),
      },
    ],
  },
  {
    name: "User",
    path: "/user/:UID",
    component: () => import("@/views/User.vue"),
    meta: { title: BaseTitle + "用户" },
  },
  Admin,
  {
    name: "Error404",
    path: "/:pathMatch(.*)",
    component: () => import("@/views/Error404.vue"),
    meta: { title: BaseTitle + "404" },
  },
];

export default routes;
