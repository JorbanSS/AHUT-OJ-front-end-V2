import { push } from "notivue";
import { Post } from "@/utils/axios/request";
import * as imageConversion from "image-conversion";

export class ImageUtils {
  public static check(image: File): boolean {
    if (image.type != "image/jpeg" && image.type != "image/png") {
      push.error({
        title: "上传错误",
        message: "请上传 JPG 或 PNG 格式的图片",
      });
      return false;
    }
    if (image.size / 1024 / 1024 > 20) {
      push.error({
        title: "上传错误",
        message: "图片大小不能超过 20MB",
      });
      return false;
    }
    return true;
  }

  public static compress(image: File): Promise<Blob> {
    return new Promise((resolve) => {
      if (image.size / 1024 > 400) {
        // 单位为 KB
        imageConversion.compressAccurately(image, 300).then((res: any) => {
          resolve(res);
        });
      } else {
        imageConversion.compress(image, 0.7).then((res: any) => {
          resolve(res);
        });
      }
    });
  }

  public static uploadProblemImage(image: Blob, name: string) {
    let fromData = new FormData();
    fromData.append("file", image, name);
    return new Promise((resolve, reject) => {
      Post("file/image/", fromData, 1)
        .then((res: any) => {
          let data = res.data;
          if (data.Code == 0) {
            push.success({
              title: "上传成功",
              message: `图片压缩后为 ${Math.round(image.size / 1024)} KB`,
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

  public static uploadUserImage(image: Blob, name: string) {
    let file = new FormData();
    file.append("image", image, name);
    return new Promise((resolve, reject) => {
      Post("user/editHead/", file, 1)
        .then((res: any) => {
          let data = res.data;
          if (data.Code == 0) {
            push.success({
              title: "上传成功",
              message: `图片压缩后为 ${Math.round(image.size / 1024)} KB`,
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

  public static uploadBannerImage(image: Blob, name: string) {
    let fromData = new FormData();
    fromData.append("file", image, name);
    return new Promise((resolve, reject) => {
      Post("notice/images/", fromData, 1)
        .then((res: any) => {
          let data = res.data;
          if (data.Code == 0) {
            push.success({
              title: "上传成功",
              message: `图片压缩后为 ${Math.round(image.size / 1024)} KB`,
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

export class FileConvertUtils {
  public static file2Blob(file: File): string {
    let blob = "";
    if (window.URL != undefined) {
      blob = window.URL.createObjectURL(file);
    } else {
      blob = window.webkitURL.createObjectURL(file);
    }
    return blob;
  }
}


export class FileUtils {
  public static uploadProblemData(file: File | Blob, PID: string) {
    let formData = new FormData();
    formData.append("file", file as Blob);
    return new Promise((resolve, reject) => {
      Post('file/' + PID, formData, 1)
      .then((res: any) => {
        let data = res.data;
        if (data.Code == 0) {
          push.success({
            title: "上传成功",
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
    })
  }
}