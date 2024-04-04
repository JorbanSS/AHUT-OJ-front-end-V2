import Axios from "@/utils/axios/request";

export const _getProblems = (params: any) => {
  return Axios({
    url: "problem/list",
    method: "get",
    params,
  })
}

export const _getProblem = (params: any, PID: string) => {
  return Axios({
    url: `problem/${PID}`,
    method: "get",
    params,
  })
}

export const _submitCode = (data: any) => {
  return Axios({
    url: `submit/commit/`,
    method: "post",
    data,
  })
}