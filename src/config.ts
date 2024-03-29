import { type NavItemType } from "./type";

import {
  DocumentFolder,
  Toolkit,
  Data,
  Info,
  Trophy,
  Muscle,
  RankingList,
  ListOne,
  Topic,
  Peoples,
  MoreTwo,
  Bill,
} from "@icon-park/vue-next";


export const navItems: Array<NavItemType> = [
  { title: "题库", icon: DocumentFolder, to: { name: "Problems" } },
  { title: "题单", icon: Bill, to: { name: "ProblemLists" } },
  { title: "比赛", icon: Trophy, to: { name: "Contests" } },
  { title: "训练", icon: Muscle, to: { name: "Training" } },
  {
    title: "工具",
    icon: Toolkit,
    subItems: [
      { title: "近期比赛", icon: ListOne, to: { name: "RecentContests" } },
      { title: "排行榜", icon: RankingList, to: { name: "RankingList" } },
    ],
  },
  { title: "记录", icon: Data, to: { name: "Records" } },
  { title: "关于", icon: Info, to: { name: "About" } },
];

export const contestNavItems: Array<NavItemType> = [
  { title: "比赛说明", icon: Info, to: { name: "ContestDescription" } },
  { title: "题目", icon: DocumentFolder, to: { name: "ContestProblems" } },
  { title: "排名", icon: RankingList, to: { name: "ContestRanking" } },
  { title: "记录", icon: Data, to: { name: "ContestRecords" } },
  { title: "题解 & 讨论", icon: Topic, to: { name: "ContestDiscussion" } },
];

export const adminNavItems: Array<NavItemType> = [
  { title: "题库", icon: DocumentFolder, to: { name: "AdminProblem" } },
  { title: "题单", icon: Bill, to: { name: "AdminProblemList" } },
  { title: "比赛", icon: Trophy, to: { name: "AdminContest" } },
  { title: "训练", icon: Muscle, to: { name: "AdminTraining" } },
  { title: "用户", icon: Peoples, to: { name: "AdminUser" } },
  { title: "杂项", icon: MoreTwo, to: { name: "AdminOther" } },
];