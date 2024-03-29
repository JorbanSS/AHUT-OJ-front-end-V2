<template>
  <div class="card shadow-lg Border bg-white p-6 space-y-1">
    <div class="text-xl font-bold">
      {{ contest.Title }}
    </div>
    <div class="flex space-x-1">
      <div class="badge badge-neutral">
        {{ contest.Type == 1 ? "OI" : "ICPC" }}
      </div>
      <div class="badge badge-neutral">
        Offical
      </div>
    </div>
    <div>
      {{ ConvertTools.PrintTime(contest.BeginTime, 1) }}
      ~
      {{ ConvertTools.PrintTime(contest.EndTime, 0) }}
    </div>
    <!-- <progress class="progress w-full" :value="ConvertTools.Percentage(, contest.duration)" max="100"></progress> -->
    <!-- <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span class="countdown font-mono text-5xl">
          <span style="--value:10;"></span>
        </span>
        hours
      </div>
      <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span class="countdown font-mono text-5xl">
          <span style="--value:24;"></span>
        </span>
        min
      </div>
      <div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span class="countdown font-mono text-5xl">
          <span style="--value:45;"></span>
        </span>
        sec
      </div>
    </div> -->
    <progress class="progress w-full" :value="82" max="100"></progress>
  </div>
  <div class="m-6"></div>
  <div class="flex space-x-2">
    <ul class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold w-fit">
      <li v-for="item in contestNavItems" :key="item.title">
        <RouterLink :to="item.to" v-if="typeof item.to != 'undefined'" >
          <component :is="item.icon" theme="outline" size="18" />
          {{ item.title }}
        </RouterLink>
      </li>
    </ul>
    <ul class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold w-fit mx-auto">
      <li>
        <a>
          <bill theme="outline" size="18" />
          克隆为题单
        </a>
      </li>
      <li>
        <a>
          <party-balloon theme="outline" size="18" />
          气球提示
        </a>
      </li>
      <li>
        <a @click="router.push('/admin/contest/edit/' + contest.CID)">
          <editor theme="outline" size="18" />
          比赛编辑
        </a>
      </li>
    </ul>
  </div>
  <div class="m-6"></div>
  <RouterView :contest="contest" :problems="problems" >
  </RouterView>
</template>

<script lang="ts" setup name="Contest">
import { ref, reactive, onMounted, watch } from 'vue';
import { type ContestType } from '@/type.ts';
import '@/utils/axios/request';
import { Get } from '@/utils/axios/request';
import { push } from 'notivue';
import { ConvertTools } from '@/assets/ts/globalFunctions';
import { useRoute, useRouter } from 'vue-router';
import { Editor, PartyBalloon, Bill } from '@icon-park/vue-next';
import { contestNavItems } from '@/config';

const router = useRouter();
const route = useRoute();

let contest = reactive<ContestType>({
  CID: 0,
  BeginTime: 0,
  EndTime: 0,
  IsPublic: 0,
  Size: 0,
  Title: '',
  duration: 0,
  description: '',
  problems: '',
  UID: '',
  Type: 0,
  Pass: '',
})

type problemsType = {
  PID: string,
  Title: string,
  SubmitNum: number,
  ACNum: number,
  Status: string,
}

let problems = reactive<Array<problemsType>>([])

function getContest() {
  Get('api/contest/' + contest.CID, {
    // Pass='',
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        contest.Title = data.Title;
        contest.BeginTime = data.BeginTime;
        contest.EndTime = data.EndTime;
        contest.duration = ConvertTools.TimeInterval(contest.BeginTime, contest.EndTime);
        contest.CID = data.CID;
        contest.IsPublic = data.IsPublic;
        contest.description = data.Description;
        problems = data.Data;
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

function init() {
  syncUrl();
  getContest();
}

function syncUrl() {
  contest.CID = +route.params.CID;
}

onMounted(() => {
  init();
})

</script>

<style scoped></style>