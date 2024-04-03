<template>
  <div class="py-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/contest')">
          <trophy theme="outline" size="18" />
          比赛列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/contest/add')">
          <add theme="outline" size="18" />
          新增比赛
        </div>
      </li>
      <li>
        <div class="font-bold text-base btn-active">
          <edit-one theme="outline" size="18" />
          编辑比赛
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base" @click="editContest()">
          <edit-one theme="outline" size="18" />
          提交编辑
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
    <div class="form-control w-72" @change="changePublic()">
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
    <span class="text-base">比赛描述（含比赛简介、题目说明、每题的出题人）</span>
    <MdEditor v-model="contest.description" :height="500" />
  </div>
</template>

<script lang="ts" setup name="addcontest">
import { Add, Trophy, ArrowRight, DeleteOne, EditOne } from '@icon-park/vue-next';
import { type ContestType } from '@/type/contest';
import { reactive, ref, onMounted } from 'vue';
import { push } from 'notivue';
import { MdEditor } from 'md-editor-v3';
import { Get, Post } from '@/utils/axios/request';
import { useRoute, useRouter } from 'vue-router';
import { useUserDataStore } from '@/store/UserData';
import { VueDraggable } from 'vue-draggable-plus'
import 'md-editor-v3/lib/style.css';
import { ConvertTools } from '@/utils/globalFunctions';

const userDataStore = useUserDataStore();
const router = useRouter();
const route = useRoute();

let beginTime = ref<string>();
let endTime = ref<string>();
let PID = ref<string>();

interface List {
  PID: string,
  Title: string,
};

const list = ref<Array<List>>([]);

let contest = reactive<ContestType>({
  problems: '',
  CID: 0,
  BeginTime: 0,
  EndTime: 0,
  IsPublic: 1,
  Size: 0,
  Title: '',
  duration: 0,
  description: '',
  contests: '',
  UID: '',
  Type: 1,
  Pass: '',
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

function editContest() {
  if (contest.Title == '' || contest.description == '' || beginTime.value == undefined || endTime.value == undefined) {
    push.error({
      title: '信息错误',
      message: '请填写完整信息',
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
  Post('api/contest/edit/', {
    BeginTime: contest.BeginTime,
    EndTime: contest.EndTime,
    IsPublic: contest.IsPublic,
    Desciption: contest.description,
    Title: contest.Title,
    Pass: contest.Pass,
    Problems: listStr,
    Type: +contest.Type,
    UID: userDataStore.UID,
    CID: contest.CID,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        // contest.CID = data.CID;
        push.success({
          title: '编辑成功',
          message: `比赛 ID 为 ${contest.CID}`,
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
  contest.IsPublic = 1 - contest.IsPublic;
}

function getContest() {
  Get('api/contest/' + contest.CID, {})
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        contest.BeginTime = data.BeginTime;
        contest.EndTime = data.EndTime;
        contest.IsPublic = data.IsPublic;
        contest.Title = data.Title;
        contest.description = data.Description;
        contest.CID = data.CID;
        contest.UID = data.UID;
        contest.Type = data.Type;
        contest.Pass = data.Pass;

        beginTime.value = new Date(data.BeginTime + 8 * 60 * 60 * 1000).toISOString().substring(0, 16);
        endTime.value = new Date(data.EndTime + 8 * 60 * 60 * 1000).toISOString().substring(0, 16);

        for (let i = 0; i < data.Data.length; i++) {
          list.value.push({
            PID: data.Data[i].PID,
            Title: data.Data[i].Title,
          });
        }
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

onMounted(() => {
  contest.CID = +route.params.CID;
  getContest();
})


</script>

<style scoped></style>@/utils/globalFunctions