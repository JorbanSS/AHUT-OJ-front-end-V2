import { push } from "notivue";
import { Get, Post } from "@/utils/axios/request";
import { type BucketType, type BucketsType } from "@/type/oss";

export class OssUtils {
  // 删除对象
  // public static deleteObject(bucketName: string, objectName: string) {

  // }

  // 获取桶列表
  public static getBucketList() {
    return new Promise((resolve, reject) => {
      Get("api/oss/bucket", {})
        .then((res: any) => {
          let data = res.data;
          console.log(data);
          
          if (data.Code == 0) {
            push.success({
              title: "获取成功",
              message: ``,
            });
            resolve(data);
          } else {
            push.error({
              title: `Error: ${data.Code}`,
              message: `${data.Msg}`,
            });
            reject(data);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }
}
