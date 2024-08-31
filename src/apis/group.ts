import { Get, Post, Del } from "@/utils/axios/request";

// 新增小组
export const _AddGroup = (params: any) => {
  return Post('/group/add', params);
}
