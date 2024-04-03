// 桶
export interface BucketType {
  name: string,            // 桶名
  creationData: string,    // 创建时间
  [item: string]: any,     // 其他属性
}

// 桶列表
export interface BucketsType {
  buckets: Array<BucketType>,    // 桶列表
  getBucket?: Function,          // 获取桶列表
  [item: string]: any,           // 其他属性
}

// 对象
export interface ObjectType {
  
}