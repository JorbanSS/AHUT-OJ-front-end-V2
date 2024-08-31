export interface UserSimplifiedType {
  UID: string,               // 用户唯一 UID, 格式: 学校英文首字母大写 + 学号, e.g. AHUT229074001
  UserName: string,          // 真实姓名

  [item: string]: any,       // 其他属性
}

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

export interface LoginInfoType {
  UID: string,             // UID
  Pass: string,            // 密码
  Email: string,           // 邮箱
  Code: string,            // 验证码
  Save: boolean,           // 是否保存 3 天
  [item: string]: any,     // 其他属性
}

export interface RegisterInfoType {
  UID: string,                  // UID
  UserName: string,             // 真实姓名
  Pass: string,                 // 密码
  Email: string,                // 邮箱
  VerifyCode: string,           // 验证码
}

export interface PermissionType {
  map: number,              // 权限 bit
  super: boolean,           // 超管
  problemList: boolean,     // 题单
  resource: boolean,        // 资源
  contest: boolean,         // 比赛
  problem: boolean,         // 题目
  [item: string]: any,      // 其他属性
}

export interface BindType {
  ID: string,                 // 第三方 ID
  Pass: string,               // 第三方密码

  bind: Function,             // 绑定
  [item: string]: any,        // 其他属性
}