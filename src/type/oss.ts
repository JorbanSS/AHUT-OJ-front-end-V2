// 桶
export interface BucketType {
  name: string,            // 桶名
  creationDate: string,    // 创建时间
  [item: string]: any,     // 其他属性
}

// 桶列表
export interface BucketsType {
  buckets: Array<BucketType>,    // 桶列表
  [item: string]: any,           // 其他属性
}

// 对象
export interface ObjectType {
  name: string,                 // 对象名
  size: number,                 // 对象大小
  lastModified: string,         // 最后修改时间
  [item: string]: any,          // 其他属性
}

// 对象列表
export interface ObjectsType {
  objects: Array<ObjectType>,   // 对象列表
  [item: string]: any,          // 其他属性
}