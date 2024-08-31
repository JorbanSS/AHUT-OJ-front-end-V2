import { Get, Put, Post } from "@/utils/axios/request";

// 获取近期所有比赛
export const _getRecentContests = (data: any) => {
  return Get('recentcontests', data);
}

// 拉取近期比赛
export const _scrapeRecentContests = (data: any) => {
  return Put('recentcontests', data);
}