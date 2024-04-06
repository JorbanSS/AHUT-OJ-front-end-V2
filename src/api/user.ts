import Axios from "@/utils/axios/request";

export const _login = (data: any) => {
  return Axios({
    url: "auth/login/",
    method: "post",
    data,
  })
}

export const _register = (data: any) => {
  return Axios({
    url: "auth/register/",
    method: "post",
    data,
  })
}

export const _codeVerify = (data: any) => {
  return Axios({
    url: "auth/codeverify",
    method: "post",
    data,
  })
}


export const _urlVerify = (params: any) => {
  return Axios({
    url: "auth/urlverify/",
    method: "get",
    params,
  })
}

export const _verifyEmail = (data: any) => {
  return Axios({
    url: "auth/verifyemail/",
    method: "post",
    data,
  })
}

export const _getUserInfo = (params: any) => {
  return Axios({
    url: "user/info",
    method: "get",
    params,
  })
}

export const _getUserPermission = (params: any, UID: string) => {
  return Axios({
    url: `admin/permission/${UID}`,
    method: "get",
    params,
  })
}

export const _editUserPermission = (data: any) => {
  return Axios({
    url: `admin/permission/edit/`,
    method: "post",
    data,
  })
}

export const _deleteUsers = (data: any) => {
  return Axios({
    url: `user/delete/`,
    method: "post",
    data,
  })
}

export const _getAdmins = (params: any) => {
  return Axios({
    url: `admin/permission/list/`,
    method: "get",
    params,
  })
}

export const _changePassword = (data: any) => {
  return Axios({
    url: `user/edit/`,
    method: "post",
    data,
  })
}

export const _addUser = (data: any) => {
  return Axios({
    url: `admin/users/`,
    method: "post",
    data,
  })
}


