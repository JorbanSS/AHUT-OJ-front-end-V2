export interface TimeType {
  year: number,         // 年
  month: number,        // 月
  day: number,          // 日
  hour: number,         // 时
  minute: number,       // 分
  second: number,       // 秒
  [item: string]: any,  // 其他属性
}

export interface ImageUploadType {
  image: File | null,           // 图片
  blob: Blob | null,            // 图片 Blob
  [item: string]: any,          // 其他属性
}

export interface FileUploadType {
  file: File | null,           // 图片
  [item: string]: any,          // 其他属性
}

// export interface FileUploadType {
//   name: string,         // 文件名
//   type: string,         // 文件类型
//   size: number,         // 文件大小
//   [item: string]: any,  // 其他属性
// }

// export interface FilesUploadType {
//   files: FileUploadType[],  // 文件列表
//   count: number,            // 文件数量
//   [item: string]: any,      // 其他属性
// }