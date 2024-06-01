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
export const _sendComment = (params: any) => {
  return Post('comment/', params);
}
