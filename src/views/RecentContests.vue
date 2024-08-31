<template>
  <div class="bg-white card shadow-lg Border">
    <div class="flex justify-between items-center p-6">
      <ul class="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box font-bold w-fit">
        <li v-for="item in recentContestsOriginOptions" :key="item.value" :value="item.value">
          <a :class="{ 'btn-active': item.value == recentContests.searchInfo.OJ }"
            @click="recentContests.searchInfo.OJ = item.value">{{ item.label }}
            <div class="badge badge-neutral badge-sm" v-if="item.value == 'All'">{{ recentContests.Count }}</div>
            <div class="badge badge-neutral badge-sm" v-else>{{ recentContests.RecentContests.filter(contest => contest.OJ == item.value).length }}</div>
          </a>
        </li>
      </ul>
      <div class="join">
        <button class="btn join-item" @click="recentContests.get()">
          <refresh theme="outline" size="18" />
          刷新列表
        </button>
        <button class="btn join-item" @click="recentContests.scrape()">
          <DownloadTwo theme="outline" size="18" />
          重新拉取
        </button>
      </div>
    </div>
    <div class="overflow-x-hidden rounded-b-2xl" style="max-height: calc(100vh - 124px - 150px)">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th v-if="recentContests.searchInfo.OJ == 'All'">
              平台
            </th>
            <th v-for="(item, index) in ['比赛名称', '标签', '赛制', '开始时间', '时长']" :key="index">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr
            v-for="item in recentContests.RecentContests.filter(item => item.OJ == recentContests.searchInfo.OJ || recentContests.searchInfo.OJ == 'All')"
            :key="item.CID" @click="recentContests.goToContest(item.URL)" target="_blank" class="cursor-pointer">
            <th v-if="recentContests.searchInfo.OJ == 'All'">
              {{ item.OJ }}
            </th>
            <td>
              <span class="font-bold talbe-lg">{{ item.Title }}</span>
            </td>
            <td class="space-x-1 space-y-0.5 whitespace-nowrap">
              <span class="badge badge-neutral badge-md font-bold"
                v-for="(label, index) in item.Label.split(/;/).filter(item => item != '' && item != '/')" :key="index">
                {{ label }}
              </span>
            </td>
            <th>
              {{ item.Type }}
            </th>
            <th>
              {{ ConvertTools.PrintTime(item.StartTime, 2, 0, true) }}
            </th>
            <th>
              {{ ConvertTools.PrintTimeInterval(item.Duration) }}
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup name="Main">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { DownloadTwo, Refresh } from '@icon-park/vue-next';
import { push } from 'notivue';

import { _getRecentContests, _scrapeRecentContests } from '@/api/recentContests';
import { recentContestLabelOptions, recentContestsOriginOptions } from '@/config';
import { RecentContestsType } from '@/interfaces/recentContests';
import { ConvertTools } from '@/utils/globalFunctions';

const route = useRoute();

let recentContests = reactive<RecentContestsType>({
  RecentContests: [],
  Count: 0,
  Page: 0,
  Limit: 20,

  searchInfo: {
    OJ: 'All',
  },

  get() {
    _getRecentContests({})
      .then((data: any) => {
        this.RecentContests = data.RecentContests.filter((item: any) => item.Duration <= 43200000);
        this.RecentContests.sort((a, b) => a.StartTime - b.StartTime);
        this.Count = this.RecentContests.length;
        this.Page = data.Page;
        this.Limit = data.Limit;
        this.RecentContests.forEach((item: any) => {
          item.Label = '';
          recentContestLabelOptions.forEach((labelOption: any) => {
            if (item.Title.includes(labelOption.label)) item.Label += labelOption.value + ';';
          })
        })
        push.success({
          title: '获取成功',
          message: `一共获取了 ${this.Count} 个比赛`,
        })
      })
  },

  goToContest(url: string) {
    window.open(url, '_blank');
  },

  scrape() {
    _scrapeRecentContests({})
      .then(() => {
        push.info({
          title: '请求成功',
          message: '正在重新获取近期比赛',
        })
      })
  },

})

onMounted(() => {
  recentContests.get();
});

</script>