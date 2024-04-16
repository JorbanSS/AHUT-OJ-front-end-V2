import {
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router';

import Admin from "./admin";
import { needLoginCertificate } from "./guard";

const BaseTitle = "AHUT OJ | ";

const routes = [
  {
    path: "/",
    redirect: "home",
    meta: { title: BaseTitle + "Home" },
  },
  {
    name: "Home",
    path: "/home",
    component: () => import("@/pages/Home.vue"),
    meta: { title: BaseTitle + "Home" },
  },
  {
    name: "Problems",
    path: "/problems",
    component: () => import("@/pages/Problems.vue"),
    meta: { title: BaseTitle + "题库" },
  },
  {
    name: "ProblemList",
    path: "/problemlist/:LID",
    redirect: { name: "ProblemListDescription" },
    component: () => import("@/pages/ProblemList.vue"),
    meta: { title: BaseTitle + "题单" },
    children: [
      {
        name: "ProblemListDescription",
        path: "description",
        component: () => import("@/components/ProblemListChildren/Description.vue"),
      },
      {
        name: "ProblemListProblems",
        path: "problems",
        component: () => import("@/components/ProblemListChildren/Problems.vue"),
      },
      {
        name: "ProblemListRanking",
        path: "ranking",
        component: () => import("@/components/ProblemListChildren/Ranking.vue"),
      },
      {
        name: "ProblemListRecords",
        path: "records",
        component: () => import("@/components/ProblemListChildren/Records.vue"),
      },
      {
        name: "ProblemListDiscussion",
        path: "discussion",
        component: () => import("@/components/ProblemListChildren/Discussion.vue"),
      },
    ],
  },
  {
    name: "ProblemLists",
    path: "/problemlists",
    component: () => import("@/pages/ProblemLists.vue"),
    meta: { title: BaseTitle + "题单" },
  },
  {
    name: "Contest",
    path: "/contest/:CID",
    redirect: { name: "ContestDescription" },
    component: () => import("@/pages/Contest.vue"),
    meta: { title: BaseTitle + "比赛" },
    children: [
      {
        name: "ContestDescription",
        path: "description",
        component: () => import("@/components/ContestChildren/Description.vue"),
      },
      {
        name: "ContestProblems",
        path: "problems",
        component: () => import("@/components/ContestChildren/Problems.vue"),
      },
      {
        name: "ContestRanking",
        path: "ranking",
        component: () => import("@/components/ContestChildren/Ranking.vue"),
      },
      {
        name: "ContestRecords",
        path: "records",
        component: () => import("@/components/ContestChildren/Records.vue"),
      },
      {
        name: "ContestDiscussion",
        path: "discussion",
        component: () => import("@/components/ContestChildren/Discussion.vue"),
      },
    ],
  },
  {
    name: "Contests",
    path: "/contests",
    component: () => import("@/pages/Contests.vue"),
    meta: { title: BaseTitle + "比赛" },
  },
  {
    name: "Toolkit",
    path: "/toolkit",
    children: [
      {
        name: "RecentContests",
        path: "recentcontests",
        component: () => import("@/pages/ToolkitsChildren/RecentContests.vue"),
      },
      {
        name: "RankingList",
        path: "rankinglist",
        component: () => import("@/pages/ToolkitsChildren/RankingList.vue"),
      },
    ],
  },
  {
    name: "Training",
    path: "/training",
    component: () => import("@/pages/Training.vue"),
    meta: { title: BaseTitle + "训练" },
  },
  {
    name: "Records",
    path: "/records",
    component: () => import("@/pages/Records.vue"),
    meta: { title: BaseTitle + "记录" },
  },
  {
    name: "Record",
    path: "/record/:SID",
    component: () => import("@/pages/Record.vue"),
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
    component: () => import("@/pages/About.vue"),
    meta: { title: BaseTitle + "关于" },
  },
  {
    name: "JoinUs",
    path: "/joinus",
    component: () => import("@/pages/JoinUs.vue"),
    meta: { title: BaseTitle + "加入我们" },
  },
  {
    name: "Editor",
    path: "/editor",
    component: () => import("@/pages/Editor.vue"),
    meta: { title: BaseTitle + "Editor" },
  },
  {
    name: "Problem",
    path: "/problem/:PID/:BindID?",
    component: () => import("@/pages/Problem.vue"),
    meta: { title: BaseTitle + "题目" },
  },
  {
    name: "Test",
    path: "/test",
    component: () => import("@/pages/Test.vue"),
    meta: { title: BaseTitle + "测试" },
  },
  {
    name: "User",
    path: "/user/:UID",
    component: () => import("@/pages/User.vue"),
    meta: { title: BaseTitle + "用户" },
  },
  Admin,
  {
    name: "Error404",
    path: '/:pathMatch(.*)',
    component: () => import("@/pages/Error404.vue"),
    meta: { title: BaseTitle + "404" },
  },
];

export default routes;
