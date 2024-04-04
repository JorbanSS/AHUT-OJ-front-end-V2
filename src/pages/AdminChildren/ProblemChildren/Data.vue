<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <label class="font-bold text-base" @click="router.push('/admin/problem')">
          <document-folder theme="outline" size="18" />
          题目列表
        </label>
      </li>
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/problem/add')">
          <add theme="outline" size="18" />
          新增题目
        </div>
      </li>
      <li>
        <label class="font-bold text-base btn-active">
          <ICONdata theme="outline" size="18" />
          编辑数据
        </label>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="uploadJudgeFile()">
          <upload theme="outline" size="18" />
          上传数据
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto Border card shadow-lg bg-white p-6 max-w-5xl">
    <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept=".zip,.in,.out" multiple
      @change="judgeFiles.selectFile()" />
  </div>
  <div class="m-6"></div>
  <div class="mx-auto Border card shadow-lg bg-white max-w-5xl">
    <table class="table table-zebra mb-4 text-center">
      <thead>
        <tr>
          <!-- <th><input type="checkbox" :checked="allSelected" class="checkbox" @click="switchAllSelectedStatus()"></th> -->
          <th v-for="(item, index) in ['文件名', '类型', '大小', '操作']" :key="index">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in judgeFiles.judgeFiles" :key="item.PID" @click="switchSelectedStatus(index)"
          class="cursor-pointer">
          <!-- <td>
            <input type="checkbox" :checked="item.Selected == true" class="checkbox" />
          </td> -->
          <th>
            {{ item.FileName }}
          </th>
          <td>
            {{ item.FileType }}
          </td>
          <td>
            {{ item.FileSize }} MB
          </td>
          <td class="space-x-2">
            <button class="btn btn-neutral btn-sm">
              <eyes theme="outline" size="18" @click="" />
              查看
            </button>
            <button class="btn btn-neutral btn-sm" @click="deleteJudgeFile(index)">
              <delete theme="outline" size="18" />
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup name="AddProblem">
import { Upload, Add, DocumentFolder, Data as ICONdata, Delete, Eyes } from '@icon-park/vue-next';
import { ref, reactive, onMounted } from 'vue';
import { push } from 'notivue';
import { Get, Post, Del } from '@/utils/axios/request';
import { useRouter, useRoute } from 'vue-router';
import { type JudgeFilesType } from '@/type/problem';
import { FileUtils } from '@/utils/fileUtils';

const router = useRouter();
const route = useRoute();

let uploadFiles = reactive<Array<File>>(
  [],
);

let judgeFiles = reactive<JudgeFilesType>({
  judgeFiles: [],
  PID: '',
  Count: 0,
  selectFile(files: any) {
    console.log(11212, files);
    
    const allowedFileTypes = [".in", ".out", ".zip"];
    files.forEach((file: File) => {
      if (allowedFileTypes.includes(file.type) == false) {
        push.error({
          title: '文件格式错误',
          message: '请选择 in, out, zip 格式的文件',
        })
        return;
      }
      judgeFiles.forEach((file2: any) => {
        if (file.name == file2.FileName) {
          push.error({
            title: '文件名重复',
            message: `${file.name} 已存在，上传将会覆盖原文件`,
          })
        }
      })
      uploadFiles.push(file);
    })
    push.success({
      title: '选择成功',
      // message: '已选择',
    })
  }
})

let allSelected = ref<boolean>(false);

function switchSelectedStatus(index: number) {
  judgeFiles.judgeFiles[index].Selected = !judgeFiles.judgeFiles[index].Selected;
}

function switchAllSelectedStatus(status?: boolean) {
  if (status == undefined) {
    allSelected.value = !allSelected.value;
  }
  else {
    allSelected.value = status;
  }
  for (let i = 0; i < judgeFiles.judgeFiles.length; i++) {
    judgeFiles.judgeFiles[i].Selected = allSelected.value;
  }
}

function uploadJudgeFile() {
  console.log(uploadFiles);
  
  if (uploadFiles.length == 0) {
    push.error({
      title: '未选择文件',
      // message: '请选择文件',
    })
    return;
  }
  uploadFiles.forEach((file: File) => {
    FileUtils.uploadProblemData(file, judgeFiles.PID)
      .then((res: any) => {
        let data = res.data;
        if (data.Code == 0) {
          judgeFiles.judgeFiles = data.Data;
          judgeFiles.Count = data.Count;
          push.success({
            title: '上传成功',
            message: `上传了 ${uploadFiles.length} 个文件`,
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
  })
}

function getJudgeFiles() {
  Get('api/file/' + judgeFiles.PID, {})
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        judgeFiles.judgeFiles = data.Data;
        judgeFiles.Count = data.Count;
        push.success({
          title: '获取成功',
          message: `获取了题目 ${judgeFiles.PID} 的 ${judgeFiles.Count} 条数据`,
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

function deleteJudgeFile(index: number) {
  let fileName = judgeFiles.judgeFiles[index].FileName;
  let formData = new FormData();
  formData.append('file', fileName);
  Del('api/file/' + judgeFiles.PID, formData, 1)
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        push.success({
          title: '删除成功',
          // message: ``,
        });
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

onMounted(() => {
  judgeFiles.PID = route.params.PID as string;
  getJudgeFiles();
});

</script>

<style scoped></style>