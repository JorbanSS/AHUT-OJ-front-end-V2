import { Post, Get } from "@/utils/axios/request";

// 新增用户
export const _addUser = (data: any) => {
  return Post("admin/user", data);
}

// 绑定账户
export const _bindAccount = (data: any) => {
  return Post("admin/user/bind", data);
}