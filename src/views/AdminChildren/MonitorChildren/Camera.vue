<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <memory-one theme="outline" size="18" />
          快照模式
        </div>
      </li>
      <li>
        <div
          class="font-bold text-base"
          @click="$router.push({ name: 'MonitorVideo' })"
        >
          <notepad theme="outline" size="18" />
          切换
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="startMonitor()">
          <folder-plus theme="outline" size="18" />
          开始监考
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="stopMonitor()">
          <folder-plus theme="outline" size="18" />
          结束监考
        </div>
      </li>
    </ul>
  </div>
  <div class="py-6 space-y-4">
    <div class="grid gap-4" :class="`grid-cols-2 sm:grid-cols-4`">
      <div
        v-for="item in items"
        :key="item.id"
        class="relative rounded-lg shadow border p-4 flex space-x-4 bg-white"
      >
        <img :src="item.media[0]" alt="Image" class="w-16 h-12" />
        <img :src="item.media[1]" alt="Image" class="w-16 h-12" />
        <div
          class="absolute inset-x-0 top-0 bg-black bg-opacity-50 text-white text-sm justify-between items-center"
        >
          <span>{{ item.info }}</span>
          <button
            class="px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded text-xs"
          >
            操作
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { _getObjects } from "@/apis/oss";
import { OssUtils } from "@/utils/ossUtils";
import { useWebSocketStore } from "@/stores/WebSocket";

const webSocketStore = useWebSocketStore();

export interface ItemType {
  id: string;
  media: [string, string]; // 每个 Item 包含两个媒体
  info: string;
}

const items = computed(() => {
  return Object.keys(combinedMedia).map((UID) => {
    const media = combinedMedia[UID];
    const item: ItemType = {
      id: UID,
      media: [media.camera, media.screen],
      info: `快照: ${media.camera ? media.camera.lastModified : "无"} 屏幕: ${
        media.screen ? media.screen.lastModified : "无"
      }`,
    };
    return item;
  });
});

const combinedMedia: {
  [key: string]: { camera?: any; screen?: any };
} = {};

const updateMonitorImage = (data: any) => {
  if (data.Type === "camera") {
    OssUtils.getUrl(data.UID, "camera-images").then((url) => {
      console.log("camera url", url);
      combinedMedia[data.UID].camera = url;
    });
  } else if (data.Type === "screen") {
    OssUtils.getUrl(data.UID, "screen-images").then((url) => {
      console.log("screen url", url);
      combinedMedia[data.UID].screen = url;
    });
  }
};

async function getObjects(bucket: string): Promise<any[]> {
  return new Promise((resolve) => {
    _getObjects({}, bucket).then((data: any) => {
      resolve(data.ObjectInfo);
    });
  });
}
async function startMonitor() {
  const cameraImages = await getObjects("camera-images");
  const screenImages = await getObjects("screen-images");

  cameraImages.forEach((obj: any) => {
    const name = obj.name;
    if (!combinedMedia[name]) {
      combinedMedia[name] = {};
    }
    combinedMedia[name].camera = obj;
  });
  screenImages.forEach((obj: any) => {
    const name = obj.name;
    if (!combinedMedia[name]) {
      combinedMedia[name] = {};
    }
    combinedMedia[name].screen = obj;
  });

  webSocketStore.sendMessage("subscribe", { RoomKey: "monitor" });
  webSocketStore.subscribe("monitor:update", updateMonitorImage);
}
const stopMonitor = () => {
  webSocketStore.sendMessage("unsubscribe", { RoomKey: "monitor" });
  webSocketStore.unsubscribe("update:monitor", updateMonitorImage);
};
onUnmounted(() => {
  webSocketStore.sendMessage("unsubscribe", { RoomKey: "monitor" });
  webSocketStore.unsubscribe("update:monitor", updateMonitorImage);
});
</script>
