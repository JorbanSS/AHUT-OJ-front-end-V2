<template>
  <div class="card bg-white Border shadow-lg overflow-x-auto" style="height: calc(100vh - 124px - 48px)">
    <table class="table table-zebra table-pin-rows table-pin-cols table-fixed text-center">
      <thead>
        <tr>
          <th class="w-14">Place</th>
          <th class="w-32">Name</th>
          <th class="w-32">UID</th>
          <th class="w-14">Solved</th>
          <th class="w-20">Penalty</th>
          <th v-for="(item, index1) in props.contest.problems" :key="index1" class="w-16" >
            {{ ConvertTools.Number2Alpha(index1 + 1) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item1, index) in ranking.ranking" :key="index">
          <th>{{ index + 1 }}</th>
          <td>{{ item1.Uname }}</td>
          <td>{{ item1.UserID }}</td>
          <td>{{ item1.ACNumber }}</td>
          <td>{{ Math.round(item1.Penalty / 60 / 1000) }}</td>
          <td v-for="(item2, index2) in item1.Problems" :key="index2" class="px-0 pb-1 pt-0"
            :style="`${getBackgroundColor(item2)};`">
            <div class="font-bold">
              <div class="font-bold">
                {{ item2.Status == "NULL" ? "" : item2.Status == "AC" ? "+" : "-" }}
              </div>
              <div class="text-xs" v-if="item2.SubmitNumber">
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
import { ref, reactive, onMounted, watch } from 'vue';
import { type ContestType, type ContestRankingType, type ContestRankingProblemType } from '@/type/contest';
import '@/utils/axios/request';
import { Get, Post } from '@/utils/axios/request';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useRoute, useRouter } from 'vue-router';
import { Server } from '@icon-park/vue-next';
import { useConstValStore } from '@/store/ConstVal';
import { getServerTime } from '@/utils/globalFunctions';

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
    duration: 0,
    description: '',
    problems: '',
    UID: '',
    Type: 0,
    Pass: '',
  }),
});

let ranking = reactive<ContestRankingType>({
  count: 0,
  ranking: [],
})

function getContestRanking() {
  Get('api/contest/' + props.contest.CID + '/rank', {
    // Pass='',
    UseWs: false,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        ranking.count = data.Size;
        ranking.ranking = data.Data;
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        })
      }
    })
    .then(() => {
      getPenalty();
      getPionners();
      sortRanking();
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function getBackgroundColor(item: ContestRankingProblemType): string {
  let baseBackgroundColor = "background-color: ";
  if (item.Status == "NULL") return "";
  if (item.isPioneer) {
    return baseBackgroundColor + constValStore.RANKING_COLOR_FIRST_AC;
  }
  return item.Status == "AC" ?
    baseBackgroundColor + constValStore.RANKING_COLOR_AC :
    baseBackgroundColor + constValStore.RANKING_COLOR_NOT_AC;
}

function getPenalty() {
  for (let i = 0; i < ranking.ranking.length; i++) {
    let penalty = 0;
    for (let j = 0; j < ranking.ranking[i].Problems.length; j++) {
      if (ranking.ranking[i].Problems[j].Status == "AC") {
        penalty += ranking.ranking[i].Problems[j].Time;
      }
    }
    ranking.ranking[i].Penalty = penalty;
  }
}

function getPionners() {
  for (let i = 0; i < props.problems.length; i++) {
    let pioneer = -1, minTime = props.contest.EndTime - props.contest.BeginTime;
    for (let j = 0; j < ranking.count; j++) {
      if (ranking.ranking[j].Problems[i].Status == "AC") {
        if (ranking.ranking[j].Problems[i].Time < minTime) {
          pioneer = j;
          minTime = ranking.ranking[j].Problems[i].Time;
        }
      }
    }
    if (pioneer != -1) {
      ranking.ranking[pioneer].Problems[i].isPioneer = true;
    }
  }
}

function sortRanking() {
  ranking.ranking.sort((a: any, b: any) => {
    if (a.ACNumber == b.ACNumber) {
      return b.Penalty - a.Penalty;
    }
    return b.ACNumber - a.ACNumber;
  })
}

// setInterval(() => {
//   getServerTime().then(() => {
//     console.log(currentTime.value);
//   })
// }, 2000);

onMounted(() => {
  if (props.contest.CID == 0) {
    props.contest.CID = route.params.CID as unknown as number;
  }
  getContestRanking();
  // getServerTime().then((res: any) => {
  //   currentTime.value = res;
  // })
})

</script>