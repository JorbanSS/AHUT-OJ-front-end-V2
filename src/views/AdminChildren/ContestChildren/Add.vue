<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="router.push({ name: 'ContestList' })">
          <trophy theme="outline" size="18" />
          比赛列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base btn-active">
          <add theme="outline" size="18" />
          新增比赛
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="contest.add()">
          <add theme="outline" size="18" />
          确认新增
        </div>
      </li>
    </ul>
  </div>
  <div class="mx-auto p-6 card shadow-lg Border bg-white space-y-4 text-base whitespace-nowrap max-w-5xl">
    <label class="input input-bordered flex items-center gap-2 w-[584px]">
      标题
      <input type="text" class="grow" placeholder="" v-model="contest.Title">
    </label>
    <div class="flex space-x-4">
      <input type="datetime-local" id="datetime" name="datetime" v-model="beginTime"
        class="input input-bordered flex items-center gap-2 w-56" />
      <arrow-right theme="outline" size="18" class="my-auto" />
      <input type="datetime-local" id="datetime" name="datetime" v-model="endTime"
        class="input input-bordered flex items-center gap-2 w-56" />
    </div>
    <select class="select select-bordered w-72 max-w-xs text-base" v-model="contest.Type">
      <option disabled selecte value="0">赛制</option>
      <option value="1">ICPC</option>
      <option value="2">OI</option>
      <!-- <option value="1">CodeForces</option> -->
      <!-- <option value="2">AtCoder</option>
        <option value="3">Virtual Judge</option> -->
    </select>
    <div class="form-control w-72" @change="contest.changePublic()">
      <label class="label cursor-pointer">
        <span class="label-text text-base">可见性</span>
        <input type="checkbox" :checked="contest.IsPublic == 1" class="checkbox" />
      </label>
    </div>
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
    <span class="text-base">比赛描述（含比赛简介、题目说明、每题的出题人）</span>
    <MdEditor v-model="contest.Description" :height="500" />
  </div>
</template>

<script lang="ts" setup name="addcontest">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Add, ArrowRight, DeleteOne, Trophy } from '@icon-park/vue-next';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { push } from 'notivue';
import { VueDraggable } from 'vue-draggable-plus';

import { _addContest } from '@/apis/contest';
import { _getProblem } from '@/apis/problem';
import { useUserDataStore } from '@/stores/UserData';
import { type ContestType } from '@/interfaces/contest';
import { ConvertTools } from '@/utils/globalFunctions';

const userDataStore = useUserDataStore();
const router = useRouter();

let beginTime = ref<string>();
let endTime = ref<string>();

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

let contest = reactive<ContestType>({
  Problems: '',
  CID: 0,
  BeginTime: 0,
  EndTime: 0,
  IsPublic: 1,
  Size: 0,
  Title: '',
  Duration: 0,
  Description: '',
  Contests: '',
  UID: '',
  Type: 1,
  Pass: '',
  Status: 0,

  add() {
    if (contest.Title == '' || contest.Description == '' || beginTime.value == undefined || endTime.value == undefined) {
      push.warning({
        title: '信息错误',
        message: '请填写完整信息',
      });
      return;
    }
    if (list.value.length == 0) {
      push.warning({
        title: '信息错误',
        message: '还未添加题目',
      });
      return;
    }
    contest.BeginTime = new Date(beginTime.value).getTime();
    contest.EndTime = new Date(endTime.value).getTime();
    if (contest.BeginTime >= contest.EndTime) {
      push.error({
        title: '信息错误',
        message: '终止时间不能早于或等于起始时间',
      });
      return;
    }
    let listStr = '';
    for (let i = 0; i < list.value.length; i++) {
      if (i) listStr += ',';
      listStr += list.value[i].PID;
    }
    let params = {
      BeginTime: contest.BeginTime,
      EndTime: contest.EndTime,
      IsPublic: contest.IsPublic,
      Description: contest.Description,
      Title: contest.Title,
      Pass: contest.Pass,
      Problems: listStr,
      Type: +contest.Type,
      UID: userDataStore.UID,
    }
    _addContest(params)
      .then((data: any) => {
        contest.CID = data.CID;
        push.success({
          title: '新增成功',
          message: `比赛 ID 为 ${data.CID}`,
        });
        router.push({
          name: 'Contest',
          params: {
            CID: data.CID,
          },
        });
      })
  },

  changePublic() {
    contest.IsPublic = 1 - contest.IsPublic;
  }
})

</script>