<template>
  <div class="card bg-white Border shadow-lg overflow-x-auto" style="max-height: calc(100vh - 124px - 48px)">
    <table class="table table-zebra table-pin-rows table-pin-cols table-fixed text-center">
      <thead>
        <tr>
          <th class="w-14">Place</th>
          <th class="w-32">Name</th>
          <th class="w-32">UID</th>
          <th class="w-14">Solved</th>
          <th class="w-20">Penalty</th>
          <th v-for="(item, index1) in  props.problems " :key="index1" class="w-16"
            :style="'background-color: ' + item.BalloonColor + '; color: ' + item.BalloonColor">
            <span style="filter: grayscale(1) contrast(999) invert(1)">
              {{ ConvertTools.Number2Alpha(index1 + 1) }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item1, index ) in  ranking.Ranking " :key=" index ">
          <th>{{ index + 1 }}</th>
          <td>{{ item1.Uname }}</td>
          <td>{{ item1.UserID }}</td>
          <td>{{ item1.ACNumber }}</td>
          <td>{{ Math.round(item1.Penalty / 60 / 1000) }}</td>
          <td v-for="( item2, index2 ) in  item1.Problems " :key=" index2 " class="px-0 pb-1 pt-0"
            :style=" `${getRankingBackgroundColor(item2)};` ">
            <div class="font-bold">
              <div class="font-bold">
                {{ item2.Status == "NULL" ? "" : item2.Status == "AC" ? "+" : "-" }}
              </div>
              <div class="text-xs" v-if=" item2.SubmitNumber ">
                {{ item2.SubmitNumber }}/{{ Math.round(item2.Time / 60 / 1000) }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup name="ContestRank">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { _getContestRanking } from '@/api/contest';
import { useConstValStore } from '@/store/ConstVal';
import { type ContestRankingType, type ContestType } from '@/interface/contest';
import { ConvertTools, getRankingBackgroundColor } from '@/utils/globalFunctions';

const route = useRoute();
const router = useRouter();
const constValStore = useConstValStore();

let currentTime = ref<number>(0);

type problemsType = {
  PID: string,
  Title: string,
  SubmitNum: number,
  ACNum: number,
  Status: string,
  BalloonColor: string,
}

interface propsType {
  problems?: Array<problemsType>,
  contest?: ContestType,
};

let props = withDefaults(defineProps<propsType>(), {
  problems: () => [],
  contest: () => ({
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
  }),
});

let ranking = reactive<ContestRankingType>({
  Count: 0,
  Ranking: [],
  get() {
    let params = {
      UseWs: false,
    };
    _getContestRanking(params, props.contest.CID)
      .then((data: any) => {
        ranking.Count = data.Size;
        ranking.Ranking = data.Data;
      })
      .then(() => {
        this.getPenalty();
        this.getPionners();
        this.sortRanking();
      })
  },

  getPenalty() {
    for (let i = 0; i < ranking.Ranking.length; i++) {
      let penalty = 0;
      for (let j = 0; j < ranking.Ranking[i].Problems.length; j++) {
        if (ranking.Ranking[i].Problems[j].Status == "AC") {
          penalty += ranking.Ranking[i].Problems[j].Time;
        }
      }
      ranking.Ranking[i].Penalty = penalty;
    }
  },

  getPionners() {
    for (let i = 0; i < props.problems.length; i++) {
      let pioneer = -1, minTime = props.contest.EndTime - props.contest.BeginTime;
      for (let j = 0; j < ranking.Count; j++) {
        if (ranking.Ranking[j].Problems[i].Status == "AC") {
          if (ranking.Ranking[j].Problems[i].Time < minTime) {
            pioneer = j;
            minTime = ranking.Ranking[j].Problems[i].Time;
          }
        }
      }
      if (pioneer != -1) {
        ranking.Ranking[pioneer].Problems[i].IsPioneer = true;
      }
    }
  },

  sortRanking() {
    ranking.Ranking.sort((a: any, b: any) => {
      if (a.ACNumber == b.ACNumber) return b.Penalty - a.Penalty;
      return b.ACNumber - a.ACNumber;
    })
  },
})

// setInterval(() => {
//   getServerTime().then(() => {
//     console.log(currentTime.value);
//   })
// }, 2000);

onMounted(() => {
  if (props.contest.CID == 0) {
    props.contest.CID = route.params.CID as unknown as number;
  }
  ranking.get();
  // getServerTime().then((res: any) => {
  //   currentTime.value = res;
  // })
})

</script>