import { Get, Post } from "@/utils/axios/request";

// 获取记录列表
export const _getRecords = (params: any) => {
  return Get('submit/status', params);
};

// 获取记录详情
export const _getRecord = (params: any, SID: number) => {
  return Get(`submit/${SID}`, params);
};

// 重判
export const _rejudge = (data: any) => {
  return Post('submit/rejudge/', data);
};
