// 存放公共api
import axios from "axios";

export const _getPublicRandomColor = async () => {
  const response = await axios.get("https://tenapi.cn/v2/color");
  return response.data;
};

export const _getPublicRecentContests = async () => {
  const response = await axios.get("https://algcontest.rainng.com/");
  return response.data;
};
