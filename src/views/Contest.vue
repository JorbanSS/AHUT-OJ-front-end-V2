<template>
  <div class="m-6 flex flex-col gap-6 max-w-6xl mx-auto">

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
        比赛时间：
        {{ ConvertTools.PrintTime(contest.BeginTime, 1) }}
        ~
        {{ ConvertTools.PrintTime(contest.EndTime, 0) }}
      </div>
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
      <progress class="progress w-full"
        :value="ConvertTools.Percentage(Math.min(contest.Duration, TimeNow - contest.BeginTime), contest.Duration)"
        max="100"></progress>
    </div>
    <div class="flex space-x-2">
      <ul class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold w-fit">
        <li v-for="item in contestNavItems" :key="item.title">
          <RouterLink :to="item.to" v-if="typeof item.to != 'undefined'"
            :class="{ 'btn-active': route.path.split('/')[3].toLowerCase() == item.to.name.substring(7).toLowerCase() }">
            <component :is="item.icon" theme="outline" size="18" />
            {{ item.title }}
            <div class="badge badge-neutral" v-if="item.title == '记录'">{{ contest.RecordNumber }}</div>
          </RouterLink>
        </li>
      </ul>
      <ul class="menu bg-white flex flex-row rounded-box Border shadow-lg text-base font-bold w-fit mx-auto"
        v-if="userDataStore.PermissionMap & constValStore.ContestAdminBit">
        <li>
          <a @click="contest.cloneToProblemList()">
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
          <a @click="$router.push({
            name: 'EditContest',
            params: {
              CID: contest.CID,
            }
          })">
            <editor theme="outline" size="18" />
            比赛编辑
          </a>
        </li>
      </ul>
    </div>
    <RouterView :contest="contest" :problems="problems">
    </RouterView>
  </div>
</template>

<script lang="ts" setup name="Contest">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Bill, Editor, PartyBalloon } from '@icon-park/vue-next';
import { push } from 'notivue';

import { _cloneToProblemList, _getContest } from '@/apis/contest';
import { _getRecords } from '@/apis/record';
import { contestNavItems } from '@/config';
import { type ContestType } from '@/interfaces/contest';
import { useConstValStore } from '@/stores/ConstVal';
import { useUserDataStore } from '@/stores/UserData';
import { ConvertTools, getServerTime } from '@/utils/globalFunctions';

const constValStore = useConstValStore();
const userDataStore = useUserDataStore();
const router = useRouter();
const route = useRoute();

let TimeNow = ref(0);

let contest = reactive<ContestType>({
  CID: 0,
  BeginTime: 0,
  EndTime: 0,
  IsPublic: 0,
  Size: 0,
  Title: '',
  Duration: 0,
  Description: '',
  Problems: '',
  UID: '',
  Type: 0,
  Pass: '',
  Status: 0,

  RecordNumber: 0,

  get() {
    _getContest({}, contest.CID)
      .then((data: any) => {
        contest.Title = data.Title;
        contest.BeginTime = data.BeginTime;
        contest.EndTime = data.EndTime;
        contest.Duration = ConvertTools.TimeInterval(contest.BeginTime, contest.EndTime);
        contest.CID = data.CID;
        contest.IsPublic = data.IsPublic;
        contest.Description = data.Description;
        contest.Problems = data.Data;
        problems = data.Data;
      })
  },

  getRecordNumber() {
    let params = {
      CID: this.CID,
      Limit: 1,
    }
    _getRecords(params)
      .then((data: any) => {
        this.RecordNumber = data.Count;
      })
  },

  cloneToProblemList() {
    let params = {
      CID: contest.CID,
      UID: userDataStore.UID,
    };
    _cloneToProblemList(params)
      .then((data: any) => {
        let LID = data.LID;
        push.success({
          title: '克隆成功',
          message: `已克隆比赛 ${contest.CID}`,
        })
        router.push({
          name: 'ProblemList',
          params: {
            LID: LID,
          },
        });
      })
  }
})

interface problemsType {
  PID: string,
  Title: string,
  SubmitNum: number,
  ACNum: number,
  Status: string,
  BalloonColor: string,
}

let problems = reactive<Array<problemsType>>([])

onMounted(() => {
  contest.CID = +route.params.CID;
  getServerTime()
    .then((res: any) => {
      TimeNow.value = res;
    })
  contest.get();
  contest.getRecordNumber();
})

</script>