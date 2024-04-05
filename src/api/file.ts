import Axios from "@/utils/axios/request";
import { Get, Post } from "@/utils/axios/request";

export const _uploadBannerImage = (data: any) => {
  return Axios({
    url: "notice/images/",
    method: "post",
    data,
  })
}
