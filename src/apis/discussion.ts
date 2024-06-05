import { Get, Post } from "@/utils/axios/request";

// 获取讨论列表
export const _getDiscussions = (params: any) => {
  return Get("solution/solutions", params);
}

// 点赞
export const _giveThumbsUp = (params: any) => {
  return Post('favorite/', params);
}

// 评论
export const _addComment = (params: any) => {
  params.ActionType = 1;
  return Post('comment/', params);
}

// 删除评论
export const _deleteComment = (params: any) => {
  params.ActionType = 3;
  return Post('comment/', params);
}

// 发表话题
export const _addDiscussion = (params: any) => {
  params.ActionType = 1;
  return Post('solution/', params);
}

// 编辑话题
export const _editDiscussion = (params: any) => {
  params.ActionType = 2;
  return Post('solution/', params);
}

// 删除话题
export const _deleteDiscussion = (params: any) => {
  params.ActionType = 3;
  return Post('solution/', params);
}
