import { Get, Post } from "@/utils/axios/request";

// 获取题单列表
export const _getProblemLists = (params: any) => {
  return Get('training/list', params);
}

// 获取题单详情
export const _getProblemList = (params: any, LID: number) => {
  return Get(`training/${LID}`, params);
}

// 获取题单排名
export const _getProblemListRanking = (params: any, LID: number) => {
  return Get(`training/${LID}/rank`, params);
}

// 获取题单用户信息
export const _getProblemListUserInfo = (params: any) => {
  return Get('training/user', params);
}

// 克隆题单
export const _cloneProblemList = (data: any) => {
  return Post('training/clone/', data);
}

// 删除题单
export const _deleteProblemLists = (data: any) => {
  return Post('training/delete/', data);
}

// 新增题单
export const _addProblemList = (data: any) => {
  return Post('training/add/', data);
}

// 编辑题单
export const _editProblemList = (data: any) => {
  return Post('training/edit/', data);
}

// 加入题单
export const _joinProblemList = (data: any) => {
  return Post('training/user/', data);
}