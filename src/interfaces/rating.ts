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