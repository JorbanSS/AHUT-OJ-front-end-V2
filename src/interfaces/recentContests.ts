export interface RecentContestType {
  CID: string,              // 比赛 ID
  Title: string,            // 比赛标题
  Type: string,             // 赛制
  StartTime: number,        // 开始时间
  Duration: number,         // 持续时间
  OJ: string,               // 平台
  URL: string,              // 比赛链接
  Label: string,            // 标签

  [item: string]: any;      // 其他属性
}

export interface RecentContestsType {
  RecentContests: Array<RecentContestType>;  // 最近的比赛列表
  Count: number;                             // 总的比赛数量

  [item: string]: any;                       // 其他属性
}