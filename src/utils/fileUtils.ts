import { push } from "notivue";
import { Post } from "@/utils/axios/request";

export class ImageUtils {

  public static compress(image: file) {
    if (image.type != "image/jpeg" && image.type != "image/png") {
      push.error({
        title: "上传错误",
        content: "请上传 JPG 或 PNG 格式的图片",
      });
      return false;
    }
    if (image.size / 1024 / 1024 > 20) {
      push.error({
        title: "上传错误",
        content: "图片大小不能超过 20MB",
      });
      return false;
    }
    return new Promise((resolve) => {
      if (image.size / 1024 > 400) { // 单位为 KB
        imagesConversion.compressAccurately(image, 300).then((res) => {
          resolve(res);
        });
      } else {
        imagesConversion.compress(image, 0.7).then((res) => {
          resolve(res);
        });
      }
    });
  }

  class upload {
    public static problem(image: Blob) {
      let file = new FormData();
      file.append("image", image);
      return new Promise((resolve, reject) => {
        Post("api/file/image/", file, 2)
          .then((res: any) => {
            resolve(res);
          })
          .catch((err: any) => {
            console.log(err);
          })
      })
    }

    public static user(image: Blob) {
      let file = new FormData();
      file.append("image", image);
      return new Promise((resolve, reject) => {
        Post("api/user/editHead/", file, 2).then((res) => {
          
        })
          .then((res: any) => {
            resolve(res);
          })
          .catch((err: any) => {
            console.log(err);
          })
      })
    }
  }

}
