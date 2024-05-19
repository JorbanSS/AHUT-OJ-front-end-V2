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
  <div class="flex space-y-6 flex-col md:flex-row md:space-y-0 md:space-x-6">
    <div class="carousel w-full rounded-2xl shadow-lg Border h-96">
      <div class="carousel-item relative w-full" v-for="(item, index) in banners.banners" :key="index"
        :id="`slide${index}`">
        <img :src="'data:image/*;base64,' + item.ObjectData" class="w-full" alt="首页横幅" />
        <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a :href="`#slide${(index - 1 + banners.Count) % banners.Count}`" class="btn btn-circle">❮</a>
          <a :href="`#slide${(index + 1) % banners.Count}`" class="btn btn-circle">❯</a>
        </div>
      </div>
    </div>
    <div class="min-w-96 card rounded-2xl bg-white shadow-lg Border h-96">
      <div class="text-lg m-4 font-bold">
        版本更新日志
      </div>
      <div class="px-4 overflow-auto rounded-2xl">
        <div v-for="item in updateLogs.updateLogs" :key="item.ID">
          <div class="pb-4">
            <div class="flex items-center space-x-2">
              <div class="font-bold">
                {{ item.Title.split(' Version=')[0] }}
              </div>
              <span v-if="item.Title.split('Version=').length > 1" class="text-white rounded-full px-2" style="background-color: #19BE6B;">
                {{ item.Title.split('Version=')[1] }}
              </span>
            </div>
            <div class="-mx-4 overflow-hidden">
              <MdPreview :editorId="'updateLogs' + item.ID.toString()" :modelValue="item.Content" preview-only />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <dialog id="homeNotice" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">公告：{{ notice.Title }}</h3>
      <MdPreview editorId="homeNoticeContent" :modelValue="notice.Content" class="-mx-5" preview-only />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button></button>
    </form>
  </dialog>
</template>

<script lang="ts" setup name="Home">
import { onMounted, reactive, ref } from 'vue';

import { Remind } from '@icon-park/vue-next';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

import { _getBanners, _getUpdateLogs } from "@/apis/oj";
import { type BannersType, type HomeNoticeType, type UpdateLogsType } from '@/interfaces/oj';
import { ConvertTools } from '@/utils/globalFunctions';


let updateLogs = reactive<UpdateLogsType>({
  updateLogs: [],
  count: 0,
});

let notice = ref<HomeNoticeType>({
  Title: '暂无公告',
  Content: '',
  UpdatedTime: 0,
  CreatedTime: 0,
  UID: '',
})

let banners = reactive<BannersType>({
  banners: [],
  Count: 0,

  get() {
    _getBanners({})
      .then((data: any) => {
        banners.banners = data.Data;
        banners.Count = data.Count;
      })
  }
});

function getUpdateLogs() {
  _getUpdateLogs({})
    .then((data: any) => {
      updateLogs.updateLogs = data.Data;
      updateLogs.count = data.Count;
      if (updateLogs.updateLogs.filter(item => item.ID == 0).length) {
        notice.value = updateLogs.updateLogs.filter(item => item.ID == 0)[0];
        // @ts-ignore
        if (updateLogs.updateLogs.filter(item => item.ID == 0)) homeNotice.showModal();
      }
      updateLogs.updateLogs = updateLogs.updateLogs.filter(item => item.ID != 0);
    })
}


onMounted(() => {
  getUpdateLogs();
  banners.get();
})

</script>