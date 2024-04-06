import { Get, Post, Del } from "@/utils/axios/request";

// 获取题目列表
export const _getProblems = (params: any) => {
  return Get('problem/list', params);
}

// 获取题目详情
export const _getProblem = (params: any, PID: string) => {
  return Get(`problem/${PID}`, params);
}

// 新增题目
export const _addProblem = (data: any) => {
  return Post('problem/add/', data);
}

// 编辑题目
export const _editProblem = (data: any) => {
  return Post('problem/edit/', data);
}

// 删除题目集
export const _deleteProblems = (data: any) => {
  return Post('problem/delete/', data);
}

// 提交代码
export const _submitCode = (data: any) => {
  return Post('submit/commit/', data);
}

// 导出题目集
export const _exportProblems = (params: any) => {
  return Get('file/json/download', params);
}

// 获取判题文件列表
export const _getJudgeFiles = (params: any, PID: string) => {
  return Get(`file/${PID}`, params);
}

// 上传判题文件
export const _uploadJudgeFiles = (data: any, PID: string) => {
  return Post(`file/${PID}`, data, 2);
}

// 删除判题文件
export const _deleteJudgeFiles = (data: any, PID: string) => {
  return Del(`file/${PID}`, data, 2);
}