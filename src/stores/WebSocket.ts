import { push } from "notivue";
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ReconnectingWebSocket from "reconnecting-websocket";

export let host: string;
if (import.meta.env.MODE === "production") {
  host = "/ws";
} else {
  host = "ws://localhost:4212/ws";
}
// 也曾尝试过promise ，但是得维护reqID的map，大大加大了难度，因为本身不支持请求响应模型，而是事件驱动？
export const useWebSocketStore = defineStore("WebSocket", {
  state: () => ({
    socket: null as ReconnectingWebSocket | null,
    eventHandlers: new Map<string, Array<(data: any) => void>>(),
    pingInterval: null as NodeJS.Timeout | null, // 增加一个定时器状态
  }),
  actions: {
    connectWebSocket() {
      let token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      if (typeof WebSocket === "undefined") {
        console.warn("您的浏览器不支持WebSocket");
        return;
      }
      console.log("WebSocket connecting...");
      const HOST_ADDRESS = `${host}?token=${token}`;
      this.socket = new ReconnectingWebSocket(HOST_ADDRESS);
      this.socket.onopen = () => {
        console.log("WebSocket connected.");
        this.pingInterval = setInterval(() => {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.sendMessage("ping");
          }
        }, 30000);
        this.subscribe("notice:judge", (data: any) => {
          push.success({
            title: `判题结果`,
            message: `提交记录${data.SID}判题为${data.ResultACM}`, // 将当前时间填入 message
          });
        }); //全局订阅
      };
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const type = data.Type;
        const handlers = this.eventHandlers.get(type);
        if (handlers) {
          handlers.forEach((handler) => handler(data));
        }
      };
      this.socket.onclose = (event) => {
        console.log("WebSocket closed with code:", event.code);
        this.init();
      };
      this.socket.onerror = (event) => {
        console.log("WebSocket error:", event);
      };
    },
    init() {
      this.socket = null;
      this.eventHandlers.clear();
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
    },
    // method 和type，就假装认为一个是服务端事件，一个是客户端事件吧（（（
    // 主要是为了区分，不是一一对应
    subscribe(type: string, handler: (data: any) => void) {
      if (!this.eventHandlers.has(type)) {
        this.eventHandlers.set(type, []);
      }
      this.eventHandlers.get(type)!.push(handler);
    },
    unsubscribe(type: string, handler: (data: any) => void) {
      const handlers = this.eventHandlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    },
    sendMessage(method: string, params?: any) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket is not connected.");
        return;
      }
      const msg = { Method: method, Params: params };
      this.socket.send(JSON.stringify(msg));
    },
  },
});
