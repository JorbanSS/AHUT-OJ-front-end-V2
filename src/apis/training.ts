import { Get, Put, Post } from "@/utils/axios/request";

// 获取用户 Codeforces 统计数据
export const _getCodeforcesStatistics = (data: any, CodeforcesID: string) => {
  return Get(`codeforces/${CodeforcesID}`, data);
}

// 获取用户评分列表
export const _getRatingRank = (data: any) => {
  return Get('rating', data);
}

// 拉取用户评分
export const _scrapeRating = (data: any) => {
  return Put('rating', data);
}

// 获取近期所有比赛
export const _getRecentContests = (data: any) => {
  return Get('recentcontests', data);
}

// 拉取近期比赛
export const _scrapeRecentContests = (data: any) => {
  return Put('recentcontests', data);
}