<template>
  <div class="grid grid-cols-2 gap-6 mb-6">
    <div class="card Border bg-white shadow-lg p-4 h-full space-y-2">
      <div>
        <div class="font-bold first-letter:uppercase"
          :style="'color: ' + ConvertTools.RatingToColor(codeforcesUser.nowRating)">
          {{ ConvertTools.RatingToTitle(codeforcesUser.nowRating) }}
        </div>
        <div class="text-2xl font-bold" :style="'color: ' + ConvertTools.RatingToColor(codeforcesUser.nowRating)">
          {{ codeforcesUser.CodeforcesID }}
        </div>
      </div>
      <div class="mt-2 flex">
        Rating:&nbsp;
        <div class="font-bold" :style="'color: ' + ConvertTools.RatingToColor(codeforcesUser.nowRating)">
          {{ codeforcesUser.nowRating }}
        </div>
        <div class="text-sm flex mt-0.5">
          &nbsp;(max.&nbsp;
          <div class="font-bold" :style="'color: ' + ConvertTools.RatingToColor(codeforcesUser.maxRating)">
            {{ ConvertTools.RatingToTitle(codeforcesUser.nowRating) }},
            {{ codeforcesUser.maxRating }}
          </div>)
        </div>
      </div>
      <div class="font-bold">合作过的队友</div>
      <div>
        <div v-if="codeforcesUser.teamMates.length > 0" class="badge badge-neutral mr-1"
          v-for="item in codeforcesUser.teamMates.split(';')">
          <a :href="'https://codeforces.com/profile/' + item" target="_blank">
            <span class="whitespace-nowrap">{{ item }}</span>
          </a>
        </div>
        <div v-else>
          暂无
        </div>
      </div>
    </div>
    <div class="card Border bg-white shadow-lg p-4 h-full space-y-2">
      <div class="font-bold">未解决的题目</div>
      <div>
        <div v-if="codeforcesUser.submission.unsolved.length > 0" class="badge badge-neutral mr-1"
          v-for="item in codeforcesUser.submission.unsolved.split(';')">
          <a :href="'https://codeforces.com/problemset/' + (item.split('-')[0].length == 4 ? 'problem' : 'gymProblem') + '/' + item.split('-')[0] + '/' + item.split('-')[1]"
            target="_blank">
            <span class="whitespace-nowrap">{{ item }}</span>
          </a>
        </div>
        <div v-else>
          暂无
        </div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-6 mb-6" v-if="status">
    <div class="card Border bg-white shadow-lg h-fit">
      <div class="overflow-x-auto rounded-2xl">
        <table class="table text-center">
          <thead>
            <tr>
              <th>总提交数</th>
              <th>尝试题目数</th>
              <th>解决题目数</th>
              <th>平均尝试次数</th>
              <th>首次提交通过数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ codeforcesUser.submission.submissionCount }}</td>
              <td>{{ codeforcesUser.submission.tried }}</td>
              <td>{{ codeforcesUser.submission.solved }}</td>
              <td>{{ codeforcesUser.submission.averageAttempts }}</td>
              <td>{{ codeforcesUser.submission.firstAttemptPassedCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card Border bg-white shadow-lg h-fit">
      <div class="overflow-x-auto rounded-2xl">
        <table class="table text-center">
          <thead>
            <tr>
              <th>最大上分</th>
              <th>最大掉分</th>
              <th>最好排名</th>
              <th>最差排名</th>
              <th>现场赛次数</th>
              <th>虚拟参赛次数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ codeforcesUser.contest.maxUp }}</td>
              <td>{{ codeforcesUser.contest.maxDown }}</td>
              <td>{{ codeforcesUser.contest.bestRank }}</td>
              <td>{{ codeforcesUser.contest.worstRank }}</td>
              <td>{{ codeforcesUser.contest.contestCount }}</td>
              <td>{{ codeforcesUser.contest.virtualParticipationCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="card Border bg-white shadow-lg py-3 pt-4 h-fit mb-6" v-if="status">
    <component :is="rating" :rating="codeforcesUser.rating" />
  </div>
  <div class="grid grid-cols-2 gap-6 mb-6" v-if="status">
    <div class="card Border bg-white shadow-lg pr-2 pt-4 h-fit">
      <component :is="problemRating" :problemRating="codeforcesUser.problemRating" />
    </div>
    <div class="card Border bg-white shadow-lg pr-2 pt-4 h-fit">
      <component :is="problemIndex" :problemIndex="codeforcesUser.problemIndex" />
    </div>
  </div>
  <div class="card Border bg-white shadow-lg py-3 pt-4 h-fit mb-6" v-if="status">
    <component :is="tags" :tags="codeforcesUser.tags" />
  </div>
  <div class="grid grid-cols-2 gap-6 mb-6" v-if="status">
    <div class="card Border bg-white shadow-lg py-3 pt-4 h-fit">
      <component :is="verdict" :verdict="codeforcesUser.verdict" />
    </div>
    <div class="card Border bg-white shadow-lg py-3 pt-4 h-fit">
      <component :is="language" :language="codeforcesUser.language" />
    </div>
  </div>
  <div class="card Border bg-white shadow-lg mb-6 p-6 h-48 items-center justify-center space-y-4" v-if="!status">
    <span class="text-lg font-bold">数据获取中</span>
    <span class="loading loading-spinner loading-lg"></span>
  </div>
</template>

<script lang="ts" setup name="Main">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { push } from 'notivue';

import { _addUser, _bindAccount } from '@/api/user';
import { _getCodeforcesStatistics } from '@/api/codeforces';
import { CodeforcesStatisticsType } from '@/interfaces/codeforces';
import problemRating from '@/components/Codeforces/problemRating.vue';
import problemIndex from '@/components/Codeforces/problemIndex.vue';
import verdict from '@/components/Codeforces/verdict.vue';
import language from '@/components/Codeforces/language.vue';
import tags from '@/components/Codeforces/tags.vue';
import rating from '@/components/Codeforces/rating.vue';
import { ConvertTools } from '@/utils/globalFunctions';

const route = useRoute();
const router = useRouter();

let status = ref(false);
let returnStatus = ref(false);

let codeforcesUser = reactive<CodeforcesStatisticsType>({
  CodeforcesID: '',
  problemRating: {},
  language: {},
  tags: {},
  verdict: {},
  problemIndex: {},
  teamMates: '',
  submission: {
    submissionCount: 0,
    tried: 0,
    solved: 0,
    unsolved: '',
    averageAttempts: 0,
    firstAttemptPassedCount: 0,
  },
  contest: {
    maxUp: 0,
    maxDown: 0,
    bestRank: 0,
    worstRank: 0,
    contestCount: 0,
    virtualParticipationCount: 0,
  },
  rating: {},
  nowRating: 0,
  maxRating: 0,

  get() {
    _getCodeforcesStatistics({}, this.CodeforcesID)
      .then((data: any) => {
        if (data.Msg == 'OK') {
          this.problemRating = data.problemRating;
          this.language = data.language;
          this.tags = data.tags;
          this.verdict = data.verdict;
          this.problemIndex = data.problemIndex;
          this.teamMates = data.teamMates;
          this.rating = data.rating;
          this.submission = {
            submissionCount: data.submissionCount,
            tried: data.tried,
            solved: data.solved,
            unsolved: data.unsolved,
            averageAttempts: data.averageAttempts,
            firstAttemptPassedCount: data.firstAttemptPassedCount,
          }
          this.contest = {
            maxUp: data.maxUp,
            maxDown: data.maxDown,
            bestRank: data.bestRank,
            worstRank: data.worstRank,
            contestCount: data.contestCount,
            virtualParticipationCount: data.virtualParticipationCount,
          }
          Object.entries(this.rating).forEach((item) => {
            this.nowRating = item[1].rating;
            this.maxRating = Math.max(this.maxRating, this.nowRating);
          });
          returnStatus.value = true;
        }
      })
      .then(() => {
        if (returnStatus.value == true) {
          status.value = true;
        }
      })
  },
});

let pollInterval: any;

const startPolling = () => {
  pollInterval = setInterval(() => {
    codeforcesUser.get();
  }, 1200);
};

onMounted(() => {
  codeforcesUser.CodeforcesID = route.params.CFID as string;
  startPolling();
});

onUnmounted(() => {
  clearInterval(pollInterval);
});

watch(() => status.value, (newVal) => {
  if (newVal == true) {
    clearInterval(pollInterval);
  }
});

</script>