import Axios from "@/utils/axios/request";

export const _getContests = (params: any) => {
  return Axios({
    url: "contest/list",
    method: "get",
    params,
  })
}

export const _getContest = (params: any, CID: number) => {
  return Axios({
    url: `contest/${CID}`,
    method: "get",
    params,
  })
}

export const _deleteContests = (data: any) => {
  return Axios({
    url: `contest/delete/`,
    method: "post",
    data,
  })
}

export const _getContestRanking = (params: any, CID: number) => {
  return Axios({
    url: `contest/${CID}/rank`,
    method: "get",
    params,
  })
}

export const _cloneToProblemList = (data: any) => {
  return Axios({
    url: `contest/clone/`,
    method: "post",
    data,
  })
}