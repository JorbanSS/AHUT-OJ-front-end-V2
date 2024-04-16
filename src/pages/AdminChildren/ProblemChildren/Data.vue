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
        <label class="font-bold text-base" @click="router.push('/admin/problem/edit/' + judgeFiles.PID)">
          <edit-one theme="outline" size="18" />
          编辑题目
        </label>
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
        <div class="font-bold text-base" @click="uploadFilesInput.upload()">
          <upload theme="outline" size="18" />
          上传数据
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto Border card shadow-lg bg-white p-6 max-w-5xl">
    <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept=".zip,.in,.out" multiple
      @change="uploadFilesChangeHandle" />
  </div>
  <div class="m-6"></div>
  <div class="mx-auto Border card shadow-lg bg-white max-w-5xl">
    <table class="table table-zebra mb-4 text-center">
      <thead>
        <tr>
          <th v-for="(item, index) in ['文件名', '类型', '大小', '操作']" :key="index">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in judgeFiles.judgeFiles" :key="item.FileName">
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
            <button class="btn btn-neutral btn-sm" @click="judgeFileDetail.get(item.FileName)">
              <eyes theme="outline" size="18" />
              查看
            </button>
            <button class="btn btn-neutral btn-sm" @click="judgeFiles.delete(item.FileName)">
              <delete theme="outline" size="18" />
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <dialog id="judgeFileDetailModal" class="modal">
    <div class="modal-box space-y-2 w-[500px]">
      <h3 class="font-bold text-lg">
        文件预览：{{ judgeFileDetail.FileName }}
      </h3>
      <!-- <button class="btn w-fit btn-sm btn-neutral" @click="copyData()">
        <copy theme="outline" size="18" />
        复制内容
      </button> -->
      <div class="mockup-code card shadow-lg px-6">
        <pre v-for="(item, index) in judgeFileDetail.FileContent.split('\n')"
          :data-prefix="index + 1"><code>{{ item }}</code></pre>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script lang="ts" setup name="AddProblem">
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Add, Delete, DocumentFolder, EditOne, Eyes, Data as ICONdata, Upload } from '@icon-park/vue-next';
import { push } from 'notivue';
import useClipboard from 'vue-clipboard3';

import { _deleteJudgeFiles, _getJudgeFile, _getJudgeFiles, _uploadJudgeFiles } from "@/api/problem";
import { JudgeFileDetailType, type JudgeFilesType } from '@/type/problem';

const router = useRouter();
const route = useRoute();
const { toClipboard } = useClipboard();

interface UploadFilesInputType {
  files: FileList | null,
  [item: string]: any,
}

function checkFileExtension(fileName: string): boolean {
  const parts = fileName.split('.');
  if (parts.length < 2) return false;
  const extension = parts[parts.length - 1];
  return ['in', 'out', 'zip'].includes(extension);
}

let uploadFilesInput = reactive<UploadFilesInputType>({
  files: null,

  select(files: FileList) {
    Array.from(files).forEach((file: any) => {
      if (checkFileExtension(file.name) == false) {
        push.error({
          title: '文件格式错误',
          message: '请选择 in, out, zip 格式的文件',
        })
        return;
      }
      judgeFiles.judgeFiles.forEach((file2: any) => {
        if (file.name == file2.FileName) {
          push.warning({
            title: '文件名重复',
            message: `${file.name} 已存在，上传将会覆盖原文件`,
          })
        }
      })
    })
    uploadFilesInput.files = files;
    push.success({
      title: '选择成功',
    })
  },

  upload() {
    if (uploadFilesInput.files == null || uploadFilesInput.files.length == 0) {
      push.warning({
        title: '未选择文件',
      })
      return;
    }
    Array.from(uploadFilesInput.files).forEach((file: any) => {
      let formData = new FormData();
      formData.append("file", file, file.name);
      _uploadJudgeFiles(formData, judgeFiles.PID)
        .then((data: any) => {
          judgeFiles.judgeFiles = data.Data;
          judgeFiles.Count = data.Count;
        })
        .then(() => {
          if (uploadFilesInput.files && file.name == uploadFilesInput.files[uploadFilesInput.files.length - 1].name) {
            judgeFiles.get();
          }
        })
    })
    push.success({
      title: '上传成功',
      message: `上传了 ${uploadFilesInput.files.length} 个文件`,
    });
  },
});

const uploadFilesChangeHandle = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadFilesInput.select(target.files);
  }
};

let judgeFiles = reactive<JudgeFilesType>({
  judgeFiles: [],
  PID: '',
  Count: 0,

  get(showInfo = false) {
    _getJudgeFiles({}, judgeFiles.PID)
      .then((data: any) => {
        judgeFiles.judgeFiles = data.Data;
        judgeFiles.Count = data.Count;
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `获取了题目 ${judgeFiles.PID} 的 ${judgeFiles.Count} 条数据`,
          });
        }
      })
  },

  delete(fileName: string) {
    let formData = new FormData();
    formData.append("file", fileName);
    _deleteJudgeFiles(formData, judgeFiles.PID)
      .then(() => {
        push.success({
          title: '删除成功',
          message: `${fileName}`,
        });
        judgeFiles.get();
      })
  }
})

let judgeFileDetail = reactive<JudgeFileDetailType>({
  FileName: '',
  FileContent: '',
  get(fileName: string) {
    _getJudgeFile({}, judgeFiles.PID, fileName)
      .then((data: any) => {
        this.FileName = fileName;
        this.FileContent = data.FileContent;
        // @ts-ignore
        judgeFileDetailModal.showModal();
      })
  },
});

async function copyData() {
  try {
    await toClipboard(judgeFileDetail.FileContent);
    push.success({
      title: '复制成功',
      message: '已复制文件内容到剪贴板',
    })
  } catch (e) {
    push.error({
      title: '复制失败',
    })
  }
}

onMounted(() => {
  judgeFiles.PID = route.params.PID as string;
  judgeFiles.get(true);
});

</script>

<style scoped></style>