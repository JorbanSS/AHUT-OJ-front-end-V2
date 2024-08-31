<template>
  <div class="flex flex-col overflow-hidden bg-white">
    <Ranking :contest="contest" :problems="problems"></Ranking>
  </div>
</template>

<script lang="ts" setup name="Records">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { push } from 'notivue';

import { _getRecords } from '@/apis/record';
import { submitLanguageOptions, submitStatusOptions } from '@/config';
import { type RecordsType, type RecordType } from '@/interfaces/record';
import { useUserDataStore } from '@/stores/UserData';
import Ranking from '@/components/Contest/Ranking.vue';
import { ConvertTools, getServerTime } from '@/utils/globalFunctions';
import { ContestType } from '@/interfaces/contest';
import { _cloneToProblemList, _getContest } from '@/apis/contest';

const route = useRoute();
const router = useRouter();
const userDataStore = useUserDataStore();

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
        problems.value = data.Data;
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

let problems = ref<Array<problemsType>>([])

onMounted(() => {
  contest.CID = +route.params.CID;
  getServerTime()
  .then((res: any) => {
    TimeNow.value = res;
  })
  contest.get();
})

</script>