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

export const _editProblem = (data: any, PID: string) => {
  return Axios({
    url: `problem/edit/${PID}`,
    method: "post",
    data,
  })
}

export const _deleteProblems = (data: any) => {
  return Axios({
    url: `problem/delete/`,
    method: "post",
    data,
  })
}

export const _submitCode = (data: any) => {
  return Axios({
    url: `submit/commit/`,
    method: "post",
    data,
  })
}

export const _exportProblems = (params: any) => {
  return Axios({
    url: `file/json/download`,
    method: "get",
    params,
  })
}