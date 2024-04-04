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
