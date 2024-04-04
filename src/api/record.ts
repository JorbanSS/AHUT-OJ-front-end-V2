import Axios from "@/utils/axios/request";

export const _getRecords = (params: any) => {
  return Axios({
    url: "submit/status",
    method: "get",
    params,
  })
}
