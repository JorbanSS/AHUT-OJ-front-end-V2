import Axios from "@/utils/axios/request";

export const _getProblemLists = (params: any) => {
  return Axios({
    url: "training/list",
    method: "get",
    params,
  })
}

export const _getProblemList = (params: any, LID: number) => {
  return Axios({
    url: `training/${LID}`,
    method: "get",
    params,
  })
}

export const _getProblemListRanking = (params: any, LID: number) => {
  return Axios({
    url: `training/${LID}/rank`,
    method: "get",
    params,
  })
}

export const _getProblemListUsersInfo = (params: any) => {
  return Axios({
    url: `training/user`,
    method: "get",
    params,
  })
}