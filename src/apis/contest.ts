import { Get, Post } from "@/utils/axios/request";

// 获取比赛列表
export const _getContests = (params: any) => {
  return Get("contest/list", params);
}

// 获取比赛详情
export const _getContest = (params: any, CID: number) => {
  return Get(`contest/${CID}`, params);
}

// 删除比赛
export const _deleteContests = (data: any) => {
  return Post('contest/delete/', data);
}

// 新增比赛
export const _addContest = (data: any) => {
  return Post('contest/add/', data);
}

// 编辑比赛
export const _editContest = (data: any) => {
  return Post('contest/edit/', data);
}

// 获取比赛排名
export const _getContestRanking = (params: any, CID: number) => {
  return Get(`contest/${CID}/rank`, params);
}

// 克隆比赛为题单
export const _cloneToProblemList = (data: any) => {
  return Post('contest/clone/', data);
}

// 编辑气球颜色
export const _editBalloonColor = (data: any) => {
  return Post('contest/color/', data);
}