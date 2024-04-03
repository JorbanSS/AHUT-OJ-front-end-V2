export interface ContestSimplifiedType {
  CID: number,            // 比赛唯一 CID, 服务器分配
  Title: string,          // 标题
  BeginTime: number,      // 开始时间
  EndTime: number,        // 结束时间
  IsPublic: number,       // 是否为私有比赛
  Type: number,           // 类型, 0: oi, 1: icpc, 2: codeforces
  UID: string,            // 馔题人
  [item: string]: any,    // 其他属性
}

export interface ContestType extends ContestSimplifiedType {
  duration: number,       // 时长
  description: string,    // 描述, 需要改成 Markdown 格式
  problems: string,       // 题目列表
  Pass: string,           // 密码
  [item: string]: any,    // 其他属性
}

export interface ContestsType {
  contests: Array<ContestSimplifiedType>, // 比赛列表
  count: number,                          // 总数
  page: number,                           // 页码
  limit: number,                          // 每页数量
  [item: string]: any,                    // 其他属性
}

// XCPC - 比赛排行榜 - 题目
export interface ContestRankingProblemType {
  PID: string,                 // 题目 PID
  Status: string,              // 状态
  SubmitNumber: number,        // 提交数量
  Time: number,                // 提交时间
  [item: string]: any,         // 其他属性
}


// XCPC - 比赛排行榜 - 用户
export interface ContestRankingUserType {
  UserID: string,                              // 用户 UID
  Uname: string,                               // 用户名
  ACNumber: number,                            // AC 数量
  AllSubmit: number,                           // 提交数量
  PenaltySubmit: number,                       // 罚时提交数量
  Problems: Array<ContestRankingProblemType>,  // 题目列表
  [item: string]: any,                         // 其他属性
}
// 计算公式:AC Time+PenaltySubmit*20*min

// XCPC - 比赛排行榜
export interface ContestRankingType {
  count: number,                           // 比赛大小
  ranking: Array<ContestRankingUserType>,  // 排行榜
  [item: string]: any,                     // 其他属性
}

// IOI - 比赛排行榜 - 题目
export interface IOIContestRankingProblemType {
  PID: string,                 // 题目 PID
  Submited: boolean,          // 是否提交
  Time: number,                // 提交时间
  PassSample: number,           // 通过数据数量
  SampleNumber: number,         // 判题数据数量
  [item: string]: any,         // 其他属性
}

// IOI - 比赛排行榜 - 用户
export interface IOIContestRankingUserType {
  UserID: string,                              // 用户 UID
  Uname: string,                               // 用户名
  ACNumber: number,                            // AC 数量
  Problems: Array<IOIContestRankingProblemType>,  // 题目列表
  [item: string]: any,                         // 其他属性
}

// IOI - 比赛排行榜
export interface IOIContestRankingType {
  count: number,                           // 比赛大小
  ranking: Array<IOIContestRankingUserType>,  // 排行榜
  [item: string]: any,                     // 其他属性
}