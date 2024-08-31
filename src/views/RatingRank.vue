<template>
  <div class="bg-white card shadow-lg Border">
    <div class="flex justify-between items-center p-6">
      <div class="flex space-x-6">
        <div class="w-40">
          <div class="mb-2 flex justify-between">
            <div class="font-bold">
              Codeforces
            </div>
            <div>
              {{ ratingRank.Calculation.Codeforces }}'
            </div>
          </div>
          <input type="range" min="0" max="100" v-model="ratingRank.Calculation.Codeforces" class="range" step="20" />
        </div>
        <div class="w-40">
          <div class="mb-2 flex justify-between">
            <div class="font-bold">
              Nowcoder
            </div>
            <div>
              {{ ratingRank.Calculation.Nowcoder }}'
            </div>
          </div>
          <input type="range" min="0" max="100" v-model="ratingRank.Calculation.Nowcoder" class="range" step="20" />
        </div>
        <div class="w-40">
          <div class="mb-2 flex justify-between">
            <div class="font-bold">
              Atcoder
            </div>
            <div>
              {{ ratingRank.Calculation.Atcoder }}'
            </div>
          </div>
          <input type="range" min="0" max="100" v-model="ratingRank.Calculation.Atcoder" class="range" step="20" />
        </div>
      </div>
      <div class="join">
        <button class="btn join-item" @click="ratingRank.get()">
          <refresh theme="outline" size="18" />
          刷新列表
        </button>
        <button class="btn join-item" @click="ratingRank.scrape()">
          <DownloadTwo theme="outline" size="18" />
          重新拉取
        </button>
      </div>
    </div>
    <div class="overflow-x-hidden rounded-b-2xl" style="max-height: calc(100vh - 124px - 160px)">
      <table class="table table-zebra text-center">
        <thead>
          <tr>
            <th v-for="(item, index) in ['排名', '用户名', '综合 Rating', 'Codeforces', 'Nowcoder', 'Atcoder']" :key="index">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr v-for="(item, index) in ratingRank.RatingRank" :key="item.UID">
            <th>
              {{ index + 1 }}
            </th>
            <th>
              <div class="tooltip" :data-tip="item.UID">
                {{ item.UserName }}
              </div>
            </th>
            <th>
              {{ item.Rating.toFixed(1) }}
            </th>
            <th>
              <div class="tooltip" :data-tip="item.CodeforcesID" v-if="item.CodeforcesID"
                :class="{ 'cursor-pointer text-blue-500': item.CodeforcesID != '' }"
                @click="$router.push({ name: 'CodeforcesStatistics', params: { CFID: item.CodeforcesID } })">
                {{ item.CodeforcesRating }} (Max. {{ item.CodeforcesMaxRating }})
              </div>
              <div v-else>
                -
              </div>
            </th>
            <td>
              <div class="tooltip" :data-tip="item.NowcoderID" v-if="item.NowcoderID">
                {{ item.NowcoderRating }} (Max. {{ item.NowcoderMaxRating }})
              </div>
              <div v-else>
                -
              </div>
            </td>
            <td>
              <div class="tooltip" :data-tip="item.AtcoderID" v-if="item.AtcoderID">
                {{ item.AtcoderRating }} (Max. {{ item.AtcoderMaxRating }})
              </div>
              <div v-else>
                -
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup name="Main">
import { onMounted, reactive, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import { push } from 'notivue';
import { Refresh, DownloadTwo, Code } from '@icon-park/vue-next';

import { _getRatingRank, _scrapeRating } from '@/api/rating';
import { RatingRankType } from '@/interfaces/rating';
import { ratingRankOriginOptions } from '@/config';

const route = useRoute();

let ratingRank = reactive<RatingRankType>({
  RatingRank: [],
  Count: 0,
  Calculation: {
    Codeforces: 60,
    Nowcoder: 40,
    Atcoder: 0,
  },

  get() {
    _getRatingRank({})
      .then((data: any) => {
        ratingRank.RatingRank = data.RatingRank;
        ratingRank.Count = data.Count;
        push.success({
          'title': '获取成功',
          'message': `一共获取了 ${this.Count} 位用户评分`
        })
      })
      .then(() => {
        ratingRank.calculateRating();
      })
  },

  scrape() {
    _scrapeRating({})
      .then(() => {
        push.info({
          title: '请求成功',
          message: '正在重新获取用户评分',
        })
      })
  },

  calculateRating() {
    let sum = Number(this.Calculation.Codeforces) + Number(this.Calculation.Nowcoder) + Number(this.Calculation.Atcoder);
    ratingRank.RatingRank.forEach((item: any) => {
      if (sum == 0) item.Rating = 0;
      else item.Rating = item.CodeforcesRating * this.Calculation.Codeforces / sum
        + item.NowcoderRating * this.Calculation.Nowcoder / sum
        + item.AtcoderRating * this.Calculation.Atcoder / sum;
    })
    ratingRank.RatingRank.sort((a: any, b: any) => b.Rating - a.Rating);
  }
})

onMounted(() => {
  ratingRank.get();
});

watch(() => ratingRank.Calculation, () => {
  ratingRank.calculateRating();
}, {
  deep: true,
})

</script>