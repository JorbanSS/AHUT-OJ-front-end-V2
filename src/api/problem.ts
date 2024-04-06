import Axios, { contentType } from "@/utils/axios/request";

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

export const _addProblem = (data: any) => {
  return Axios({
    url: `problem/add/`,
    method: "post",
    data,
  })
}

export const _editProblem = (data: any) => {
  return Axios({
    url: `problem/edit/`,
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

export const _getJudgeFiles = (params: any, PID: string) => {
  return Axios({
    url: `file/${PID}`,
    method: "get",
    params,
  })
}

export const _uploadJudgeFiles = (data: any, PID: string) => {
  return Axios({
    url: `file/${PID}`,
    method: "post",
    data,
    headers: {
      'Content-Type': contentType[2],
    },
  })
}

export const _deleteJudgeFiles = (data: any, PID: string) => {
  return Axios({
    url: `file/${PID}`,
    method: "delete",
    data,
    headers: {
      'Content-Type': contentType[2],
    },
  })
}