import { Get, Put, Post } from "@/utils/axios/request";

// 获取用户 Codeforces 统计数据
export const _getCodeforcesStatistics = (data: any, CodeforcesID: string) => {
  return Get(`codeforces/${CodeforcesID}`, data);
}