// 桶
export interface BucketType {
  name: string,            // 桶名
  creationData: string,    // 创建时间
}

// 桶列表
export interface BucketsType {
  buckets: Array<BucketType>,    // 桶列表
}

// 对象
export interface ObjectType {
  
}