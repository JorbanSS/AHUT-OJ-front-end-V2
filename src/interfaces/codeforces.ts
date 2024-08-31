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