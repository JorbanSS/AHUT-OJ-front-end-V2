import { Get, Post } from "@/utils/axios/request";

// 获取桶列表
export const _getBuckets = (params: any) => {
  return Get("oss/bucket", params);
};

// 新增桶
export const _addBuckets = (data: any) => {
  return Post("oss/bucket/add/", data);
};

// 获取对象列表
export const _getObjects = (params: any, bucket: string) => {
  return Get(`oss/object/${bucket}`, params);
};

// 删除对象
export const _deleteObject = (data: any) => {
  return Post("oss/object/delete/", data);
};

// 删除桶
export const _deleteBucket = (data: any) => {
  return Post("oss/bucket/delete/", data);
};

// 上传对象
export const _uploadObject = (data: any) => {
  return Post("oss/object/put/", data, 2);
};

// 上传首页横幅
export const _uploadBannerImage = (data: any) => {
  return Post("notice/images/", data, 2);
};

// 获取对象
export const _getObject = (data: any) => {
  return Post("oss/object/get/", data);
};