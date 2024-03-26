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
        <button class="btn btn-neutral">编辑首页公告</button>
        <button class="btn btn-neutral">编辑更新日志</button>
      </div>
      <div class="card Border bg-white shadow-lg p-6 w-fit">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">新增首页图片（限展示三张，新增的会覆盖旧的）</span>
          </div>
          <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept="image/*"
            @change="handleImageChange" />
        </label>
        <div class="m-1"></div>
        <button class="btn btn-neutral" @click="uploadImage()">上传图片</button>
      </div>
    </div>
    <div class="space-y-6 col-span-4">
      <div class="card Border bg-white shadow-lg p-6 w-full space-y-2">
        <label class="input input-bordered flex items-center gap-2">
          记录号
          <input type="text" class="grow" placeholder="">
        </label>
        <button class="btn btn-neutral">重判</button>
      </div>
    </div>
  </div>
  <div class="m-6"></div>
</template>

<script lang="ts" setup name="Training">
import { Peoples, UploadLogs, PreviewOpen, History, DocumentFolder } from '@icon-park/vue-next'
import { push } from 'notivue';
import { ref } from 'vue';
import { Post } from '@/utils/axios/request';

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

function uploadImage() {
  Post('api/notice/images/', {

  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {

        push.success({
          title: '上传成功',
          message: '上传首页图片成功',
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

</script>

<style scoped></style>