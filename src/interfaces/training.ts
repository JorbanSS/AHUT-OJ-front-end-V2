import { MapNumberNumber, MapStringNumber } from "./common";

export interface CodeforcesSubmissionType {
  submissionCount: number,
  tried: number,
  solved: number,
  unsolved: string,
  averageAttempts: number,
  firstAttemptPassedCount: number,
  [item: string]: any,
}

export interface CodeforcesContestType {
  maxUp: number,
  maxDown: number,
  bestRank: number,
  worstRank: number,
  contestCount: number,
  virtualParticipationCount: number,
  [item: string]: any,
}

export interface CodeforcesRatingInfoType {
  contestID: string,
  contestName: number,
  rating: number,
  [item: string]: any,
}

export interface CodeforcesRatingType {
  [item: number]: CodeforcesRatingInfoType,
}

export interface CodeforcesStatisticsType {
  CodeforcesID: string,
  problemRating: MapNumberNumber,
  language: MapStringNumber,
  tags: MapStringNumber,
  verdict: MapStringNumber,
  problemIndex: MapStringNumber,
  teamMates: string,
  submission: CodeforcesSubmissionType,
  contest: CodeforcesContestType,
  rating: CodeforcesRatingType,
  nowRating: number,
  maxRating: number,
  [item: string]: any,
}

export interface RatingType {
  UID: string,                        // 用户 UID
  UserName: string,                   // 用户名
  Rating: number,                     // 总评分
  CodeforcesID: string,               // Codeforces ID
  CodeforcesRating: number,           // Codeforces 评分
  CodeforcesMaxRating: number,        // Codeforces 最高评分
  NowcoderID: string,                 // Nowcoder ID
  NowcoderRating: number,             // Nowcoder 评分
  NowcoderMaxRating: number,          // Nowcoder 最高评分
  AtcoderID: string,                  // Atcoder ID
  AtcoderRating: number,              // Atcoder 评分
  AtcoderMaxRating: number,           // Atcoder 最高评分

  [item: string]: any,
}

export interface RatingRankType {
  RatingRank: Array<RatingType>,        // 评分排名列表
  Count: number,                        // 评分排名列表总数
  Calculation: {
    Codeforces: number,                 // Codeforces 评分
    Nowcoder: number,                   // Nowcoder 评分
    Atcoder: number,                    // Atcoder 评分
  }

  [item: string]: any,
}

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