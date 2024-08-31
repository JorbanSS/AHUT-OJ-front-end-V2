<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <label class="font-bold text-base" @click="$router.push({ name: 'ProblemsList' })">
          <document-folder theme="outline" size="18" />
          题目列表
        </label>
      </li>
      <li>
        <div class="font-bold text-base" @click="$router.push({ name: 'AddProblem' })">
          <add theme="outline" size="18" />
          新增题目
        </div>
      </li>
      <li>
        <label class="font-bold text-base btn-active">
          <edit-one theme="outline" size="18" />
          编辑题目
        </label>
      </li>
      <li>
        <div class="font-bold text-base" @click="$router.push({
          name: 'ProblemData',
          params: {
            PID: problem.PID
          }
        })">
          <ICONdata theme="outline" size="18" />
          编辑数据
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="problem.edit()">
          <edit-one theme="outline" size="18" />
          提交编辑
        </div>
      </li>
      <li>
        <div class="font-bold text-base hover:text-red-500" @click="problem.delete()">
          <delete-one theme="outline" size="18" hover:fill="#EC4545" />
          删除题目
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="router.push({
          name: 'Problem',
          params: {
            PID: problem.PID
          }
        })">
          <go-on theme="outline" size="18" />
          跳转题目
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <div class="flex space-x-2">
      <select class="select select-bordered w-72 max-w-xs text-base" v-model="problem.Origin">
        <option disabled selecte value="0">题目来源</option>
        <option v-for="item in problemOriginOptions" :key="item.value" :value="item.value" disabled>{{ item.label }}
        </option>
      </select>
      <label class="input input-bordered flex items-center gap-2 w-72" v-if="problem.Origin != -1">
        题号
        <input type="text" class="grow" placeholder="例：1033A" v-model="problem.OriginPID" disabled />
      </label>
    </div>
    <label class="input input-bordered flex items-center gap-2 w-72" v-if="problem.Origin == -1">
      题号
      <input type="text" class="grow" placeholder="" v-model="problem.PID" disabled>
    </label>
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      标题
      <input type="text" class="grow" placeholder="" v-model="problem.Title">
    </label>
    <div class="flex space-x-2">
      <label class="input input-bordered flex items-center gap-2 w-72">
        <stopwatch-start theme="outline" size="22" />
        <input type="number" class="grow" placeholder="1000" v-model="problem.LimitTime" min="500" max="10000"
          step="500" />
        <span>ms</span>
      </label>
      <label class="input input-bordered flex items-center gap-2 w-72">
        <disk theme="outline" size="19" class="ml-0.5 :mr-1.5" />
        <input type="number" class="grow" placeholder="128" v-model="problem.LimitMemory" min="64" max="1024"
          step="64" />
        <span>MB</span>
      </label>
    </div>
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      标签
      <input type="text" class="grow" placeholder="用英文;来分隔，赛时题目请勿加标签" v-model="problem.Label" />
    </label>
    <div class="form-control w-72">
      <label class="label cursor-pointer" v-if="problem.Origin != -1">
        <span class="label-text text-base">使用源题号</span>
        <input type="checkbox" :checked="problem.useOriginPID" class="checkbox" disabled />
      </label>
      <label class="label cursor-pointer" @change="changeVisible()">
        <span class="label-text text-base">可见性</span>
        <input type="checkbox" :checked="problem.Visible == 1" class="checkbox" />
      </label>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <select class="select select-bordered w-72 max-w-xs text-base" v-model="problem.ContentType">
      <option disabled selecte value="0">题面类型</option>
      <option v-for="item in problemContentOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
    </select>
    <div v-if="problem.ContentType == 1">
      <MdEditor v-model="problem.Description" :height="500" :toolbars="markdownToolbars"
        @onUploadImg="uploadProblemImage" />
    </div>
    <div v-else-if="problem.ContentType == -1">
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
        <textarea class="textarea textarea-bordered h-24" placeholder="" v-model="problem.Hit"></textarea>
      </label>
    </div>
    <div v-else-if="problem.ContentType == 2" class="space-x-4">
      <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept=".pdf"
        @change="problemPdfChangeHandle" />
      <button class="btn btn-neutral" @click="problemPdf.uploadProblemPdf()">上传题面 PDF</button>
      <p class="mt-2">请与 PDF 加密配套使用，建议对打印和复制同时加密，密码请使用强密码</p>
      <p class="mt-2">例如：
        <a href="https://www.cleverpdf.com/cn/encrypt-pdf" target="_blank"
          class="text-blue-500">https://www.cleverpdf.com/cn/encrypt-pdf
        </a>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup name="AddProblem">
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Add, DeleteOne, Disk, DocumentFolder, EditOne, GoOn, Data as ICONdata, StopwatchStart } from '@icon-park/vue-next';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { push } from 'notivue';

import { _deleteProblems, _editProblem, _getProblem } from '@/apis/problem';
import { markdownToolbars, problemContentOptions, problemOriginOptions, problemTypeOptions } from '@/config';
import { FileUploadType, ImageUploadType } from '@/interfaces/common';
import { type ProblemType } from '@/interfaces/problem';
import { ImageUtils } from '@/utils/fileUtils';
import { OssUtils } from '@/utils/ossUtils';

const router = useRouter();
const route = useRoute();

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
  PType: '',
  useOriginPID: false,

  get() {
    _getProblem({}, problem.PID)
      .then((data: any) => {
        problem.ContentType = data.ContentType;
        problem.Description = data.Description;
        problem.Title = data.Title;
        problem.Label = data.Label;
        problem.LimitMemory = data.LimitMemory;
        problem.LimitTime = data.LimitTime;
        problem.SolutionNumber = data.SolutionNumber;
        problem.Input = data.Input;
        problem.Output = data.Output;
        problem.SampleInput = data.SampleInput;
        problem.SampleOutput = data.SampleOutput;
        problem.Hit = data.Hit;
        problem.Origin = data.Origin;
        problem.OriginPID = data.OriginPID;
        problem.PType = data.PType;
        problem.Visible = data.Visible;

        problemTypeOptions.forEach((item: any) => {
          if (item.ptype == problem.Origin && item.value == problem.PType) {
            problem.useOriginPID = true;
          }
        })
      })
  },

  edit() {
    if (problem.Title == '' || problem.Description == '') {
      push.error({
        title: '信息错误',
        message: '请填写完整信息',
      })
      return;
    }
    let params = {
      PID: problem.PID,
      ContentType: +problem.ContentType,
      Description: problem.Description,
      Hit: problem.Hit,
      Label: problem.Label,
      LimitMemory: problem.LimitMemory,
      LimitTime: problem.LimitTime,
      Origin: problem.Origin,
      OriginPID: problem.OriginPID,
      Input: problem.Input,
      Output: problem.Output,
      Sample_input: problem.SampleInput,
      Sample_output: problem.SampleOutput,
      Title: problem.Title,
      Visible: problem.Visible,
      PType: problem.PType,
    };
    _editProblem(params)
      .then(() => {
        push.success({
          title: '编辑成功',
          message: `题目 ID 为 ${problem.PID}`,
        });
      })
  },

  delete() {
    let params = {
      PIDs: [problem.PID],
    };
    _deleteProblems(params)
      .then(() => {
        router.push({ name: 'ProblemList' });
        push.success({
          title: '删除成功',
          message: `一共删除了 1 个题目`,
        });
      })
  },
});

function changeVisible() {
  if (problem.Visible == 0) problem.Visible = -1;
  problem.Visible = -problem.Visible;
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
  }
})

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
  ImageUtils.compress(imageUpload.image)
    .then((res: any) => {
      imageUpload.blob = res;
      OssUtils.uploadProblemImage(res)
        .then((data: any) => {
          problem.Description += `\n\n![](/oss/problem-images/${data})\n\n`;
          push.success({
            title: '插入成功',
            message: `压缩后为 ${Math.round(res.size / 1024)} KB`,
          })
        })
    })
}

let problemPdf = reactive<FileUploadType>({
  file: null,
  selectFile(file: File) {
    const allowedFileTypes = ["application/pdf"];
    this.file = file;
    if (allowedFileTypes.includes(file.type) == false) {
      push.error({
        title: '文件格式错误',
        message: '请选择 PDF 格式的文件',
      })
      return;
    }
    push.success({
      title: '选择成功',
      message: '已选择',
    })
  },

  uploadProblemPdf() {
    if (this.file == null) {
      push.warning({
        title: '请选择文件',
      })
      return;
    }
    OssUtils.uploadObject(this.file, "problem-pdfs", "")
      .then((data: any) => {
        if (this.file == null) return;
        push.success({
          title: '上传成功',
          message: `文件 ${this.file.name} 大小为 ${Math.round(this.file.size / 1024)} KB`,
        })
        problem.Description = data.UpInfo.Key;
      })
  }
})

const problemPdfChangeHandle = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    problemPdf.selectFile(target.files[0]);
  }
};

onMounted(() => {
  problem.PID = route.params.PID as string;
  problem.get();
})

</script>