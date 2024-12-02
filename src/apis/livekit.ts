import { Get, Post } from "@/utils/axios/request";

export const _getJoinToken = (params: any, roomName: string) => {
  return Get(`tool/livekit/${roomName}`, params);
};
