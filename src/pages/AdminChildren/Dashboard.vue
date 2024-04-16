<template>
  <div class="m-6"></div>
  <div class="card shadow-lg Border max-w-5xl mx-auto bg-white">
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-value flex">
          <peoples theme="outline" size="28" class="mt-2 mr-2" />
          {{ ojStastics.UserNumber }}
        </div>
        <div class="stat-title ml-9">累积注册量</div>
      </div>
      <div class="stat">
        <div class="stat-value flex">
          <history theme="outline" size="28" class="mt-2 mr-2" />
          {{ ojStastics.TotalSubmit }}
        </div>
        <div class="stat-title ml-9">累积提交数</div>
      </div>
      <div class="stat">
        <div class="stat-value flex">
          <preview-open theme="outline" size="32" class="mt-2 mr-2" />
          123
        </div>
        <div class="stat-title ml-10">当日访问量</div>
      </div>
      <div class="stat">
        <div class="stat-value flex">
          <upload-logs theme="outline" size="28" class="mt-2 mr-2" />
          {{ ojStastics.TodaySubmit }}
        </div>
        <div class="stat-title ml-9">当日提交数</div>
      </div>
      <div class="stat">
        <div class="stat-value flex">
          <document-folder theme="outline" size="28" class="mt-2 mr-2" />
          {{ ojStastics.ProblemNumber }}
        </div>
        <div class="stat-title ml-9">题库题目数</div>
      </div>
    </div>
  </div>
  <div class="m-6"></div>
  <div class="grid grid-cols-12 gap-6 max-w-5xl mx-auto">
    <div class="space-y-6 col-span-4">
      <div class="card Border bg-white shadow-lg p-6 w-full space-y-2">
        <button class="btn btn-neutral" @click="showEditHomeNoticeModal()">编辑首页公告</button>
        <button class="btn btn-neutral" @click="editUpdateLogs()">编辑更新日志</button>
      </div>
      <div class="card Border bg-white shadow-lg p-6 w-fit">
        <label class="form-control w-full max-w-xs">
          <div class="mb-2">
            <span class="">新增首页图片</span>
          </div>
          <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept=".jpg,.jpeg,.png"
            @change="bannerImageChangeHandle" />
        </label>
        <div class="m-1"></div>
        <button class="btn btn-neutral" @click="uploadBanner()">上传图片</button>
      </div>
    </div>
    <div class="space-y-6 col-span-4">
      <div class="card Border bg-white shadow-lg p-6 w-full space-y-2">
        <label class="input input-bordered flex items-center gap-2">
          记录号
          <input type="text" class="grow" placeholder="" v-model="rejudgeInfo.SID">
        </label>
        <label class="input input-bordered flex items-center gap-2">
          用户号
          <input type="text" class="grow" placeholder="" v-model="rejudgeInfo.UID">
        </label>
        <label class="input input-bordered flex items-center gap-2">
          题号
          <input type="text" class="grow" placeholder="" v-model="rejudgeInfo.PID">
        </label>
        <label class="input input-bordered flex items-center gap-2">
          比赛号
          <input type="text" class="grow" placeholder="" v-model="rejudgeInfo.CID">
        </label>
        <button class="btn btn-neutral" @click="rejudgeInfo.rejudge()">重判</button>
      </div>
    </div>
    <div class="space-y-6 col-span-4">
      <div class="card Border bg-white shadow-lg p-6 w-full space-y-2">
        <div class="flex">
          <google theme="outline" size="22" />
          <a class="ml-3 font-bold link link-hover"
            href="https://analytics.google.com/analytics/web/?authuser=0#/p435571736/realtime/overview"
            target="_blank">已接入
            Google Analytics</a>
        </div>
      </div>
    </div>
  </div>
  <div class="m-6"></div>
  <dialog id="mdEditor" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">主页公告编辑</h3>
      <label class="input input-bordered flex items-center gap-2 mb-2">
        标题
        <input type="text" class="grow" placeholder="" v-model="homeNotice.Title">
      </label>
      <MdEditor v-model="homeNotice.Content" :height="500" :toolbars="markdownToolbars" />
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消修改</button>
          <button class="btn btn-neutral" @click="homeNotice.edit()">提交修改</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup name="Training">
import { onMounted, reactive, ref } from 'vue';

import { DocumentFolder, Google, History, Peoples, PreviewOpen, UploadLogs } from '@icon-park/vue-next';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { push } from 'notivue';

import { _editHomeNotice, _getHomeNotice, _getOjStastics } from '@/api/oj';
import { _rejudge } from '@/api/record';
import { markdownToolbars } from '@/config';
import { type ImageUploadType } from '@/type/common';
import { type HomeNoticeType, type OjStasticsType } from '@/type/oj';
import { type RejudgeInfoType } from '@/type/record';
import { ImageUtils } from '@/utils/fileUtils';
import { OssUtils } from "@/utils/ossUtils";

let bannerImageInput = ref<File | null>(null);

let rejudgeInfo = reactive<RejudgeInfoType>({
  SID: 0,
  UID: '',
  PID: '',
  CID: 0,

  rejudge() {
    let params: RejudgeInfoType = {};
    if (rejudgeInfo.SID == 0 && rejudgeInfo.CID == 0 && rejudgeInfo.UID == '' && rejudgeInfo.PID == '') {
      push.warning({
        title: '信息错误',
        message: '请填写至少一项信息',
      });
      return;
    }
    if (rejudgeInfo.SID) params.SID = +rejudgeInfo.SID;
    if (rejudgeInfo.UID) params.UID = rejudgeInfo.UID;
    if (rejudgeInfo.PID) params.PID = rejudgeInfo.PID;
    if (rejudgeInfo.CID) params.CID = +rejudgeInfo.CID;
    _rejudge(params)
      .then(() => {
        push.success({
          title: '操作成功',
          message: '已开始重新判题',
        });
      })
  },
});

let banner = reactive<ImageUploadType>({
  image: null,
  blob: new Blob,
  selectImage(image: File) {
    const allowedBannerTypes = ["image/jpg", "image/jpeg", "image/png"];
    this.image = image;
    if (allowedBannerTypes.includes(image.type) == false) {
      push.error({
        title: '图片格式错误',
        message: '请选择 jpg 或 png 格式的图片',
      })
      return;
    }
    push.success({
      title: '选择成功',
      message: '已选择',
    })
  }
})

const bannerImageChangeHandle = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    // bannerImageInput.value = target.files[0];
    banner.selectImage(target.files[0]);
  }
};

function uploadBanner() {
  if (banner.image == null) {
    push.warning({
      title: '请选择图片',
    })
    return;
  }
  if (ImageUtils.check(banner.image) == false) {
    return;
  }
  ImageUtils.compress(banner.image).
    then((res: any) => {
      banner.blob = res;
      // @ts-ignore
      OssUtils.uploadBannerImage(res, banner.image.name);
    })
    .catch((err: any) => {
      console.log(err);
    })
}

let homeNotice = reactive<HomeNoticeType>({
  Content: '',
  Title: '',
  UpdatedTime: 0,
  CreatedTime: 0,
  UID: '',

  get() {
    _getHomeNotice({})
      .then((data: any) => {
        homeNotice.Content = data.Content;
        homeNotice.CreatedTime = data.CreatedTime;
        homeNotice.Title = data.Title;
        homeNotice.UpdatedTime = data.UpdatedTime;
        homeNotice.UID = data.UID;
      })
  },

  edit() {
    let params = {
      Content: homeNotice.Content,
      Title: homeNotice.Title,
    };
    _editHomeNotice(params)
      .then(() => {
        push.success({
          title: '修改成功',
          message: '修改主页公告成功',
        })
      })
  },
})

function showEditHomeNoticeModal() {
  homeNotice.get();
  // @ts-ignore
  mdEditor.showModal();
}

let ojStastics = reactive<OjStasticsType>({
  UserNumber: 0,
  TotalSubmit: 0,
  TodaySubmit: 0,
  ProblemNumber: 0,
  get() {
    _getOjStastics({})
      .then((data: any) => {
        ojStastics.UserNumber = data.UserNumber;
        ojStastics.TotalSubmit = data.TotalSubmit;
        ojStastics.TodaySubmit = data.TodaySubmit;
        ojStastics.ProblemNumber = data.ProblemNumber;
      })
  },
})

function editUpdateLogs() {

}

onMounted(() => {
  ojStastics.get();
})

</script>