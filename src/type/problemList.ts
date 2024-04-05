export interface ProblemListSimplifiedType {
  LID: number,            // 题单唯一 LID, 服务器分配
  Ptitle: string,          // 标题
  UID: string,            // 创建人
  StartTime: number,      // 创建时间
  [item: string]: any,    // 其他属性
}

export interface ProblemListType {
  Description: string,    // 描述, 需要改成 Markdown 格式
  Problems: string,       // 题目列表
  [item: string]: any,    // 其他属性
}

export interface ProblemListsType {
  problemLists: Array<ProblemListSimplifiedType>, // 题单列表
  count: number,                                  // 总数
  page: number,                                   // 页码
  limit: number,                                  // 每页数量
  [item: string]: any,                            // 其他属性
}