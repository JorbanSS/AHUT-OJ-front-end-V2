export class UserDataLocalStorage {
  public static init() {
    localStorage.removeItem("token");
    localStorage.removeItem("UID");
    localStorage.removeItem("saveLoginStatus");
  }

  public static update(data: any) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("UID", data.UID);
    localStorage.setItem("saveLoginStatus", JSON.stringify(data.saveLoginStatus));
  }
}