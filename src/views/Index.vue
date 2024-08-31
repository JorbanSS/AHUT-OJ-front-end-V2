<template>

  <MainContainer>
    <PageHeader :Title="notice.Title" :IconName="Remind" :Infomation="notice.Content">
      <span class="text-xs text-center" v-if="notice.UpdatedTime">
        {{ ConvertTools.PrintTime(notice.UpdatedTime, 1) }}
      </span>
    </PageHeader>

    <Container direction="row" class="h-[440px]">
      <!-- 轮播图 -->
      <Card class="p-0 overflow-hidden w-3/5">
        <div class="carousel w-full h-full">
          <div class="carousel-item relative w-full" v-for="(item, index) in banners.banners" :key="index"
            :id="`slide${index}`">
            <img :src="'data:image/*;base64,' + item.ObjectData" class="w-full" alt="首页横幅" />
            <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a :href="`#slide${(index - 1 + banners.Count) % banners.Count}`" class="btn btn-circle">❮</a>
              <a :href="`#slide${(index + 1) % banners.Count}`" class="btn btn-circle">❯</a>
            </div>
          </div>
        </div>
      </Card>
      <!-- 轮播图 -->

      <!-- 更新日志 -->
      <Card class="w-2/5 overflow-auto">
        <Container direction="column">
          <span class="text-xl font-bold">
            版本更新日志
          </span>
          <div>
            <div v-for="item in updateLogs.updateLogs" :key="item.ID">
              <div class="pb-4">
                <div class="flex items-center space-x-2">
                  <span class="font-bold">
                    {{ item.Title.split(" Version=")[0] }}
                  </span>
                  <span v-if="item.Title.split('Version=').length > 1" class="text-white rounded-full px-2"
                    style="background-color: #19be6b">
                    {{ item.Title.split("Version=")[1] }}
                  </span>
                </div>
                <div class="-mx-4 overflow-hidden">
                  <MdPreview :editorId="'updateLogs' + item.ID.toString()" :modelValue="item.Content" preview-only />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Card>
      <!-- 更新日志 -->
    </Container>

  </MainContainer>

</template>

<script lang="ts" setup name="Home">
import { onMounted, reactive, ref } from "vue";

import { Remind } from "@icon-park/vue-next";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

import { _getBanners, _getUpdateLogs } from "@/apis/oj";
import {
  type BannersType,
  type HomeNoticeType,
  type UpdateLogsType,
} from "@/interfaces/oj";
import { ConvertTools } from "@/utils/globalFunctions";
import { useUserDataStore } from "@/stores/UserData";
import { useConstValStore } from "@/stores/ConstVal";
import PageHeader from "@/components/Main/PageHeader.vue";
import { push } from 'notivue';
import { _JoinGroup } from "@/apis/group";
const userDataStore = useUserDataStore();
const constValStore = useConstValStore();

let updateLogs = reactive<UpdateLogsType>({
  updateLogs: [],
  count: 0,
});

let notice = ref<HomeNoticeType>({
  Title: "公告",
  Content: "暂无",
  UpdatedTime: 0,
  CreatedTime: 0,
  UID: "",
});

let banners = reactive<BannersType>({
  banners: [],
  Count: 0,

  get() {
    _getBanners({})
      .then((data: any) => {
        banners.banners = data.Data;
        banners.Count = data.Count;
      });
  },
});

function getUpdateLogs() {
  _getUpdateLogs({})
    .then((data: any) => {
      updateLogs.updateLogs = data.Data;
      updateLogs.count = data.Count;
      if (updateLogs.updateLogs.filter((item) => item.ID == 0).length) {
        notice.value = updateLogs.updateLogs.filter((item) => item.ID == 0)[0];
      }
      updateLogs.updateLogs = updateLogs.updateLogs.filter(
        (item) => item.ID != 0
      );
    });
}

//组
let JoinGroup = ref({
  GID: 1,
  GroupName: '',
  GroupTask: '',
  UID: 1,
  CreatTime: 0,
  InviteCode: '',

  add() {
    // console.log(this.GroupName)
    if (JoinGroup.value.InviteCode == '') {
      push.error({
        title: '信息错误',
        message: '请填写邀请码',
      })
      return;
    }
    let params: any = {
      InviteCode: this.InviteCode,
    }
    
    _JoinGroup(params)
      .then(() => {
        push.success({
          title: '提示',
          message: "加入成功",
        });
      })
      this.InviteCode=''
  }
});

onMounted(() => {
  getUpdateLogs();
  banners.get();
});
</script>
