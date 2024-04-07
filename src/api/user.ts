import { Post, Get } from "@/utils/axios/request";

// 登录
export const _login = (data: any) => {
  return Post('auth/login/', data);
}

// 登录
export const _register = (data: any) => {
  return Post('auth/register/', data);
}

// Code 验证
export const _codeVerify = (data: any) => {
  return Post('auth/codeverify', data);
}

// 链接验证
export const _urlVerify = (params: any) => {
  return Get('auth/urlverify/', params);
}

// 验证邮箱
export const _verifyEmail = (data: any) => {
  return Post('auth/verifyemail/', data);
}

// 获取用户信息
export const _getUserInfo = (params: any) => {
  return Get('user/info', params);
}

// 获取用户权限
export const _getUserPermission = (params: any, UID: string) => {
  return Get(`admin/permission/${UID}`, params);
}

// 修改用户权限
export const _editUserPermission = (data: any) => {
  return Post('admin/permission/edit/', data);
}

// 删除用户
export const _deleteUsers = (data: any) => {
  return Post('user/delete/', data);
}

// 获取管理员列表
export const _getAdmins = (params: any) => {
  return Get('admin/permission/list/', params);
}

// 管理员修改用户密码
export const _changePassword = (data: any) => {
  return Post('user/edit/', data);
}

// 新增用户
export const _addUser = (data: any) => {
  return Post('admin/users/', data);
}

// 绑定 Codeforces
export const _bindCodeforces = (data: any) => {
  return Post('user/codeforceBind/', data);
}

// 绑定 Atcoder
export const _bindAtcoder = (data: any) => {
  return Post('user/atcoderBind/', data);
}

// 绑定 Nowcoder
export const _bindNowcoder = (data: any) => {
  return Post('user/nowcoderBind/', data);
}

// 绑定 Virtual Judge
export const _bindVirtualJudge = (data: any) => {
  return Post('user/vjudgeBind', data);
}

// 忘记密码
export const _forgetPassword = (data: any) => {
  return Post('admin/user/forget/pass', data);
}

// 获取在线用户列表
export const _getUsersOnline = (data: any) => {
  return Post('admin/user/forget/pass', data);
}

// 修改密码
export const _editPassword = (data: any) => {
  return Post('user/edit/pass/', data);
}