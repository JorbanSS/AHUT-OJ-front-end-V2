import {
  Peoples,
  Ranking,
  Trophy,
  ZoomIn
} from "@icon-park/vue-next";

import { type NavItemType } from "@/interfaces/oj";

export const chartDefaultConfig = {
  toolbar: {
    show: true,
    offsetX: 0,
    offsetY: 0,
    tools: {
      download: false,
      selection: true,
      zoom: true,
      zoomin: false,
      zoomout: false,
      pan: false,
      reset: true,
      customIcons: [
      ]
    }
  }
};

export const navItems: Array<NavItemType> = [
  { title: "近期比赛", icon: Trophy, to: { name: "RecentContests" } },
  { title: "评分排行榜", icon: Ranking, to: { name: "RatingRank" } },
  { title: "用户管理", icon: Peoples, to: { name: "UserManage" } },
];

export const recentContestsOriginOptions = [
  { label: "全部平台", value: "All" },
  { label: "Codeforces", value: "Codeforces" },
  { label: "Nowcoder", value: "Nowcoder" },
  { label: "Atcoder", value: "Atcoder" },
  { label: "Luogu", value: "Luogu" },
];

export const ratingRankOriginOptions = [
  { label: "全部平台", value: "All" },
  { label: "Codeforces", value: "Codeforces" },
  { label: "Nowcoder", value: "Nowcoder" },
  { label: "Atcoder", value: "Atcoder" },
  // { label: "Luogu", value: "Luogu" },
];

export const recentContestLabelOptions = [
  { label: "AtCoder Beginner Contest", value: "ABC" },
  { label: "AtCoder Regular Contest", value: "ARC" },
  { label: "(Div. 1)", value: "Div 1" },
  { label: "(Div. 2)", value: "Div 2" },
  { label: "(Div. 1 + Div. 2)", value: "Div 1/2" },
  { label: "(Div. 3)", value: "Div 3" },
  { label: "(Div. 4)", value: "Div 4" },
  { label: "Educational Codeforces Round", value: "EDU" },
  { label: "(Rated for Div. 2)", value: "Div 2" },
  { label: "牛客周赛", value: "牛客周赛" },
  { label: "牛客小白月赛", value: "小白月赛" },
  { label: "牛客练习赛", value: "牛客练习赛" },
  { label: "洛谷基础赛", value: "洛谷基础赛" },
  { label: "月月赛", value: "洛谷月赛" },
];

export const ratingToColorMap = new Map<number, string>([
  [800, '#808080'],
  [900, '#808080'],
  [1000, '#808080'],
  [1100, '#808080'],
  [1200, '#008000'],
  [1300, '#008000'],
  [1400, '#03a89e'],
  [1500, '#03a89e'],
  [1600, '#0000ff'],
  [1700, '#0000ff'],
  [1800, '#0000ff'],
  [1900, '#aa00aa'],
  [2000, '#aa00aa'],
  [2100, '#ff8c00'],
  [2200, '#ff8c00'],
  [2300, '#ff8c00'],
  [2400, '#ff0000'],
  [2500, '#ff0000'],
  [2600, '#ff0000'],
  [2700, '#ff0000'],
  [2800, '#ff0000'],
  [2900, '#ff0000'],
  [3000, '#ff0000'],
  [3100, '#ff0000'],
  [3200, '#ff0000'],
  [3300, '#ff0000'],
  [3400, '#ff0000'],
  [3500, '#ff0000']
]);