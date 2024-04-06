<template>
  <div class="card shadow-lg Border bg-white p-6 space-y-1">
    <div class="text-xl font-bold">
      {{ problemList.Title }}
    </div>
    <div class="flex space-x-1">
      <div class="badge badge-neutral">
        Offical
      </div>
    </div>
    <div>
      创建于：{{ ConvertTools.PrintTime(problemList.StartTime, 1) }}
    </div>
  </div>
  <div class="m-6"></div>
  <div class="flex space-x-2">
    <ul class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold w-fit">
      <li v-for="item in problemListNavItems" :key="item.title">
        <RouterLink :to="item.to" v-if="typeof item.to != 'undefined'"
          :class="{ 'btn-active': route.path.split('/')[3].toLowerCase() == item.to.name.substring(11).toLowerCase() }">
          <component :is="item.icon" theme="outline" size="18" />
          {{ item.title }}
        </RouterLink>
      </li>
    </ul>
    <ul class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold w-fit mx-auto" v-if="userDataStore.PermissionMap & constValStore.ProblemListAdminBit" >
      <li>
        <a @click="problemList.clone()">
          <bill theme="outline" size="18" />
          克隆
        </a>
      </li>
      <li>
        <a @click="router.push('/admin/problemlist/edit/' + problemList.LID)">
          <editor theme="outline" size="18" />
          题单编辑
        </a>
      </li>
    </ul>
  </div>
  <div class="m-6"></div>
  <RouterView :problemList="problemList" :problems="problems">
  </RouterView>
</template>

<script lang="ts" setup name="problemList">
import { ref, reactive, onMounted, watch } from 'vue';
import { type ProblemListType } from '@/type/problemList';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useRoute, useRouter } from 'vue-router';
import { problemListNavItems } from "@/config";
import { Bill, Editor } from "@icon-park/vue-next";
import { useUserDataStore } from '@/store/UserData';
import { useConstValStore } from '@/store/ConstVal';

import { _getProblemList, _getProblemListUsersInfo, _cloneProblemList } from '@/api/problemList';

const constValStore = useConstValStore();
const userDataStore = useUserDataStore();
const route = useRoute();
const router = useRouter();

let problemList = reactive<ProblemListType>({
  LID: 0,
  StartTime: 0,
  EndTime: 0,
  IsPublic: 0,
  Size: 0,
  Title: '',
  Duration: 0,
  Description: '',
  Problems: '',
  UID: '',
  Type: 0,

  get(showInfo: boolean = false) {
    _getProblemList({}, problemList.LID)
      .then((data: any) => {
        problemList.Title = data.Title;
        problemList.StartTime = data.StartTime;
        problemList.LID = data.LID;
        problemList.Description = data.Description;
        problems = data.Data;
        if (showInfo) {
          push.success({
            title: '',
            message: ``,
          })
        }
      })
  },

  clone() {
    let params = {
      LID: problemList.LID,
      UID: userDataStore.UID,
    };
    _cloneProblemList(params)
    .then((data: any) => {
        let LID = data.LID;
        push.success({
          title: '克隆成功',
          message: `已克隆题单 ${problemList.LID}`,
        })
        router.push(`/problemlist/${LID}`);
      })
  },
})

type problems = {
  PID: string,
  Ptitle: string,
  // SubmitNum: number,
  // ACNum: number,
}

let problems = reactive<Array<problems>>([])

let acceptedProblems = reactive<Array<string>>([])

function getProblemListUsersInfo(showInfo: boolean = false) {
  let params = {
    lid: problemList.LID,
  }
  _getProblemListUsersInfo(params)
    .then((data: any) => {
      acceptedProblems = data.SolvedPID;
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: ``,
        })
      }
    })
}

function checkAccepted(PID: string) {
  for (let item in acceptedProblems) {
    if (item == PID) return true;
  }
  return false;
}

onMounted(() => {
  problemList.LID = +route.params.LID;
  problemList.get();
  getProblemListUsersInfo();
  console.log(route.path.split('/')[3].toLowerCase());
  
})

</script>