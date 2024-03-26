import { useUserDataStore } from "@/store/UserData";
import { type UserType } from '@/type';

export class UserDataLocalStorage {
  public static init() {
    localStorage.removeItem("token");
    localStorage.removeItem("UID");
    localStorage.removeItem("saveLoginStatus");
  }

  public static update(data: any) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("UID", data.UID);
    localStorage.setItem("saveLoginStatus", data.saveLoginStatus.toString());
  }
}