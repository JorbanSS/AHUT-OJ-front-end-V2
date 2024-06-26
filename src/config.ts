import {
  Bill,
  Caution,
  Check,
  Close,
  History,
  DocumentFolder,
  HardDisk,
  Info,
  LoadingOne,
  MoreTwo,
  Muscle,
  Peoples,
  RankingList,
  Time,
  Topic,
  Trophy
} from "@icon-park/vue-next";
import { ToolbarNames } from "md-editor-v3";

import { type NavItemType } from "@/interfaces/oj";
import { SubmitInfoType } from "./interfaces/record";

export const problemListLabelOptions = [
  { label: "算法设计与分析", value: "算法设计与分析" },
  { label: "C 语言程序设计", value: "C 语言程序设计" },
];

export const submitStatusOptions = [
  'AC', 'WA', 'TLE', 'MLE', 'RE', 'PE', 'OLE', 'CE', 'REJUDGING', 'JUDGING', 'PENDING', 'DENIAL_JUDGE', 'JUDGE_TIMEOUT', 'FAILED'
];

export const submitStatusColor: Record<string, string> = {
  AC: "#19BE6B",
  WA: "#ED3F14",
  TLE: "#8A2BE2",
  MLE: "#A61E4D",
  RE: "#BDB76B",
  PE: "#5F9EA0",
  OLE: "#212121",
  CE: "#8C8C8C",
  REJUDGING: "#DD9933",
  JUDGING: "#DD9933",
  PENDING: "#EBCB8B",
  DENIAL_JUDGE: "#9E1030",
  JUDGE_TIMEOUT: "#BDBDBD",
  FAILED: "#4D1700",
};

export const submitInfo: SubmitInfoType = {
  'AC': { label: "Accepted", icon: Check },
  'WA': { label: "Wrong Answer", icon: Close },
  'TLE': { label: "Time Limit Exceeded", icon: Time },
  'MLE': { label: "Memory Limit Exceeded", icon: HardDisk },
  'PENDING': { label: "Pending", icon: LoadingOne },
  'JUDGING': { label: "Judging", icon: LoadingOne },
  'REJUDGING': { label: "Rejudging", icon: Caution },
  'RE': { label: "Runtime Error", icon: Caution },
  'PE': { label: "Presentation Error", icon: Caution },
  'OLE': { label: "Output Limit Exceeded", icon: Caution },
  'CE': { label: "Compile Error", icon: Caution },
  'JUDGE_TIMEOUT': { label: "Judge Timeout", icon: Caution },
  'DENIAL_JUDGE': { label: "Denial Judge", icon: Caution },
  'FAILED': { label: "Failed", icon: Caution },
};

export const verifyModeOptions = [
  { label: "账号密码", value: 0 },
  { label: "邮箱密码", value: 1 },
  { label: "邮箱验证", value: 2 },
];

export const problemOriginOptions = [
  { label: "Local", value: -1 },
  // { label: "Online Judge", value: 0 },
  { label: "Codeforces", value: 1 },
  { label: "Atcoder", value: 2 },
  // { label: "Virtual Judge", value: 3 },
];

export const problemTypeOptions = [
  { label: "全部", value: "", ptype: -100, prefix: "" }, // ptype 无用
  { label: "Local", value: "LOCAL", ptype: -1, prefix: "" },
  { label: "LOJ", value: "LOJ", ptype: -100, prefix: "" }, // ptype 无用
  { label: "Codeforces", value: "CODEFORCES", ptype: 1, prefix: "cf" },
  { label: "Atcoder", value: "ATCODERTYPE", ptype: 2, prefix: "at" },
];

export const problemContentOptions = [
  { label: "PlainText", value: -1 },
  { label: "MarkDown", value: 1 },
  { label: "PDF", value: 2 },
];

export const aboutNavItems = [
  { label: "提示信息", value: 0 },
  { label: "出题/比赛 规范", value: 1 },
  { label: "关于 OJ", value: 2 },
];

export const objectTypeOptions = [
  { label: "全部", value: "" },
  { label: "首页横幅", value: "notice_images_" },
];

export const editorLanguageOptions = [
  { label: "C", value: "c", compiler: "C17 (gcc 12.2.0)", language: 1 },
  { label: "C++", value: "cpp", compiler: "C++17 (g++ 12.2.0)", language: 4 },
  { label: "Java", value: "java", compiler: "Java17 (OpenJDK 17.0.10 64bit)", language: 5 },
  { label: "Python", value: "py", compiler: "Python3 (3.10.13)", language: 6 },
];

export const submitLanguageOptions = [
  { label: "C", value: "c", compiler: "C17 (gcc 12.2.0)", language: 1 },
  { label: "C++", value: "cpp", compiler: "C++17 (g++ 12.2.0)", language: 4 },
  { label: "Java", value: "java", compiler: "Java17 (OpenJDK 17.0.10 64bit)", language: 5 },
  { label: "Python", value: "python", compiler: "Python3 (3.10.13)", language: 6 },
];

export const navItems: Array<NavItemType> = [
  { title: "题库", icon: DocumentFolder, to: { name: "Problems" } },
  { title: "题单", icon: Bill, to: { name: "ProblemLists" } },
  { title: "比赛", icon: Trophy, to: { name: "Contests" } },
  { title: "训练", icon: Muscle, to: { name: "Training" } },
  // {
  //   title: "工具",
  //   icon: Toolkit,
  //   subItems: [
  //     { title: "近期比赛", icon: ListOne, to: { name: "RecentContests" } },
  //     { title: "排行榜", icon: RankingList, to: { name: "RankingList" } },
  //   ],
  // },
  { title: "记录", icon: History, to: { name: "Records" } },
];

export const contestNavItems: Array<NavItemType> = [
  { title: "比赛说明", icon: Info, to: { name: "ContestDescription" } },
  { title: "题目", icon: DocumentFolder, to: { name: "ContestProblems" } },
  { title: "排名", icon: RankingList, to: { name: "ContestRanking" } },
  { title: "记录", icon: History, to: { name: "ContestRecords" } },
  { title: "讨论", icon: Topic, to: { name: "ContestDiscussions" } },
];

export const problemListNavItems: Array<NavItemType> = [
  { title: "题单说明", icon: Info, to: { name: "ProblemListDescription" } },
  { title: "题目", icon: DocumentFolder, to: { name: "ProblemListProblems" } },
  { title: "排名", icon: RankingList, to: { name: "ProblemListRanking" } },
  { title: "记录", icon: History, to: { name: "ProblemListRecords" } },
  { title: "讨论", icon: Topic, to: { name: "ProblemListDiscussions" } },
];

export const adminNavItems: Array<NavItemType> = [
  { title: "题库", icon: DocumentFolder, to: { name: "AdminProblem" } },
  { title: "题单", icon: Bill, to: { name: "AdminProblemList" } },
  { title: "比赛", icon: Trophy, to: { name: "AdminContest" } },
  { title: "训练", icon: Muscle, to: { name: "AdminTraining" } },
  { title: "用户", icon: Peoples, to: { name: "AdminUser" } },
  { title: "杂项", icon: MoreTwo, to: { name: "AdminOther" } },
];

export const markdownToolbars: ToolbarNames[] = [
  "bold",
  "underline",
  "italic",
  "-",
  "title",
  "strikeThrough",
  "sub",
  "sup",
  "quote",
  "unorderedList",
  "orderedList",
  "task",
  "-",
  "codeRow",
  "code",
  "link",
  "image",
  "table",
  "mermaid",
  "katex",
  "-",
  "revoke",
  "next",
  "save",
  "=",
  "pageFullscreen",
  "fullscreen",
  "preview",
  "htmlPreview",
  "catalog",
  // "github",
];
