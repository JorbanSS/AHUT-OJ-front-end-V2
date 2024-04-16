<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/problemlist')">
          <bill theme="outline" size="18" />
          题单列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base btn-active">
          <add theme="outline" size="18" />
          新增题单
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="problemList.add()">
          <add theme="outline" size="18" />
          确认新增
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      标题
      <input type="text" class="grow" v-model="problemList.Title">
    </label>
    <!-- <div class="form-control w-72" @change="changePublic()">
      <label class="label cursor-pointer">
        <span class="label-text text-base">可见性</span>
        <input type="checkbox" :checked="problemList.IsPublic == 1" class="checkbox" />
      </label>
    </div> -->
  </div>
  <div class="m-6"></div>
  <div class="card bg-white shadow-lg Border max-w-5xl mx-auto pb-6">
    <div class="text-2xl px-6 pt-6">
      <div class="join">
        <input class="input input-bordered join-item" placeholder="题号" v-model="problem.PID" />
        <button class="btn join-item btn-neutral" @click="problem.add()">添加题目</button>
      </div>
    </div>
    <div class="mb-4"></div>
    <div class="px-6 pb-2">拖拽题目可以排序</div>
    <VueDraggable ref="el" v-model="list" target=".sort-target" :animation="200" class="select-none">
      <table class="table table-zebra text-center">
        <thead>
          <tr>
            <th>序号</th>
            <th>题号</th>
            <th>题目名称</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="sort-target">
          <tr v-for="(item, index) in list" :key="item.PID" class="cursor-pointer" v-auto-animate>
            <th class="w-32">
              {{ ConvertTools.Number2Alpha(index + 1) }}
            </th>
            <th class="w-48">
              {{ item.PID }}
            </th>
            <td class="w-96">
              {{ item.Title }}
            </td>
            <td class="w-96">
              <button class="btn btn-neutral btn-sm" @click="problem.delete(index)">
                <delete-one theme="outline" size="16" />
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </VueDraggable>
  </div>
  <div class="mt-6"></div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <span class="text-base">题单描述（含题单简介、题目说明、每题的出题人）</span>
    <MdEditor v-model="problemList.Description" :height="500" />
  </div>
</template>

<script lang="ts" setup name="addProblemList">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Add, Bill, DeleteOne } from '@icon-park/vue-next';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { push } from 'notivue';
import { VueDraggable } from 'vue-draggable-plus';

import { _getProblem } from '@/api/problem';
import { _addProblemList } from "@/api/problemList";
import { useUserDataStore } from '@/store/UserData';
import { type ProblemListType } from '@/type/problemList';
import { ConvertTools } from '@/utils/globalFunctions';
const userDataStore = useUserDataStore();
const router = useRouter();

interface ProblemType {
  PID: string,
  Title: string,
  [item: string]: any,
};

let problem = reactive<ProblemType>({
  PID: '',
  Title: '',

  add() {
    if (this.PID == '') {
      push.warning({
        title: '信息错误',
        message: '未输入题号',
      });
      return;
    }
    for (let item in list.value) {
      if (list.value[item].PID == this.PID) {
        push.warning({
          title: '信息错误',
          message: '该题目已添加，不可重复添加',
        });
        return;
      }
    }
    _getProblem({}, this.PID)
      .then((data: any) => {
        this.Title = data.Title;
        list.value.push({
          PID: this.PID,
          Title: this.Title,
        });
      })
  },

  delete(index: number) {
    push.success({
      title: '删除成功',
      message: `已成功删除题目 ${list.value[index].PID}`,
    });
    list.value.splice(index, 1);
  },
})

let list = ref<Array<ProblemType>>([]);

let problemList = reactive<ProblemListType>({
  Problems: '',
  LID: 0,
  Size: 0,
  Title: '',
  Description: '',
  UID: '',
  Type: 1,

  add() {
    if (problemList.Title == '' || problemList.Description == '') {
      push.error({
        title: '信息错误',
        message: '请填写完整信息',
      });
      return;
    }
    if (list.value.length == 0) {
      push.error({
        title: '信息错误',
        message: '还未添加题目',
      });
      return;
    }
    let listStr = '';
    for (let i = 0; i < list.value.length; i++) {
      if (i) listStr += ',';
      listStr += list.value[i].PID;
    }
    let params = {
      Description: problemList.description,
      Title: problemList.Title,
      Problems: listStr,
    }
    _addProblemList(params)
      .then((data: any) => {
        problemList.LID = data.LID;
        push.success({
          title: '新增成功',
          message: `题单号为 ${data.LID}`,
        });
      })
  },
})

</script>