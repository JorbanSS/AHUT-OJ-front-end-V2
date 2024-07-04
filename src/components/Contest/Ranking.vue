<template>
  <div class="flex flex-row" :class="{ '-mb-1': route.name == 'RankingView', 'gap-2': route.name != 'RankingView' }">
    <div class="bg-white pl-6 pr-2 gap-2 flex items-center"
      :class="{ 'rounded-2xl shadow-lg Border': route.name != 'RankingView', '': route.name == 'RankingView' }">
      <refresh theme="outline" size="18" />
      <span class="font-bold mr-2 text-nowrap">自动更新间隔</span>
      <div class="bg-[#E8E9EA] flex p-1 rounded-xl">
        <div v-for="(item, index) in autoRefreshIntervals">
          <button class="py-1 rounded-lg w-16"
            :class="{ 'bg-[#2C3440] text-[#D7DDE4] font-bold': autoRefresh === item }" @click="autoRefresh = item">
            {{ item === 0 ? '关闭' : item + 's' }}
          </button>
        </div>
      </div>
    </div>
    <div class="bg-white w-full flex items-center justify-center" v-if="route.name == 'RankingView'">
      <span class="font-bold text-lg">{{ props.contest.Title }}</span>
    </div>
    <ul class="menu bg-white flex flex-row text-base font-bold w-fit flex-nowrap justify-end"
      :class="{ 'rounded-2xl shadow-lg Border': route.name != 'RankingView', '': route.name == 'RankingView' }">
      <li>
        <a @click="ranking.get(true)">
          <refresh theme="outline" size="18" />
          更新数据
        </a>
      </li>
      <li>
        <a @click="() => {
          if (route.name == 'RankingView') {
            $router.push({
              name: 'ContestRanking',
              params: {
                CID: props.contest.CID,
              }
            })
          } else {
            $router.push({
              name: 'RankingView',
              params: {
                CID: props.contest.CID,
              }
            })
          }
        }">
          <full-screen theme="outline" size="18" />
          <span class="font-bold">{{ route.name == 'RankingView' ? '退出全屏' : '全屏显示' }}</span>
        </a>
      </li>
    </ul>
  </div>
  <div class="flex flex-col gap-0.5 bg-white" v-if="props.contest.CID && route.name == 'RankingView'">
    <div class="flex flex-row gap-2 justify-between mx-6 text-xs font-bold text-[#566070]">
      <span>
        {{ ConvertTools.PrintTime(props.contest.BeginTime, 1, 1) }}
      </span>
      <span>
        {{ props.contest.EndTime > timeNow ? '还剩 ' +
          ConvertTools.PrintTimeInterval(ConvertTools.TimeInterval(timeNow, props.contest.EndTime), 1) :
          ConvertTools.PrintTime(props.contest.EndTime, 1, 1) }}
      </span>
    </div>
    <progress class="progress w-full"
      :value="ConvertTools.Percentage(Math.min(props.contest.Duration, timeNow - props.contest.BeginTime), props.contest.Duration)"
      max="100">
    </progress>
  </div>
  <div class="bg-white shadow-lg overflow-x-auto" :class="{ 'rounded-2xl Border': route.name != 'RankingView' }"
    :style="{ 'max-height': route.name == 'RankingView' ? 'calc(100vh - 78px)' : 'calc(100vh - 500px)' }">
    <table class="table table-zebra table-pin-rows table-pin-cols table-fixed text-center">
      <thead>
        <tr>
          <th class="w-14">Place</th>
          <th class="w-32">Name</th>
          <th class="w-32">UID</th>
          <th class="w-14">Solved</th>
          <th class="w-20">Penalty</th>
          <th v-for="(item, index1) in props.problems " :key="index1" class="w-16"
            :style="'background-color: ' + item.BalloonColor + '; color: ' + item.BalloonColor">
            <span style="filter: grayscale(1) contrast(999) invert(1)" v-if="item.BalloonColor != ''">
              {{ ConvertTools.Number2Alpha(index1 + 1) }}
            </span>
            <span v-else class="text-black">
              {{ ConvertTools.Number2Alpha(index1 + 1) }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="( item1, index ) in ranking.Ranking " :key="index">
          <th>{{ index + 1 }}</th>
          <td>{{ item1.Uname }}</td>
          <td>{{ item1.UserID }}</td>
          <td>{{ item1.ACNumber }}</td>
          <td>{{ Math.round(item1.Penalty / 60 / 1000) }}</td>
          <td v-for="( item2, index2 ) in item1.Problems " :key="index2" class="px-0 pb-1 pt-0"
            :style="`${getRankingBackgroundColor(item2)};`">
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
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { FullScreen, Refresh } from '@icon-park/vue-next';

import { _getContestRanking } from '@/apis/contest';
import { useConstValStore } from '@/stores/ConstVal';
import { type ContestRankingType, type ContestType } from '@/interfaces/contest';
import { ConvertTools, getRankingBackgroundColor } from '@/utils/globalFunctions';
import { push } from 'notivue';
import { _getServerTime } from '@/apis/common';
import { onUnmounted } from 'vue';

const route = useRoute();
const router = useRouter();
const constValStore = useConstValStore();

const autoRefreshIntervals = [0, 5, 10, 30];
const autoRefresh = ref<number>(0);
let timer: ReturnType<typeof setInterval> | null = null;

const f = () => {
  ranking.get(true);
};

const startAutoRefresh = () => {
  if (timer) {
    clearInterval(timer);
  }
  if (autoRefresh.value > 0) {
    timer = setInterval(f, autoRefresh.value * 1000);
  }
};

const stopAutoRefresh = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

watch(autoRefresh, (newInterval) => {
  if (newInterval > 0) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
});

onMounted(() => {
  if (autoRefresh.value > 0) {
    startAutoRefresh();
  }
});

onUnmounted(() => {
  stopAutoRefresh();
});

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
  get(showInfo: boolean = false) {
    getServerTime();
    let params = {
      UseWs: false,
    };
    _getContestRanking(params, props.contest.CID)
      .then((data: any) => {
        ranking.Count = data.Size;
        ranking.Ranking = data.Data;
        if (showInfo) {
          push.success({
            title: '更新成功',
          })
        }
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
          penalty += ranking.Ranking[i].Problems[j].Time + (ranking.Ranking[i].Problems[j].SubmitNumber - 1) * 20 * 60 * 1000;
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

let timeNow = ref<number>(0);

const getServerTime = () => {
  _getServerTime({})
    .then((data: any) => {
      timeNow.value = data.time;
    })
}

onMounted(() => {
  if (props.contest.CID == 0) {
    props.contest.CID = route.params.CID as unknown as number;
  }
  ranking.get();
})

</script>