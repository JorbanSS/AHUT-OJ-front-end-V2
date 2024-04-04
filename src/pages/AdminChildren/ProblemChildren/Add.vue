<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/problem')">
          <document-folder theme="outline" size="18" />
          题目列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base btn-active">
          <add theme="outline" size="18" />
          新增题目
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="addProblem()">
          <add theme="outline" size="18" />
          确认新增
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      标题
      <input type="text" class="grow" placeholder="" v-model="problem.Title">
    </label>
    <div class="flex space-x-2">
      <label class="input input-bordered flex items-center gap-2 w-72">
        <stopwatch-start theme="outline" size="22" />
        <input type="number" class="grow" placeholder="1000" v-model="problem.limitTime" min="500" max="10000"
          step="500" />
        <span>ms</span>
      </label>
      <label class="input input-bordered flex items-center gap-2 w-72">
        <disk theme="outline" size="19" class="ml-0.5 :mr-1.5" />
        <input type="number" class="grow" placeholder="128" v-model="problem.limitMemory" min="64" max="1024"
          step="64" />
        <span>MB</span>
      </label>
    </div>
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      标签
      <input type="text" class="grow" placeholder="用英文;来分隔" v-model="problem.Label" />
    </label>
    <div class="flex space-x-2">
      <select class="select select-bordered w-72 max-w-xs text-base" v-model="problem.Origin">
        <option disabled selecte value="0">题目来源</option>
        <option value="-1">Local</option>
        <option value="1">Codeforces</option>
        <!-- <option value="2">AtCoder</option>
        <option value="3">Virtual Judge</option> -->
      </select>
      <label class="input input-bordered flex items-center gap-2 w-72" v-if="problem.Origin != -1">
        题号
        <input type="text" class="grow" placeholder="例：1069A" v-model="problem.OriginPID" />
      </label>
    </div>
    <div class="form-control w-72" @change="changeVisible()">
      <label class="label cursor-pointer">
        <span class="label-text text-base">可见性</span>
        <input type="checkbox" :checked="problem.Visible == 1" class="checkbox" />
      </label>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <select class="select select-bordered w-72 max-w-xs text-base" v-model="problem.ContentType">
      <option disabled selecte value="0">题面类型</option>
      <option value="-1">PlainText</option>
      <option value="1">MarkDown</option>
    </select>
    <div v-if="problem.ContentType == 1">
      <MdEditor v-model="problem.description" :height="500" :toolbars="markdownToolbars"
        @onUploadImg="uploadProblemImage" />
    </div>
    <div v-else>
      <label class="form-control">
        <div class="label">题目描述</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.Description"></textarea>
      </label>
      <label class="form-control">
        <div class="label">输入格式</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.Input"></textarea>
      </label>
      <label class="form-control">
        <div class="label">输出格式</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.Output"></textarea>
      </label>
      <label class="form-control">
        <div class="label">输入样例</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.SampleInput"></textarea>
      </label>
      <label class="form-control">
        <div class="label">输出样例</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.SampleOutput"></textarea>
      </label>
      <label class="form-control">
        <div class="label">提示</div>
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.description"></textarea>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup name="AddProblem">
import { Add, StopwatchStart, Disk, DocumentFolder } from '@icon-park/vue-next';
import { type ProblemType } from '@/type/problem';
import { type ImageUploadType } from '@/type/common';
import { ref, reactive } from 'vue';
import { push } from 'notivue';
import { MdEditor } from 'md-editor-v3';
import { Get, Post } from '@/utils/axios/request';
import { useRouter } from 'vue-router';
import { markdownToolbars } from '@/config';
import { ImageUtils } from '@/utils/fileUtils';
import { host } from '@/utils/axios/request';

import 'md-editor-v3/lib/style.css';

const problemImageInput = ref<File | null>(null);
const router = useRouter();

let problem = reactive<ProblemType>({
  PID: '',
  Title: '',
  Label: '',
  Visible: 1,
  Submit: 0,
  Accepted: 0,
  Description: '',
  Origin: -1,
  OriginPID: '',
  LimitMemory: 128,
  LimitTime: 1000,
  SolutionNumber: 0,
  ContentType: 1,
  Input: '',
  Output: '',
  SampleInput: '',
  SampleOutput: '',
  Hit: '',
});

function addProblem() {
  if (problem.Title == '' || problem.description == '') {
    push.error({
      title: '信息错误',
      message: '请填写完整信息',
    })
    return;
  }
  Post('api/problem/add/', {
    ContentType: problem.ContentType,
    Description: problem.description,
    Hit: problem.Hit,
    Label: problem.Label,
    LimitMemory: problem.limitMemory,
    LimitTime: problem.limitTime,
    Origin: problem.Origin,
    OriginPID: problem.OriginPID,
    Output: problem.Output,
    SampleInput: problem.Input,
    SampleOutput: problem.SampleOutput,
    Title: problem.Title,
    Visible: problem.Visible,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        problem.PID = data.PID;
        push.success({
          title: '新增成功',
          message: `题目 ID 为 ${data.PID}`,
        });
        if (problem.Origin == -1) {
          let PID = problem.PID;
          router.push({
            path: '/admin/problem/problemdata',
            query: {
              PID,
            },
          });
        }
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

function changeVisible() {
  problem.Visible = 1 - problem.Visible;
}

let imageUpload = reactive<ImageUploadType>({
  image: null,
  blob: new Blob,
  selectImage(image: File) {
    const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png"];
    imageUpload.image = image;
    if (allowedImageTypes.includes(image.type) == false) {
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

const problemImageChangeHandle = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    problemImageInput.value = target.files[0];
    imageUpload.selectImage(target.files[0]);
  }
};

function uploadProblemImage(files: any) {
  if (files.length == 0) {
    push.error({
      title: '请选择图片',
      message: '请选择一张图片',
    })
    return;
  }
  imageUpload.selectImage(files[0]);
  if (imageUpload.image == null) {
    push.error({
      title: '请选择图片',
      message: '请选择一张图片',
    })
    return;
  }
  if (ImageUtils.check(imageUpload.image) == false) {
    return;
  }
  ImageUtils.compress(imageUpload.image).
    then((res: any) => {
      imageUpload.blob = res;
      // @ts-ignore
      ImageUtils.uploadProblemImage(res, imageUpload.image.name)
        .then((res: any) => {
          let data = res;
          if (data.Code == 0) {
            let imageURL = data.ImageURL;
            problem.description += `\n\n![](/${imageURL})\n\n`;
            push.success({
              title: '插入成功',
              message: '插入图片成功',
            })
          }
        })
        .catch((err: any) => {
          console.log(err);
        })
    })
}

// const onUploadImg = async (files: any, callback: any) => {
//   console.log(1122);
//   const res = await Promise.all(
//     files.map((file: any) => {

//     })
//   );
//   callback(res.map((item) => item.data.url));
// }

</script>