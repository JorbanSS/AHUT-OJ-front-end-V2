import * as imageConversion from "image-conversion";
import { push } from "notivue";
import SparkMD5 from "spark-md5";
import XLSX from "xlsx-js-style";
import { Post } from "@/utils/axios/request";
import { ConvertTools } from "@/utils/globalFunctions";

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
      if (image.size / 1024 > 140) {
        // 单位为 KB
        imageConversion.compressAccurately(image, 100).then((res: any) => {
          resolve(res);
        });
      } else {
        imageConversion.compress(image, 0.6).then((res: any) => {
          resolve(res);
        });
      }
    });
  }

  public static uploadProblemImage(image: Blob, name: string) {
    let formData = new FormData();
    formData.append("file", image, name);
    return new Promise((resolve, reject) => {
      Post("file/image/", formData, 1)
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
}

export class FileUtils {
  public static file2Blob(file: File): string {
    let blob = "";
    if (window.URL != undefined) {
      blob = window.URL.createObjectURL(file);
    } else {
      blob = window.webkitURL.createObjectURL(file);
    }
    return blob;
  }

  public static getFileMD5(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent<FileReader>): void => {
        spark.append(e.target?.result as ArrayBuffer);
        resolve(spark.end());
      };
      fileReader.onerror = () => {
        reject("");
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  //导入excel
  public static importExcel(
    event: Event,
    importConfig: { [key: string]: string }
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // 获取上传的文件对象
      const file = (event.target as HTMLInputElement).files[0];
      if (!file) {
        reject("未选择文件");
        return;
      }

      // 通过FileReader对象读取文件
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const { result } = event.target as FileReader;
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: "binary" });
          // 存储获取到的数据
          let data = [];
          // 遍历每张工作表进行读取（这里默认只读取第一张表）
          for (const sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data = data.concat(
                XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
              );
              // break; // 如果只取第一张表，就取消注释这行
            }
          }
          const uploadData = data.map((item) => {
            const importItem = {};
            for (const key in importConfig) {
              if (item.hasOwnProperty(key)) {
                importItem[importConfig[key]] = item[key];
              }
            }
            return importItem;
          });

          // 返回格式化后的数据
          // console.log("uploadData", uploadData);
          resolve(uploadData);
        } catch (e) {
          // 这里可以抛出文件类型错误不正确的相关提示
          console.error("文件信息不正确", e);
          reject("文件信息不正确");
        }
      };
      fileReader.onerror = () => {
        reject("文件读取失败");
      };
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(file);
    });
  }

  public static exportExcel(
    exportConfig: {
      filename: string;
      sheetname: string;
    },
    exportData: any[],
    exportStyle: (worksheet: XLSX.WorkSheet) => any =  () => {}
  ) {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const colWidths = exportData.reduce((widths, row) => {
      Object.keys(row).forEach((key, colIdx) => {
        const cellValue = row[key] ? row[key].toString() : "";
        widths[colIdx] = Math.max(widths[colIdx] || 10, cellValue.length);
      });
      return widths;
    }, []);
    worksheet["!cols"] = colWidths.map((width) => ({ wch: width * 1.5 }));
    //调整成合适宽度
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; C++) {
      for (let R = range.s.r; R <= range.e.r; R++) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
        // console.error(`cellAddress:${cellAddress}`)
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { name: "仿宋", sz: 14 },
          fill: { fgColor: { rgb: "FFFFFF" } }, // 设置为白色背景
          border: { top: { style: "thin", color: { rgb: "000000" } } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }
    //默认字体，填充，边界，对齐
    exportStyle(worksheet).then(() => {
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, exportConfig.sheetname);
      XLSX.writeFile(workbook, exportConfig.filename);
    });
  }
}
