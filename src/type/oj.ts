export interface OjStasticsType{
  UserNumber: number,      // 累积注册量
  TotalSubmit: number,     // 累积提交数
  TodaySubmit: number,     // 当日提交数
  ProblemNumber: number,   // 题库题目数
  [item: string]: any,     // 其他属性
}

export interface UpdateLogType {
  ID: number,             // ID
  Title: string,          // 标题
  Content: string,        // 内容
  CreatedTime: number,    // 创建时间
  UpdatedTime: number,    // 创建时间
  UID: string,            // 用户 UID
  [item: string]: any,    // 其他属性
}

export interface UpdateLogsType {
  updateLogs: Array<UpdateLogType>,  // 更新日志列表
  count: number,                     // 总数
  [item: string]: any,               // 其他属性
}

export interface BannerType {
  ObjectData: string,         // 图片 Base64
  [item: string]: any,        // 其他属性
}

export interface BannersType {
  banners: Array<BannerType>,   // 图片集
  Count: number,                // 图片数
  [item: string]: any,          // 其他属性
}

export interface HomeNoticeType {
  Title: string,              // 标题
  Content: string,            // 内容
  UpdatedTime: number,        // 时间
  UID: string,                // 用户 UID
  CreatedTime: number,        // 创建时间
  [item: string]: any,        // 其他属性
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

export interface NavItemType {
  title: string,                  // 显示名称
  icon: any,                      // 图标
  to?: { name: string },          // 路由
  subItems?: Array<NavItemType>,  // 子项
  [item: string]: any,            // 其他属性
}

export interface ContestNoticeType extends HomeNoticeType {
  title: string,              // 标题
  content: string,            // 内容
  time: number,               // 时间
  CID: number,                // 比赛 CID
  [item: string]: any,        // 其他属性
}