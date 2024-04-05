import Axios from "@/utils/axios/request";

export const _getRecords = (params: any) => {
  return Axios({
    url: "submit/status",
    method: "get",
    params,
  });
};

export const _getRecord = (params: any, SID: number) => {
  return Axios({
    url: `submit/${SID}`,
    method: "get",
    params,
  });
};

export const _rejudge = (data: any) => {
  return Axios({
    url: `submit/rejudge/`,
    method: "post",
    data,
  });
};

