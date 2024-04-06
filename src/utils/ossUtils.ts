import { push } from "notivue";
import { type BucketType, type BucketsType } from "@/type/oss";

import { _uploadBannerImage, _getObject, _uploadObject } from "@/api/oss";

export class OssUtils {
  public static uploadProblemImage(file: File | Blob, fileName: string) {
    return new Promise((resolve) => {
      this.uploadObject(file, "problem-images", fileName)
      .then((data: any) => {
        console.log(12, data.UpInfo.Key);
        this.getUrl("problem-images", data.UpInfo.Key).then((data: any) => {
          console.log(222, data);
          // resolve(data);

        });
      });
    });
  }

  public static uploadBannerImage(image: Blob, name: string) {
    let formData = new FormData();
    formData.append("file", image, name);
    return new Promise((resolve) => {
      _uploadBannerImage(formData)
        .then((data: any) => {
          push.success({
            title: "上传成功",
            message: `图片压缩后为 ${Math.round(image.size / 1024)} KB`,
          });
          resolve(data);
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  public static uploadObject(
    file: File | Blob,
    bucketName: string,
    objectName: string
  ) {
    let formData = new FormData();
    formData.append("File", file as Blob);
    formData.append("BucketName", bucketName);
    formData.append("ObjectName", objectName);
    return new Promise((resolve) => {
      _uploadObject(formData)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  public static getObject(
    bucketName: string,
    objectName: string,
    getObjectType: number
  ) {
    return new Promise((resolve) => {
      let params = {
        BucketName: bucketName,
        ObjectName: objectName,
        GetObjectType: getObjectType,
        ExpireTime: 100 * 365 * 24, // 永久
      };
      _getObject(params)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  public static getUrl(bucketName: string, objectName: string) {
    return this.getObject(bucketName, objectName, 0); // 链接
  }

  public static getBase64(bucketName: string, objectName: string) {
    return this.getObject(bucketName, objectName, 1); // 图片 Base64
  }

  public static getFile(bucketName: string, objectName: string) {
    return this.getObject(bucketName, objectName, 2); // 文件下载
  }
}
