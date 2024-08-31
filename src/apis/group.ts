import { Get, Post, Del } from "@/utils/axios/request";

// 新增小组
export const _AddGroup = (data: any) => {
  console.log(data);
  return Post("user/group/add/", data);
};

// 删除小组
export const _DelGroup = (data: any) => {
  return Del("user/group/delete", data);
};

// 编辑组

// 获取组列表
export const _GetGroupList = (data: any) => {
  return Post("user/group/list/", data);
};

// 获取小组
export const _GetGroup = (params: any, id: number) => {
  return Get(`user/group/${id}`, params);
};

// 添加成员到小组
export const _AddUserToGroup = (data: any) => {
  return Post("user/group/user/add", data);
};

// 从小组中删除某成员
export const _DelUserFromGroup = (data: any) => {
  return Del("user/group/user/delete", data);
};

// 加入小组
export const _JoinGroup = (data: any) => {
  return Post("user/group/join/", data);
};

// 退出小组
export const _QuitGroup = (data: any) => {
  return Post("user/group/quit", data);
};
