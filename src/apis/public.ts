// 存放公共api
import axios from "axios";


export const _getRandomColor = async () => {
    const response = await axios.get('https://tenapi.cn/v2/color');
    return response.data;
  };