import { Get, Post, Put, Del } from "@/utils/axios/request";

// 开放关闭模型的使用
export const _switchModelAccess = (params: any) => {
  return Put('tool/chat/', params);
}

// 获取模型列表
export const _getModelList = (params: any) => {
  return Get('tool/chat', params);
}

// 发送消息
export const _messageToModel = (params: any) => {
  return Post('tool/chat/', params, 0, 30000);
}