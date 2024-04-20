import { Get, Post } from "@/utils/axios/request";

// 获取服务器时间
export const _getServerTime = (data: any) => {
  return Get('now', data);
}