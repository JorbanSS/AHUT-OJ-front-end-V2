import { defineStore } from "pinia";
import { StoreNameSpace } from "./StoreNameSpace";

export const useConstValStore = defineStore(StoreNameSpace.ConstVal, {
  state: () => {
    return {
      LightTheme: 1,
      DarkTheme: 2,

      // 权限 bit 表
      UnLoginBit: 0b0000_0001,
      UserBit: 0b0000_0010,
      AdminBit: 0b0000_0100,
      ProblemAdminBit: 0b0000_1000,
      ContestAdminBit: 0b0001_0000,
      SourceBorwserBit: 0b0010_0000,
      ProblemListAdminBit: 0b0100_0000,
      SuperAdminBit: 0b1000_0000,

      // 代码语言
      SUBMIT_LANG_C: 1,
      // SUBMIT_LANG_CPP: 2,
      // SUBMIT_LANG_CPP11: 3,
      SUBMIT_LANG_CPP17: 4,
      SUBMIT_LANG_JAVA: 5,
      SUBMIT_LANG_PYTHON3: 6,
      SUBMIT_LANG: ["", "C", "C++", "C++11", "C++17", "Java", "Python3"],

      // 题目来源
      PROBLEM_ORIGIN_LOCAL: -1,
      PROBLEM_ORIGIN_CF: 1,
      PROBLEM_ORIGIN_ATCODER: 2,
      PROBLEM_ORIGIN_LUOGU: 3,

      // 题目描述文本类型
      PROBLEM_CONTENTTYPE_NORMAL: -1,
      PROBLEM_CONTENTTYPE_MARKDOWN: 1,
      PROBLEM_CONTENTTYPE_PDF: 2,

      // 题目是否可见
      PROBLEM_VISIBLE: 1,
      PROBLEM_UNVISIBLE: -1,

      // 题面类型
      PROBLEM_TYPE_PLAIN_TEXT: -1,
      PROBLEM_TYPE_MARKDOWN: 1,

      // 比赛 - 是否公开
      CONTEST_PUBLIC: 1,
      CONTEST_NOTPUBLIC: -1,
      // 比赛 - 赛制
      CONTEST_TYPE_ICPC: 1,
      CONTEST_TYPE_OI: 2,
      
      // OSS
      OSS_OBJECT_PRESIGIN: 0,
      OSS_OBJECT_BASE64: 1,
      OSS_OBJECT_DOWNLOAD: 2,

      // OSS 浏览模式
      OSS_BROWSER_MODE_FOLDER: 0,
      OSS_BROWSER_MODE_FILE: 1,

      // 排行榜背景色
      RANKING_COLOR_NOT_AC: "#FFD0D0",
      RANKING_COLOR_AC: "#E1FFB5",
      RANKING_COLOR_FIRST_AC: "#3DB03D",

      // 报错提示信息
      SUBMIT_RESULT_PE:
        "你的输出结果也许是正确的，但是格式存在问题，请检查输出结果的换行情况\n\n例如 C++: cout << a; 和 cout << a << endl;\n\n或者检查输出结果的空个间隔情况、中英文格式等",
      SUBMIT_RESULT_FAILED:
        "判题出现了问题，也许你的代码最终运行结果是正确的，请尝试单击下方重判按钮，尝试重新判题。",

    };
  },
  getters: {},
  actions: {},
});
