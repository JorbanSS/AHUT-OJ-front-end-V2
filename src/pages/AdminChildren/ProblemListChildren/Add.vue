<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/problemlist')">
          <trophy theme="outline" size="18" />
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
        <div class="font-bold text-base" @click="addContest()">
          <add theme="outline" size="18" />
          确认新增
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      标题
      <input type="text" class="grow" placeholder="" v-model="problemList.Title">
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
        <input class="input input-bordered join-item" placeholder="题号" v-model="PID" />
        <button class="btn join-item btn-neutral" @click="addProblem()">添加题目</button>
      </div>
    </div>
    <div class="mb-4"></div>
    <VueDraggable ref="el" v-model="list" target=".sort-target" :animation="200" class="select-none">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>题号（拖拽表格行可以排序）</th>
            <!-- <th>题目名称</th>
          <th>标签</th> -->
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
              <button class="btn btn-neutral btn-sm" @click="deleteProblem(index)">
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
    <MdEditor v-model="problemList.description" :height="500" />
  </div>
</template>

<script lang="ts" setup name="addProblemList">
import { Add, Trophy, ArrowRight, DeleteOne } from '@icon-park/vue-next';
import { type ProblemListType } from '@/type';
import { reactive, ref } from 'vue';
import { push } from 'notivue';
import { MdEditor } from 'md-editor-v3';
import { Get, Post } from '@/utils/axios/request';
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/store/UserData';
import { VueDraggable } from 'vue-draggable-plus'
import 'md-editor-v3/lib/style.css';
import { ConvertTools } from '@/assets/ts/globalFunctions';

const userDataStore = useUserDataStore();
const router = useRouter();

let PID = ref<string>();

interface List {
  PID: string,
  Title: string,
};

const list = ref<Array<List>>([]);

let problemList = reactive<ProblemListType>({
  problems: '',
  LID: 0,
  // IsPublic: 1,
  Size: 0,
  Title: '',
  description: '',
  UID: '',
  Type: 1,
  // Pass: '',
})

function addProblem() {
  if (PID.value == null) {
    push.warning({
      title: '信息错误',
      message: '未输入题号',
    });
    return;
  }
  for (let item in list.value) {
    if (list.value[item].PID == PID.value) {
      push.warning({
        title: '信息错误',
        message: '该题目已添加，不可重复添加',
      });
      return;
    }
  }
  Get('api/problem/' + PID.value, {})
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        list.value.push({
          PID: data.PID,
          Title: data.Title,
        })
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        });
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function deleteProblem(index: number) {
  push.success({
    title: '删除成功',
    message: `已成功删除题目 ${list.value[index].PID}`,
  });
  list.value.splice(index, 1);
}

function addContest() {
  if (problemList.Title == '' || problemList.description == '') {
    push.error({
      title: '信息错误',
      message: '请填写完整信息',
    });
    return;
  }
  console.log(list.value.length);
  
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
  Post('api/training/add/', {
    IsPublic: problemList.IsPublic,
    Description: problemList.description,
    Title: problemList.Title,
    // Pass: problemList.Pass,
    Problems: listStr,
    // Type: +problemList.Type,
    UID: userDataStore.UID,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        problemList.LID = data.LID;
        push.success({
          title: '新增成功',
          message: `题单 ID 为 ${data.LID}`,
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

function changePublic() {
  problemList.IsPublic = 1 - problemList.IsPublic;
}

</script>

<style scoped></style>