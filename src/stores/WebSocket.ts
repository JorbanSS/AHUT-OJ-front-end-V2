import { ref } from "vue";
import { defineStore } from "pinia";
import { StoreNameSpace } from "./StoreNameSpace";

export const useWebSocketStore = defineStore(StoreNameSpace.WebSocket, {
  state: () => ({
    socket: null as WebSocket | null, // WebSocket 对象，初始值为 null
    messageQueue: [] as any[], // 消息队列，初始为空数组
    readyState: 0, // WebSocket 连接状态，初始值为 0
    socketMessage: "1", // 最近收到的 WebSocket 消息，初始值为 "1"
  }),
  getters: {
    // 定义 SET_SOCKET getter
    SET_SOCKET(state) {
      return (socket: WebSocket) => {
        state.socket = socket; // 更新 socket 状态
      };
    },
    // 定义 SET_SOCKET_MESSAGE getter
    SET_SOCKET_MESSAGE(state) {
      return (socketMessage: string) => {
        state.socketMessage = socketMessage; // 更新 socketMessage 状态
      };
    },
  },
  actions: {
    // 连接 WebSocket 的方法
    connectWebSocket() {
      const PING_INTERVAL = 5000; // 心跳间隔，单位为毫秒
      const heartbeatMessage = { type: 0, msg: "ping" }; // 心跳消息
      const heartbeatMessage2 = { type: 0, msg: "pong", data: ["在线设备"] }; // 心跳响应消息
      const HOST_ADDRESS = "ws://127.0.0.1:7531"; // WebSocket 服务器地址
      const socket = new WebSocket(HOST_ADDRESS); // 创建 WebSocket 对象
      let checkTask: any = null; // 心跳检查任务的计时器

      // 监听连接事件
      socket.onopen = () => {
        // 启动心跳检测，确保连接存活
        checkTask = setInterval(() => {
          socket.send(JSON.stringify(heartbeatMessage)); // 发送心跳消息
        }, PING_INTERVAL);
      };

      // 监听消息事件
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data); // 解析收到的消息
        if (message.type === WebSocket.CONNECTING) {
          socket.send(JSON.stringify(heartbeatMessage2)); // 发送心跳响应消息
        } else {
          if (this.messageQueue.length > 65536) {
            // 消息队列长度超过 65536 时清空队列
            this.messageQueue = [];
          }
          this.SET_SOCKET_MESSAGE(message); // 更新 socketMessage
        }
      };

      // 监听关闭事件，断线重连
      socket.onclose = () => {
        if (this.socket?.readyState === WebSocket.CLOSED) {
          this.messageQueue.forEach((message) => {
            this.sendMessage(message); // 重新发送队列中的消息
          });
          this.messageQueue = []; // 清空消息队列
        }
        if (checkTask) {
          clearInterval(checkTask); // 清除心跳计时器
        }
        setTimeout(() => {
          this.connectWebSocket(); // 断线重连
        }, 3000);
      };

      // 监听错误事件
      socket.onerror = (event) => {
        console.log("WebSocket error:", event); // 打印错误信息
      };

      this.SET_SOCKET(socket); // 设置 WebSocket 对象
    },

    // 发送消息的方法
    sendMessage(message: string) {
      if (this.socket) {
        this.socket.send(message); // 通过 WebSocket 发送消息
      } else {
        console.error("Socket is not connected."); // 如果 WebSocket 未连接，打印错误信息
      }
    },
  },
});

// import { defineStore } from 'pinia';
// import { StoreNameSpace } from './StoreNameSpace';

// export const useWebSocketStore = defineStore(StoreNameSpace.WebSocket, {
//   state: () => ({
//     sockets: {} as Record<string, WebSocket | null>, // WebSocket 对象，以页面标识符为键
//     messageQueues: {} as Record<string, any[]>, // 消息队列，以页面标识符为键
//     readyStates: {} as Record<string, number>, // WebSocket 连接状态，以页面标识符为键
//     socketMessages: {} as Record<string, string>, // 最近收到的 WebSocket 消息，以页面标识符为键
//   }),
//   getters: {
//     getSocket: (state) => (page: string) => state.sockets[page],
//     getSocketMessage: (state) => (page: string) => state.socketMessages[page],
//   },
//   actions: {
//     connectWebSocket(page: string, hostAddress: string) {
//       const PING_INTERVAL = 5000;
//       const heartbeatMessage = { type: 0, msg: 'ping' };
//       const heartbeatMessageResp = { type: 0, msg: 'pong', data: ['在线设备'] };
//       const socket = new WebSocket(hostAddress);
//       let checkTask: any = null;

//       socket.onopen = () => {
//         checkTask = setInterval(() => {
//           socket.send(JSON.stringify(heartbeatMessage));
//         }, PING_INTERVAL);
//       };

//       socket.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         if (message.type === WebSocket.CONNECTING) {
//           socket.send(JSON.stringify(heartbeatMessageResp));
//         } else {
//           if (!this.messageQueues[page]) {
//             this.messageQueues[page] = [];
//           }
//           if (this.messageQueues[page].length > 65536) {
//             this.messageQueues[page] = [];
//           }
//           this.socketMessages[page] = message;
//         }
//       };

//       socket.onclose = () => {
//         if (this.sockets[page]?.readyState === WebSocket.CLOSED) {
//           if (this.messageQueues[page]) {
//             this.messageQueues[page].forEach((message) => {
//               this.sendMessage(page, message);
//             });
//             this.messageQueues[page] = [];
//           }
//         }
//         if (checkTask) {
//           clearInterval(checkTask);
//         }
//         setTimeout(() => {
//           this.connectWebSocket(page, hostAddress);
//         }, 3000);
//       };

//       socket.onerror = (event) => {
//         console.log('WebSocket error:', event);
//       };

//       this.sockets[page] = socket;
//     },

//     sendMessage(page: string, message: string) {
//       const socket = this.sockets[page];
//       if (socket) {
//         socket.send(message);
//       } else {
//         console.error('Socket is not connected.');
//       }
//     },
//   },
// });
