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
        <div class="font-bold text-base">
          <upload theme="outline" size="18" />
          上传数据
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto Border card shadow-lg bg-white p-6 max-w-5xl">
    <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept=".zip,.in,.out" multiple/>
  </div>
  <div class="m-6"></div>
  <div class="mx-auto Border card shadow-lg bg-white max-w-5xl">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>文件名</th>
          <th>类型</th>
          <th>大小</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in judgeFiles.judgeFiles" :key="index" class="cursor-pointer">
          <th>
            {{ item.FileName }}
          </th>
          <td>
            {{ item.FileType }}
          </td>
          <td>
            {{ item.FileSize }} MB
          </td>
          <td>
            
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup name="AddProblem">
import { Upload, Add, DocumentFolder, Data as ICONdata } from '@icon-park/vue-next';
import { ref, reactive, onMounted } from 'vue';
import { push } from 'notivue';
import { Get, Post } from '@/utils/axios/request';
import { useRouter, useRoute } from 'vue-router';
import { type JudgeFilesType } from '@/type';

const router = useRouter();
const route = useRoute();

let judgeFiles = reactive<JudgeFilesType>({
  judgeFiles: [],
  PID: '',
  Count: 0,
})

function getJudgeFiles() {
  Get('api/file/' + judgeFiles.PID, {})
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        judgeFiles.judgeFiles = data.Data;
        judgeFiles.Count = data.Count;
        push.success({
          title: '新增成功',
          message: `题目 ID 为 ${data.PID}`,
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

onMounted(() => {
  judgeFiles.PID = route.params.PID as string;
  getJudgeFiles();
});

</script>

<style scoped></style>