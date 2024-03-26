import { defineStore } from "pinia"
import { StoreNameSpace } from "./StoreNameSpace"

export const useThemeSwitchStore = defineStore(
  StoreNameSpace.ThemeSwitch,
  {
  state: () => {
    return {
      theme: 1,
    }
  },
  getters: {

  },
  actions: {
    init() {
      if (localStorage.getItem("theme")) {
        this.theme = Number(localStorage.getItem("theme"));
      }
      else {
        this.switchTheme(1);
      }
    },
    switchTheme(theme?: number) {
      if (typeof theme != 'undefined') this.theme = theme;
      else this.theme = 3 - this.theme;
      console.log(this.theme);
    },
  }
})