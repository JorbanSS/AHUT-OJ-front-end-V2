<template>
  <div class="m-6"></div>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/other/oss')">
          <memory-one theme="outline" size="18" />
          OSS 对象存储
        </div>
      </li>
      <li>
        <div class="font-bold text-base btn-active">
          <notepad theme="outline" size="18"/>
          更新日志
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" onclick="addUpdateLog.showModal()" >
          <add theme="outline" size="18"/>
          新增更新日志
        </div>
      </li>
    </ul>
  </div>
  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th v-for="(item, index) in ['题目名称', '内容预览', '操作']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in updateLogs.updateLogs" :key="item.PID">
          <td>
            <div class="font-bold talbe-lg">{{ item.Title }}</div>
          </td>
          <td>
            <div class="text-sm truncate max-w-lg">{{ item.Content }}</div>
          </td>
          <td class="space-x-2">
            <button class="btn btn-sm btn-neutral" @click="updateLogs.edit(item.ID)">编辑</button>
            <button class="btn btn-sm btn-neutral" @click="updateLogs.delete(item.ID)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <dialog id="addUpdateLog" class="modal">
    <div class="modal-box max-w-5xl">
      <h3 class="font-bold text-lg mb-4">新增更新日志</h3>
      <label class="input input-bordered flex items-center gap-2">
        标题
        <input type="text" class="grow" v-model="updateLog.Title" />
      </label>
      <div class="m-6"></div>
      <MdEditor v-model="updateLog.Content" :height="500" :toolbars="markdownToolbars" />
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="updateLog.add()">确认新增</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup name="AddProblem">
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { Add, Notepad, MemoryOne } from '@icon-park/vue-next';
import { push } from 'notivue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

import { UpdateLogsType, UpdateLogType } from '@/interfaces/oj';
import { _addUpdateLog, _deleteUpdateLog, _getNoticeList } from '@/apis/oj';
import { markdownToolbars } from '@/config';

const router = useRouter();

let updateLogs = reactive<UpdateLogsType>({
  updateLogs: new Array<UpdateLogType>,
  count: 0,
  page: 1,
  limit: 20,

  get(showInfo: boolean = false) {
    _getNoticeList({})
      .then((data: any) => {
        this.updateLogs = data.Data.filter((item: UpdateLogType) => item.ID);
        this.count = this.updateLogs.length;
        for (let index = 0; index < this.updateLogs.length; index++) {
          this.updateLogs[index].Selected = false;
        }
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${this.count} 条更新日志`,
          })
        }
      })
  },

  delete(ID: number) {
    _deleteUpdateLog({}, ID)
      .then(() => {
        this.get();
        push.success({
          title: '删除成功',
          message: `删除了标题为 ${this.updateLogs.find((item) => item.ID == ID)!.Title} 的更新日志`,
        });
      })
  },

  edit(ID: number) {
    updateLog.Title = this.updateLogs.find((item) => item.ID == ID)!.Title;
    updateLog.Content = this.updateLogs.find((item) => item.ID == ID)!.Content;
    // @ts-ignore
    addUpdateLog.showModal();
  },
});

let updateLog = reactive({
  Title: '',
  Content: '',

  add() {
    let params = {
      Title: updateLog.Title,
      Content: updateLog.Content,
    };
    _addUpdateLog(params)
      .then(() => {
        this.Content = '';
        updateLogs.get(false);
        push.success({
          title: '新增成功',
          message: `新增了标题为 ${updateLog.Title} 的更新日志`,
        })
      })
  }
})

onMounted(() => {
  updateLogs.get(true);
})

</script>