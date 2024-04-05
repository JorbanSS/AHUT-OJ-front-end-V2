import Axios from "@/utils/axios/request";

export const _getBuckets = (params: any) => {
  return Axios({
    url: "oss/bucket",
    method: "get",
    params,
  })
}

export const _addBuckets = (data: any) => {
  return Axios({
    url: "oss/bucket/add/",
    method: "post",
    data,
  })
}

export const _getObjects = (params: any, bucket: string) => {
  return Axios({
    url: `oss/object/${bucket}`,
    method: "get",
    params,
  })
}

export const _deleteObject = (data: any) => {
  return Axios({
    url: `oss/`,
    method: "post",
    data,
  })
}

export const _deleteBucket = (data: any) => {
  return Axios({
    url: `oss/bucket/delete/`,
    method: "post",
    data,
  })
}
