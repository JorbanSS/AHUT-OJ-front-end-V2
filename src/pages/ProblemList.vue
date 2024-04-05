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
      {{ problemList.description }}
    </div>
    <div>
      创建于：{{ ConvertTools.PrintTime(problemList.StartTime, 1) }}
    </div>
  </div>
  <div class="m-6"></div>
  <div class="card shadow-lg Border bg-white">
    <table class="table table-zebra mb-4">
      <thead>
        <tr>
          <th v-for="(item, index) in ['通过状态', '题号', '题目名称', '通过率', '通过数/提交数']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in problems" :key="item.PID" @click="router.push(`/problem/${item.PID}`);"
          class="cursor-pointer">
          <td class="font-bold talbe-lg">
            <div v-if="checkAccepted(item.PID)">

            </div>
          </td>
          <th>
            {{ ConvertTools.Number2Alpha(index + 1) }}
          </th>
          <td class="font-bold talbe-lg">
            <div>{{ item.Ptitle }}</div>
          </td>
          <td>
            <!-- <progress class="progress progress-success w-20" :value="ConvertTools.Percentage(item.ACNum, item.SubmitNum)" max="100"></progress> -->
          </td>
          <td>
            <!-- {{ item.ACNum }}
            /
            {{ item.SubmitNum }} -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup name="problemList">
import { ref, reactive, onMounted, watch } from 'vue';
import { type ProblemListType } from '@/type/problemList';
import '@/utils/axios/request';
import { Get } from '@/utils/axios/request';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useRoute, useRouter } from 'vue-router';

import { _getProblemList,_getProblemUserInfo } from '@/api/problemList';

const route = useRoute();
const router = useRouter();

let problemList = reactive<ProblemListType>({
  LID: 0,
  StartTime: 0,
  EndTime: 0,
  IsPublic: 0,
  Size: 0,
  Title: '',
  duration: 0,
  description: '',
  problems: '',
  UID: '',
  Type: 0,

  get(showInfo: boolean = false) {
    let params = {
      LID: problemList.LID,
    };
    _getProblemList(params, problemList.LID)
      .then((data: any) => {
        problemList.Title = data.Title;
        problemList.StartTime = data.StartTime;
        problemList.LID = data.LID;
        problemList.description = data.Description;
        problems = data.Data;
        if (showInfo) {
          push.success({
            title: '',
            message: ``,
          })
        }
      })

      _getProblemUserInfo(params)
      .then((data: any) => {
        if (data.Code == 0) {
          acceptedProblems = data.SolvedPID;
        }
        else {
          push.error({
            title: `Error: ${data.Code}`,
            message: `${data.Msg}`,
          })
        }
      })
      .then(() => {
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: ``,
          })
        }
      })
      .catch((err: any) => {
        console.log(err);
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

function getproblemList(showInfo: boolean = false) {
  Get('training/user', {
    LID: problemList.LID,
  })
    .then((data: any) => {
      acceptedProblems = data.SolvedPID;
    })
    .then(() => {
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: ``,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function checkAccepted(PID: string) {
  for (let item in acceptedProblems) {
    if (item == PID) {
      return true;
    }
  }
  return false;
}

onMounted(() => {
  problemList.LID = +route.params.LID;
  problemList.get();
})

</script>