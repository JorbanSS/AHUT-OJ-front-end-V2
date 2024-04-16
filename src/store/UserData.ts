import { defineStore } from "pinia";

import { type UserSimplifiedType, type UserType } from "@/type/user";
import { UserDataLocalStorage } from "@/utils/buffer/localStorage";
import { UserDataSessionStorage } from "@/utils/buffer/sessionStorage";
import { StoreNameSpace } from "./StoreNameSpace";

export const useUserDataStore = defineStore(StoreNameSpace.UserData, {
  state: () => {
    return {
      UID: "",
      UserName: "",
      Email: "",
      School: "",
      QQ: "",
      RegisterTime: 0,
      HeadURL: "",

      Rating: 0,
      Submited: 0,
      Solved: 0,

      CodeForceUser: "",
      CodeForceScore: 0,
      AtcoderUser: "",
      AtcoderScore: 0,
      NowCoderUser: "",
      NowCoderScore: 0,

      isLogin: false,
      PermissionMap: 0,
    };
  },
  actions: {
    login(data: UserType) {
      this.UID = data.UID;
      this.UserName = data.UserName;
      this.Email = data.Email;
      this.School = data.School;
      this.QQ = data.QQ;
      this.RegisterTime = data.RegisterTime;
      this.HeadURL = data.HeadURL;

      this.Rating = data.Rating;
      this.Submited = data.Submited;
      this.Solved = data.Solved;

      this.CodeForceUser = data.CodeForceUser;
      this.CodeForceScore = data.CodeForceScore;
      this.AtcoderUser = data.AtcoderUser;
      this.AtcoderScore = data.AtcoderScore;
      this.NowCoderUser = data.NowCoderUser;
      this.NowCoderScore = data.NowCoderScore;

      this.isLogin = true;
      this.PermissionMap = data.PermissionMap;

      UserDataSessionStorage.update(data);
    },

    loginSimplified(data: UserSimplifiedType) {
      this.UID = data.UID;
      this.UserName = data.UserName;
      this.isLogin = true;
      this.PermissionMap = data.PermissionMap;

      UserDataSessionStorage.update(data);  
    },

    init() {
      this.UID = "";
      this.UserName = "";
      this.Email = "";
      this.School = "";
      this.QQ = "";
      this.RegisterTime = 0;
      this.HeadURL = "";

      this.Rating = 0;
      this.Submited = 0;
      this.Solved = 0;

      this.CodeForceUser = "";
      this.CodeForceScore = 0;
      this.AtcoderUser = "";
      this.AtcoderScore = 0;
      this.NowCoderUser = "";
      this.NowCoderScore = 0;

      this.isLogin = false;
      this.PermissionMap = 0;

      UserDataSessionStorage.init();
      UserDataLocalStorage.init();
    },

    updatePermissionMap(permissionMap: number) {
      this.PermissionMap = permissionMap;
    },

    logout() {
      this.init();
    },
  },
  getters: {},
});
