// 用户
export interface UserType extends UserSimplifiedType {
  Email: string,                // 邮箱
  School: string,               // 大学
  QQ: string,                   // QQ 号
  RegisterTime: number,         // 注册时间
  HeadURL: string,              // 头像

  Rating: number,               // Rating
  Submited: number,             // 提交数
  Solved: number,               // 通过数

  CodeForceUser: string,        // Codeforces 账号
  CodeforceScore: number,       // Codeforces Rating
  AtcoderUser: string,          // AtCoder 账号
  AtcoderScore: number,         // AtCoder Rating
  NowCoderUser: string,         // NowCoder 账号
  NowCoderScore: number,        // NowCoder Rating

  [item: string]: any,          // 其他属性
}


// export interface UsersType {
//   users: Array<UserType>,     // 用户列表
//   Count: number,              // 总数
// }


export interface UserSimplifiedType {
  UID: string,               // 用户唯一 UID, 格式: 学校英文首字母大写 + 学号, e.g. AHUT229074001
  UserName: string,          // 真实姓名
  PermissionMap: 0,          // 权限, 用二进制表示
}


export interface LoginInfoType {
  UID: string,             // UID
  Pass: string,            // 密码
  save: boolean,           // 是否保存 3 天
  [item: string]: any,     // 其他属性
}


export interface ShowConfigType {
  showNavBar: boolean,          // 显示导航栏
  showFooter: boolean,          // 显示底栏
  showCover: boolean,           // 显示遮罩
  showLogin: boolean,           // 显示登录页面
  showRegister: boolean,        // 显示注册页面
  showBody: boolean,            // 显示主体内容
  init: Function,               // 初始化
  showLoginDialog: Function,    // 显示登陆页面
  showRegisterDialog: Function, // 显示注册页面

  [item: string]: any,          // 其他属性
}


// 题目
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


// 比赛
export interface ContestSimplifiedType {
  CID: number,            // 比赛唯一 CID, 服务器分配
  Title: string,          // 标题
  BeginTime: number,      // 开始时间
  EndTime: number,        // 结束时间
  IsPublic: number,       // 是否为私有比赛
  Type: number,           // 类型, 0: oi, 1: icpc, 2: codeforces
  UID: string,            // 馔题人
  [item: string]: any,    // 其他属性
}

export interface ContestType extends ContestSimplifiedType {
  duration: number,       // 时长
  description: string,    // 描述, 需要改成 Markdown 格式
  problems: string,       // 题目列表
  Pass: string,           // 密码
  [item: string]: any,    // 其他属性
}

export interface ContestsType {
  contests: Array<ContestSimplifiedType>, // 比赛列表
  count: number,                          // 总数
  page: number,                           // 页码
  limit: number,                          // 每页数量
  [item: string]: any,                    // 其他属性
}


// 题单
export interface ProblemListSimplifiedType {
  LID: number,            // 题单唯一 LID, 服务器分配
  PTitle: string,          // 标题
  UID: string,            // 创建人
  StartTime: number,      // 创建时间
  [item: string]: any,    // 其他属性
}

export interface ProblemListType {
  description: string,    // 描述, 需要改成 Markdown 格式
  problems: string,       // 题目列表
  [item: string]: any,    // 其他属性
}

export interface ProblemListsType {
  problemLists: Array<ProblemListSimplifiedType>, // 题单列表
  count: number,                                  // 总数
  page: number,                                   // 页码
  limit: number,                                  // 每页数量
  [item: string]: any,                            // 其他属性
}

// 导航栏
export interface NavItemType {
  title: string;                  // 显示名称
  icon: any;                      // 图标
  to?: { name: string };          // 路由
  subItems?: Array<NavItemType>;  // 子项
  [item: string]: any,            // 其他属性
}


// 主页通知
export interface HomeNoticeType {
  Title: string;              // 标题
  Content: string;            // 内容
  UpdatedTime: number;        // 时间
  [item: string]: any;        // 其他属性
}


// 比赛通知
export interface ContestNoticeType extends HomeNoticeType {
  title: string;              // 标题
  content: string;            // 内容
  time: number;               // 时间
  CID: number;                // 比赛 CID
  [item: string]: any;        // 其他属性
}


// 记录
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


// 时间
export interface TimeType {
  year: number,         // 年
  month: number,        // 月
  day: number,          // 日
  hour: number,         // 时
  minute: number,       // 分
  second: number,       // 秒
  [item: string]: any,  // 其他属性
}

// 首页更新日志
export interface UpdateLogType {
  ID: number;             // ID
  Title: string;          // 标题
  Content: string;        // 内容
  UpdatedTime: number;    // 创建时间
  [item: string]: any,    // 其他属性
}

export interface UpdateLogsType {
  updateLogs: Array<UpdateLogType>,  // 更新日志列表
  count: number,                     // 总数
  [item: string]: any,               // 其他属性
}

export interface SubmitCodeType {
  Lang: number,         // 语言
  Source: string,       // 源代码
  [item: string]: any,  // 其他属性
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

export interface BannerType {
  ObjectData: string,
  [item: string]: any,        // 其他属性
};

export interface BannersType {
  banners: Array<BannerType>,
  Count: number,
  [item: string]: any,          // 其他属性
};