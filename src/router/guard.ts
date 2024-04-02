import { useUserDataStore } from "@/store/UserData.ts";
import { push } from "notivue";

export function needLoginCertificate(): boolean {
  const userDataStore = useUserDataStore();
  if (userDataStore.isLogin) {
    if (
      !localStorage.getItem("token") ||
      localStorage.getItem("UID") != userDataStore.UID
    ) {
      push.error({
        title: "权限不足",
        message: "登录状态异常，请重新登录",
      });
      userDataStore.logout();
      return false;
    }
    return true;
  } else {
    push.error({
      title: "权限不足",
      message: "请登陆后再试",
    });
    return false;
  }
}

export function needAdminCertificate(): boolean {
  const userDataStore = useUserDataStore();
  if (needLoginCertificate()) {
    if (userDataStore.PermissionMap > 3) {
      return true;
    } else {
      push.error({
        title: "权限不足",
        message: "非管理员无法访问",
      });
      return false;
    }
  } else {
    return false;
  }
}

export function needProblemAdminCertificate(): boolean {
  const userDataStore = useUserDataStore();
  if (needAdminCertificate()) {
    if (
      userDataStore.PermissionMap & 0x08 ||
      userDataStore.PermissionMap & 0x80
    ) {
      return true;
    } else {
      push.error({
        title: "权限不足",
        message: "没有管理题目的权限",
      });
      return false;
    }
  } else {
    return false;
  }
}

export function needContestAdminCertificate(): boolean {
  const userDataStore = useUserDataStore();
  if (needAdminCertificate()) {
    if (
      userDataStore.PermissionMap & 0x10 ||
      userDataStore.PermissionMap & 0x80
    ) {
      return true;
    } else {
      push.error({
        title: "权限不足",
        message: "没有管理比赛的权限",
      });
      return false;
    }
  } else {
    return false;
  }
}

export function needSourceBorwserAdminCertificate(): boolean {
  const userDataStore = useUserDataStore();
  if (needAdminCertificate()) {
    if (
      userDataStore.PermissionMap & 0x20 ||
      userDataStore.PermissionMap & 0x80
    ) {
      return true;
    } else {
      push.error({
        title: "权限不足",
        message: "没有管理资源的权限",
      });
      return false;
    }
  } else {
    return false;
  }
}

export function needProblemListAdminCertificate(): boolean {
  const userDataStore = useUserDataStore();
  if (needAdminCertificate()) {
    if (
      userDataStore.PermissionMap & 0x40 ||
      userDataStore.PermissionMap & 0x80
    ) {
      return true;
    } else {
      push.error({
        title: "权限不足",
        message: "没有管理题单的权限",
      });
      return false;
    }
  } else {
    return false;
  }
}

export function needSuperAdminCertificate(): boolean {
  const userDataStore = useUserDataStore();
  if (needAdminCertificate()) {
    if (userDataStore.PermissionMap & 0x80) {
      return true;
    } else {
      push.error({
        title: "权限不足",
        message: "非超管无权访问",
      });
      
    }
    return true;
  } else {
    return false;
  }
}
