export interface RecordType {
  SID: number,                  // 记录唯一 SID, 服务器分配
  PID: string,                  // 题目 PID
  UID: string,                  // 用户 UID
  Lang: number,                 // 语言
  Result: string,               // 结果
  UseMemory: number,            // 内存
  UseTime: number,              // 时间
  SubmitTime: number,           // 提交时间
  Source: string,               // 源代码
  CeInfo: string,               // CE 报错信息
  SampleNumber: number,         // 样例数量
  PassSample: number,           // 通过样例数量
  [item: string]: any,          // 其他属性
}

export interface RecordsType {
  records: Array<RecordType>, // 记录列表
  count: number,              // 总数
  page: number,               // 页码
  limit: number,              // 每页数量
  [item: string]: any,        // 其他属性
}

export interface SubmitCodeType {
  Lang: number,         // 语言
  Source: string,       // 源代码
  [item: string]: any,  // 其他属性
}

export interface RejudgeInfoType {
  SID?: number,           // 记录 SID
  PID?: string,           // 题目 PID
  UID?: string,           // 用户 UID
  CID?: number,           // 比赛 CID
  [item: string]: any,    // 其他属性
}