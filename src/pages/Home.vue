<template>
  <div role="alert" class="Border Alert shadow-lg bg-white">
    <remind theme="outline" size="20" class="ml-1" />
    <div>
      <h3 class="font-bold">{{ notice.Title }}</h3>
      <div class="text-xs">{{ ConvertTools.PrintTime(notice.UpdatedTime, 1) }}</div>
    </div>
    <button class="btn btn-sm" onclick="homeNotice.showModal()">详情</button>
  </div>
  <div class="mt-6"></div>
  <div class="flex flex-row space-x-6 h-96">
    <div class="basis-2/3">
      <div class="carousel h-full rounded-2xl shadow-lg Border">
        <div class="carousel-item relative w-full" v-for="(item, index) in banners.banners" :key="index"
          :id="`slide${index}`">
          <img :src="'data:image/*;base64,' + item.ObjectData" class="w-full" />
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a :href="`#slide${(index - 1 + banners.Count) % banners.Count}`" class="btn btn-circle">❮</a>
            <a :href="`#slide${(index + 1) % banners.Count}`" class="btn btn-circle">❯</a>
          </div>
        </div>
      </div>
    </div>
    <div class="basis-1/3 card rounded-2xl bg-white shadow-lg Border">
      <div class="text-lg m-4 font-bold">
        版本更新日志
      </div>
      <div class="px-4 overflow-auto rounded-2xl">
        <div v-for="item in updateLogs.updateLogs" :key="item.ID">
          <div class="pb-4">
            <div class="font-bold -mb-1">
              {{ item.Title }}
            </div>
            <div class="-mx-4">
              <MdPreview :editorId="'updateLogs' + item.ID.toString()" :modelValue="item.Content" preview-only />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <dialog id="homeNotice" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ notice.Title }}</h3>
      <MdPreview editorId="homeNoticeContent" :modelValue="notice.Content" class="-mx-5" preview-only />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button></button>
    </form>
  </dialog>
</template>

<script lang="ts" setup name="Home">
import { Remind, Cattle, Ranking, ToTop } from '@icon-park/vue-next';
import { type HomeNoticeType } from '@/type';
import { ConvertTools } from '@/assets/ts/globalFunctions';
import { Get, Post } from '@/utils/axios/request';
import { type UpdateLogsType, type BannersType } from '@/type';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import { push } from 'notivue';

import { onMounted, reactive, ref } from 'vue';

import 'md-editor-v3/lib/preview.css';

let updateLogs = reactive<UpdateLogsType>({
  updateLogs: [],
  count: 0,
});

let notice = ref<HomeNoticeType>({
  Title: '',
  Content: '',
  UpdatedTime: 0,
})

let banners = reactive<BannersType>({
  banners: [],
  Count: 0,
});

function getUpdateLogs() {
  Get('api/notice/notices', {})
    .then((res: any) => {
      let data = res.data;

      if (data.Code == 0) {
        updateLogs.updateLogs = data.Data;
        updateLogs.count = data.Count;
        notice.value = updateLogs.updateLogs.filter(item => item.ID == 0)[0];
        updateLogs.updateLogs = updateLogs.updateLogs.filter(item => item.ID != 0);
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}


function getBanners() {
  Get('api/notice/images', {})
    .then((res: any) => {
      let data = res.data;

      if (data.Code == 0) {
        banners.banners = data.Data;
        banners.Count = data.Count;
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

onMounted(() => {
  getUpdateLogs();
  getBanners();
})

</script>

<style scoped></style>