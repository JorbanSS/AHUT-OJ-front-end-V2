import { push } from "notivue";

import { _getObject, _uploadBannerImage, _uploadObject } from "@/api/oss";
import { FileUtils } from "./fileUtils";

export class OssUtils {
  public static uploadProblemImage(file: File) {
    return new Promise((resolve) => {
      let fileMD5 = "";
      FileUtils.getFileMD5(file as File).then((data: any) => {
        fileMD5 = data;
        let objectName = `${fileMD5}.${
          file.type.split("/")[file.type.split("/").length - 1]
        }`;
        this.uploadObject(file, "problem-images", objectName).then(
          (data: any) => {
            resolve(data.UpInfo.Key);
          }
        );
      });
    });
  }

  public static uploadHeadImage(file: File, UID: string) {
    return new Promise((resolve) => {
      let fileMD5 = "";
      FileUtils.getFileMD5(file as File).then((data: any) => {
        fileMD5 = data;
        let objectName = `${UID}-${fileMD5}.${
          file.type.split("/")[file.type.split("/").length - 1]
        }`;
        this.uploadObject(file, "head-images", objectName).then(
          (data: any) => {
            push.success({
              title: "上传成功",
              message: `图片压缩后为 ${Math.round(file.size / 1024)} KB`,
            });
            resolve(data.UpInfo.Key);
          }
        );
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
    if (objectName != "") formData.append("ObjectName", objectName);
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
