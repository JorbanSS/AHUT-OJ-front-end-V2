import { Get, Put, Post } from "@/utils/axios/request";

// 获取用户评分列表
export const _getRatingRank = (data: any) => {
  return Get('rating', data);
}

// 拉取用户评分
export const _scrapeRating = (data: any) => {
  return Put('rating', data);
}