export interface DiscussionType {
  SID: number,              // 讨论 SID
  PID: string,              // 题目 PID
  UID: string,              // 用户 UID
  UserName: string,         // 用户名
  HeadURL: string,          // 用户头像 URL
  CreateTime: number,       // 创建时间
  UpdateTime: number,       // 更新时间
  Title: string,            // 标题
  Text: string,             // 内容
  IsFavorite: boolean,      // 是否收藏
  FavoriteCount: number,    // 收藏数

  [item: string]: any       // 其他字段
}

export interface DiscussionsType {
  PID: string,                          // 题目 PID
  discussions: Array<DiscussionType>,   // 讨论列表
  count: number,                        // 讨论总数
  [item: string]: any                   // 其他字段
}

export interface CommentType {
  CID: number,              // 评论 CID
  FCID: number,             // 父评论 FCID
  HeadURL: string,          // 用户头像 URL
  Text: string,             // 内容
  UID: string,              // 用户 UID
  UserName: string,         // 用户名
  UpdateTime: number,       // 更新时间
}