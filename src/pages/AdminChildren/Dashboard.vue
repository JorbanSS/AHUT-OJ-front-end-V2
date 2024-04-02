<template>
  <div class="m-6"></div>
  <div class="card shadow-lg Border max-w-5xl mx-auto bg-white">
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-value flex">
          <peoples theme="outline" size="28" class="mt-2 mr-2" />
          581
        </div>
        <div class="stat-title ml-9">累积注册量</div>
      </div>
      <div class="stat">
        <div class="stat-value flex">
          <history theme="outline" size="28" class="mt-2 mr-2" />
          26657
        </div>
        <div class="stat-title ml-9">累积提交数</div>
      </div>
      <div class="stat">
        <div class="stat-value flex">
          <preview-open theme="outline" size="32" class="mt-2 mr-2" />
          402
        </div>
        <div class="stat-title ml-10">当日访问量</div>
      </div>
      <div class="stat">
        <div class="stat-value flex">
          <upload-logs theme="outline" size="28" class="mt-2 mr-2" />
          12
        </div>
        <div class="stat-title ml-9">当日提交数</div>
      </div>
      <div class="stat">
        <div class="stat-value flex">
          <document-folder theme="outline" size="28" class="mt-2 mr-2" />
          3026
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
            :on-change="banner.selectImage" />
        </label>
        <div class="m-1"></div>
        <button class="btn btn-neutral" @click="uploadBanner()">上传图片</button>
      </div>
    </div>
    <div class="space-y-6 col-span-4">
      <div class="card Border bg-white shadow-lg p-6 w-full space-y-2">
        <label class="input input-bordered flex items-center gap-2">
          记录号
          <input type="number" class="grow" placeholder="" v-model="rejudgeInfo.SID">
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
          <input type="number" class="grow" placeholder="" v-model="rejudgeInfo.CID">
        </label>
        <button class="btn btn-neutral" @click="rejudge()">重判</button>
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
      <MdEditor v-model="homeNotice.Content" :height="500" />
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消修改</button>
          <button class="btn btn-neutral" @click="editHomeNotice()">提交修改</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup name="Training">
import { Peoples, UploadLogs, PreviewOpen, History, DocumentFolder } from '@icon-park/vue-next'
import { push } from 'notivue';
import { reactive, ref } from 'vue';
import { Post, Get, Put } from '@/utils/axios/request';
import { RejudgeInfoType } from '@/type';
import { MdEditor } from 'md-editor-v3';
import { type HomeNoticeType } from '@/type';

import 'md-editor-v3/lib/style.css';
import { ImageUtils } from '@/utils/fileUtils';

let rejudgeInfo = reactive<RejudgeInfoType>({
  SID: 0,
  UID: '',
  PID: '',
  CID: 0,
});

function rejudge() {
  let params: RejudgeInfoType = {};
  if (rejudgeInfo.SID == 0 && rejudgeInfo.CID == 0 && rejudgeInfo.UID == '' && rejudgeInfo.PID == '') {
    push.warning({
      title: '信息错误',
      message: '请填写至少一项信息',
    });
    return;
  }
  if (rejudgeInfo.SID) params.SID = rejudgeInfo.SID;
  if (rejudgeInfo.UID) params.UID = rejudgeInfo.UID;
  if (rejudgeInfo.PID) params.PID = rejudgeInfo.PID;
  if (rejudgeInfo.CID) params.CID = rejudgeInfo.CID;
  Post('api/submit/rejudge/', params)
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        push.success({
          title: '操作成功',
          message: '已开始重新判题',
        });
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

const imagePreview = ref<string | null>(null);

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        imagePreview.value = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }
};


let banner = reactive({
  image: null,
  blob: new Blob,
  selectImage(image: File) {
    const allowedBannerTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (allowedBannerTypes.includes(image.type) == false) {
      push.error({
        title: '图片格式错误',
        message: '请选择 jpg 或 png 格式的图片',
      })
      return;
    }
  }
})

function uploadBanner() {
  if (banner.image == null) {
    push.error({
      title: '请选择图片',
      message: '请选择一张图片',
    })
    return;
  }
  if (ImageUtils.check(banner.image) == false) {
    return;
  }
  ImageUtils.compress(banner.image).then((res: any) => {
    banner.blob = res.data;
    ImageUtils.uploadBannerImage(banner.blob);
  })
  // Post('api/notice/images/', {

  // })
  //   .then((res: any) => {
  //     let data = res.data;
  //     if (data.Code == 0) {

  //       push.success({
  //         title: '上传成功',
  //         message: '上传首页图片成功',
  //       });
  //     }
  //     else {
  //       push.error({
  //         title: `Error: ${data.Code}`,
  //         message: `${data.Msg}`,
  //       })
  //     }
  //   })
  //   .catch((err: any) => {
  //     console.log(err);
  //   })
}

let homeNotice = reactive<HomeNoticeType>({
  Content: '',
  Title: '',
  UpdatedTime: 0,
  CreatedTime: 0,
  UID: '',
})

function showEditHomeNoticeModal() {
  Get('api/notice/0', {})
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        homeNotice.Content = data.Content;
        homeNotice.CreatedTime = data.CreatedTime;
        homeNotice.Title = data.Title;
        homeNotice.UpdatedTime = data.UpdatedTime;
        homeNotice.UID = data.UID;
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
  // @ts-ignore
  mdEditor.showModal();
}

function editHomeNotice() {
  Put('api/notice/0', {
    Content: homeNotice.Content,
    Title: homeNotice.Title,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        push.success({
          title: '修改成功',
          message: '修改主页公告成功',
        })
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

function editUpdateLogs() {

}

</script>

<style scoped></style>