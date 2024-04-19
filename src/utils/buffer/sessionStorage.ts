import { UserSimplifiedType, type UserType } from '@/interface/user';

export class UserDataSessionStorage {
  public static init() {
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("savedCode");
  }

  public static update(data: UserType | UserSimplifiedType) {
    let jsonString = JSON.stringify(data);
    sessionStorage.setItem("userInfo", jsonString);
  }
}