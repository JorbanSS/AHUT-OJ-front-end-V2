export interface ProblemSimplifiedType {
  PID: string,          // 题目唯一 PID, 服务器分配
  Title: string,        // 标题
  Label: string,        // 标签
  Visible: number,      // 状态
  Submit: number,       // 提交数
  Accepted: number,     // AC 数
  [item: string]: any,  // 其他属性
}

export interface ProblemType extends ProblemSimplifiedType {
  description: string,    // 描述, 需要改成 Markdown 格式
  Origin: number,         // 来源
  OriginPID: string,      // 原始题目 PID
  limitMemory: number,    // 限制内存
  limitTime: number,      // 限制时间
  SolutionNumber: number, // 题解数量
  ContentType: number,    // 题面类型
  Input: string,          // 输入格式
  Output: string,         // 输出格式
  SampleInput: string,    // 样例输入
  SampleOutput: string,   // 样例输出
  Hit: string,            // 提示
  [item: string]: any,    // 其他属性
}

export interface ProblemsType {
  problems: Array<ProblemSimplifiedType>,   // 题目列表
  count: number,                  // 总数
  page: number,                   // 页码
  limit: number,                  // 每页数量
  searchInfo: ProblemSearchType,  // 搜索信息
  [item: string]: any,            // 其他属性
}

export interface ProblemSearchType {
  PID?: string,        // 题目 PID
  Title?: string,      // 标题
  Source?: string,     // 来源
  Label?: string,      // 标签
  [item: string]: any,          // 其他属性
}

export interface JudgeFileType {
  FileName: string,       // 文件名
  FileType: string,       // 文件类型
  FileSize: number,       // 文件大小
  [item: string]: any,    // 其他属性
}

export interface JudgeFilesType {
  PID: string,                       // 题目 PID
  judgeFiles: Array<JudgeFileType>,  // 文件列表
  Count: number,                     // 文件数量
  [item: string]: any,               // 其他属性
}