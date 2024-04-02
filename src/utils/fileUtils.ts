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

  public static uploadProblemImage(image: Blob) {
    let file = new FormData();
    file.append("image", image);
    console.log(image);
    return new Promise((resolve) => {
      Post("api/file/image/", image)
        .then((res: any) => {
          // resolve(res);
          let data = res.data;
          if (data.Code == 0) {
            push.success({
              title: "上传成功",
              message: `${data.Msg}`,
            });
          } else {
            push.error({
              title: `Error: ${data.Code}`,
              message: `${data.Msg}`,
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  public static uploadUserImage(image: Blob) {
    let file = new FormData();
    file.append("image", image);
    return new Promise((resolve) => {
      Post("api/user/editHead/", file)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  public static uploadBannerImage(image: Blob) {
    let fromData = new FormData();
    fromData.append("file", image);
    console.log(image);
    console.log(fromData);

    return new Promise((resolve, reject) => {
      Post("api/notice/images/", fromData, 1)
        .then((res: any) => {
          // resolve(res);
          let data = res.data;
          if (data.Code == 0) {
            push.success({
              title: "上传成功",
              message: `${data.Msg}`,
            });
          } else {
            push.error({
              title: `Error: ${data.Code}`,
              message: `${data.Msg}`,
            });
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
