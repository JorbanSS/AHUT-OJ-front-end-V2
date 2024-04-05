import Axios from "@/utils/axios/request";

export const _getBanners = (params: any) => {
  return Axios({
    url: "notice/images",
    method: "get",
    params,
  })
}

export const _getUpdateLogs = (params: any) => {
  return Axios({
    url: "notice/notices",
    method: "get",
    params,
  })
}

export const _editHomeNotice = (data: any) => {
  return Axios({
    url: "notice/0",
    method: "put",
    data,
  })
}

export const _getHomeNotice = (data: any) => {
  return Axios({
    url: "notice/0",
    method: "get",
    data,
  })
}

export const _getOjStastics = (data: any) => {
  return Axios({
    url: "notice/data",
    method: "get",
    data,
  })
}

