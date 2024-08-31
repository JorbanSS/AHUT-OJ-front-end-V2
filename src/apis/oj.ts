import { Get, Post, Put, Del } from "@/utils/axios/request";

// 获取首页横幅
export const _getBanners = (params: any) => {
  return Get('notice/images', params);
}

// 获取更新日志
export const _getUpdateLogs = (params: any) => {
  return Get('notice/notices', params);
}

// 编辑首页公告
export const _editHomeNotice = (data: any) => {
  return Put('notice/0', data);
}

// 获取首页公告
export const _getHomeNotice = (params: any) => {
  return Get('notice/0', params);
}

// 获取 OJ 数据
export const _getOjStastics = (params: any) => {
  return Get('notice/data', params);
}

// 获取更新日志列表
export const _getNoticeList = (params: any) => {
  return Get('notice/notices', params);
}

// 新增更新日志
export const _addUpdateLog = (data: any) => {
  return Post('notice/', data);
}

// 删除更新日志
export const _deleteUpdateLog = (data: any, id: number) => {
  return Del(`notice/${id}`, data);
}