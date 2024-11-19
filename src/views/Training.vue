<template>
  <div class="m-6 flex flex-col gap-6 max-w-6xl mx-auto">
    <PageHeader
      Title="训练"
      :IconName="Muscle"
      Infomation="展示个人 Codeforces、Nowcoder、Atcoder 历史数据，以供 ACM 集训队进行及时的训练反馈。"
    >
    </PageHeader>

    <div class="flex flex-row gap-3">
      <div class="bg-white card shadow-lg Border w-[40%]">
        <div
          class="overflow-x-hidden rounded-b-2xl"
          style="max-height: calc(100vh - 124px - 150px)"
        >
          <table class="table table-zebra">
            <thead>
              <th v-for="(item, index) in ['在线用户ID']" :key="index">
                {{ item }}
              </th>
            </thead>
            <tbody v-auto-animate>
              <tr v-if="UIDs.length === 0">
                <td>只有你在线！🥰</td>
              </tr>
              <tr v-else v-for="(uid, index) in UIDs" :key="index">
                <td>{{ uid }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card bg-white Border shadow-lg w-[60%] p-3">
        <div class="stats shadow-lg Border">
          <div class="flex">
            <div class="stats shadow">
              <div class="stat">
                <div class="stat-figure text-primary">
                  <cattle theme="outline" size="28" />
                </div>
                <div class="stat-title">NowCoder</div>
                <div class="stat-value text-primary">3200</div>
                <div class="stat-desc flex">
                  <to-top theme="outline" size="14" />
                  max. 3600
                </div>
              </div>

              <div class="stat">
                <div class="stat-figure text-secondary">
                  <Ranking theme="outline" size="28" />
                </div>
                <div class="stat-title">CodeForces</div>
                <div class="stat-value text-secondary">3500</div>
                <div class="stat-desc flex">
                  <to-top theme="outline" size="14" />
                  max. 3900
                </div>
              </div>

              <div class="stat">
                <div class="stat-figure text-secondary">
                  <div class="avatar online">
                    <div class="rounded-full">
                      <img
                        src="https://userpic.codeforces.org/2831557/title/be6ab3f7c88febd5.jpg"
                      />
                    </div>
                  </div>
                </div>
                <div class="stat-value">No.1</div>
                <div class="stat-title">{{ userDataStore.UserName }}</div>
                <div class="stat-desc text-secondary">
                  Owned 12 xcpc awards.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 p-4">
          <div class="flex gap-4 items-center">
            <div class="skeleton w-16 h-16 rounded-full shrink-0"></div>
            <div class="flex flex-col gap-4">
              <div class="skeleton h-4 w-20"></div>
              <div class="skeleton h-4 w-28"></div>
            </div>
          </div>
          <div class="skeleton h-12 w-full"></div>
          <div class="skeleton h-32 w-full"></div>
        </div>
      </div>
    </div>

    <div class="bg-white card shadow-lg Border">
      <div
        class="flex justify-between items-center p-6 sm:flex-row sm:space-x-3"
      >
        <ul
          class="menu menu-vertical md:menu-horizontal bg-base-200 rounded-box font-bold w-fit"
        >
          <li
            v-for="item in recentContestsOriginOptions"
            :key="item.value"
            :value="item.value"
          >
            <a
              :class="{
                'btn-active': item.value == recentContests.searchInfo.OJ,
              }"
              @click="recentContests.searchInfo.OJ = item.value"
              >{{ item.label }}
              <div
                class="badge badge-neutral badge-sm"
                v-if="item.value == 'All'"
              >
                {{ recentContests.Count }}
              </div>
              <div class="badge badge-neutral badge-sm" v-else>
                {{
                  recentContests.RecentContests.filter(
                    (contest) => contest.OJ == item.value
                  ).length
                }}
              </div>
            </a>
          </li>
        </ul>
        <div class="join flex-col sm:flex-row">
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
      <div
        class="overflow-x-hidden rounded-b-2xl"
        style="max-height: calc(100vh - 124px - 150px)"
      >
        <table class="table table-zebra">
          <thead>
            <tr>
              <th v-if="recentContests.searchInfo.OJ == 'All'">平台</th>
              <th
                v-for="(item, index) in [
                  '比赛名称',
                  '标签',
                  '赛制',
                  '开始时间',
                  '时长',
                ]"
                :key="index"
              >
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody v-auto-animate>
            <tr
              v-for="item in recentContests.RecentContests.filter(
                (item) =>
                  item.OJ == recentContests.searchInfo.OJ ||
                  recentContests.searchInfo.OJ == 'All'
              )"
              :key="item.CID"
              @click="recentContests.goToContest(item.URL)"
              target="_blank"
              class="cursor-pointer"
            >
              <th v-if="recentContests.searchInfo.OJ == 'All'">
                {{ item.OJ }}
              </th>
              <td>
                <span class="font-bold talbe-lg">{{ item.Title }}</span>
              </td>
              <td class="space-x-1 space-y-0.5 whitespace-nowrap">
                <span
                  class="badge badge-neutral badge-md font-bold"
                  v-for="(label, index) in item.Label.split(/;/).filter(
                    (item) => item != '' && item != '/'
                  )"
                  :key="index"
                >
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
        <div class="p-3 text-center font-bold">
          原有方案已于 2024 年 5 月 12 日完工,&nbsp;但因为 Python
          性能不佳且占据大量内存,&nbsp;待重写
        </div>
      </div>
    </div>

    <div class="bg-white card shadow-lg Border">
      <div class="items-center p-6 inline-block">
        <div class="flex flex-col md:flex-row md:space-x-6">
          <div class="w-40">
            <div class="mb-2 flex justify-between">
              <div class="font-bold">Codeforces</div>
              <div>{{ ratingRank.Calculation.Codeforces }}'</div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              v-model="ratingRank.Calculation.Codeforces"
              class="range"
              step="20"
            />
          </div>
          <div class="w-40">
            <div class="mb-2 flex justify-between">
              <div class="font-bold">Nowcoder</div>
              <div>{{ ratingRank.Calculation.Nowcoder }}'</div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              v-model="ratingRank.Calculation.Nowcoder"
              class="range"
              step="20"
            />
          </div>
          <div class="w-40">
            <div class="mb-2 flex justify-between">
              <div class="font-bold">Atcoder</div>
              <div>{{ ratingRank.Calculation.Atcoder }}'</div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              v-model="ratingRank.Calculation.Atcoder"
              class="range"
              step="20"
            />
          </div>
        </div>
      </div>
      <div
        class="overflow-x-hidden rounded-b-2xl"
        style="max-height: calc(100vh - 124px - 160px)"
      >
        <table class="table table-zebra text-center">
          <thead>
            <tr>
              <th
                v-for="(item, index) in [
                  '排名',
                  '用户名',
                  '综合 Rating',
                  'Codeforces',
                  'Nowcoder',
                  'Atcoder',
                ]"
                :key="index"
              >
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
                <div
                  class="tooltip"
                  :data-tip="item.CodeforcesID"
                  v-if="item.CodeforcesID"
                  :class="{
                    'cursor-pointer text-blue-500': item.CodeforcesID != '',
                  }"
                  @click="
                    $router.push({
                      name: 'CodeforcesStatistics',
                      params: { CFID: item.CodeforcesID },
                    })
                  "
                >
                  {{ item.CodeforcesRating }} (Max.
                  {{ item.CodeforcesMaxRating }})
                </div>
                <div v-else>-</div>
              </th>
              <td>
                <div
                  class="tooltip"
                  :data-tip="item.NowcoderID"
                  v-if="item.NowcoderID"
                >
                  {{ item.NowcoderRating }} (Max. {{ item.NowcoderMaxRating }})
                </div>
                <div v-else>-</div>
              </td>
              <td>
                <div
                  class="tooltip"
                  :data-tip="item.AtcoderID"
                  v-if="item.AtcoderID"
                >
                  {{ item.AtcoderRating }} (Max. {{ item.AtcoderMaxRating }})
                </div>
                <div v-else>-</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Training">
import { onMounted, reactive, watch, ref } from "vue";
import { useRoute } from "vue-router";

import { DownloadTwo, Muscle, Refresh, Code } from "@icon-park/vue-next";
import { push } from "notivue";

import {
  _getRecentContests,
  _scrapeRecentContests,
  _getRatingRank,
  _scrapeRating,
} from "@/apis/training";
import { _getPublicRecentContests } from "@/apis/public";
import { _getUsersOnline } from "@/apis/user";
import PageHeader from "@/components/Main/PageHeader.vue";
import {
  recentContestLabelOptions,
  recentContestsOriginOptions,
  ratingRankOriginOptions,
} from "@/config";
import { RecentContestsType, RatingRankType } from "@/interfaces/training";
import { useUserDataStore } from "@/stores/UserData";
import { ConvertTools } from "@/utils/globalFunctions";

const userDataStore = useUserDataStore();
const route = useRoute();

let recentContests = reactive<RecentContestsType>({
  RecentContests: [],
  Count: 0,
  Page: 0,
  Limit: 20,

  searchInfo: {
    OJ: "All",
  },

  get() {
    // _getRecentContests({}).then((data: any) => {
    //   this.RecentContests = data.RecentContests.filter(
    //     (item: any) => item.Duration <= 43200000
    //   );
    //   this.RecentContests.sort((a, b) => a.StartTime - b.StartTime);
    //   this.Count = this.RecentContests.length;
    //   this.Page = data.Page;
    //   this.Limit = data.Limit;
    //   this.RecentContests.forEach((item: any) => {
    //     item.Label = "";
    //     recentContestLabelOptions.forEach((labelOption: any) => {
    //       if (item.Title.includes(labelOption.label))
    //         item.Label += labelOption.value + ";";
    //     });
    //   });
    //   push.success({
    //     title: "获取成功",
    //     message: `一共获取了 ${this.Count} 个比赛`,
    //   });
    // });
    _getPublicRecentContests().then((data: any) => {
      this.RecentContests = data.map((contest) => {
        // console.log(contest.endTimeStamp - contest.startTimeStamp);
        return {
          CID: contest.link.split("/").pop() || "", // 假设比赛 ID 是链接的最后一个部分
          Title: contest.name,
          Type: contest.oiContest ? "OI" : "ACM",
          StartTime: contest.startTimeStamp,
          Duration: (contest.endTimeStamp - contest.startTimeStamp) * 1000,
          OJ: contest.oj,
          URL: contest.link,
          Label: contest.status,
        };
      });
      this.Count = this.RecentContests.length;
      push.success({
        title: "获取成功",
        message: `一共获取了 ${this.Count} 个比赛`,
      });
    });
  },

  goToContest(url: string) {
    window.open(url, "_blank");
  },

  scrape() {
    _scrapeRecentContests({}).then(() => {
      push.info({
        title: "请求成功",
        message: "正在重新获取近期比赛",
      });
    });
  },
});

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
          title: "获取成功",
          message: `一共获取了 ${this.Count} 位用户评分`,
        });
      })
      .then(() => {
        ratingRank.calculateRating();
      });
  },

  scrape() {
    _scrapeRating({}).then(() => {
      push.info({
        title: "请求成功",
        message: "正在重新获取用户评分",
      });
    });
  },

  calculateRating() {
    let sum =
      Number(this.Calculation.Codeforces) +
      Number(this.Calculation.Nowcoder) +
      Number(this.Calculation.Atcoder);
    ratingRank.RatingRank.forEach((item: any) => {
      if (sum == 0) item.Rating = 0;
      else
        item.Rating =
          (item.CodeforcesRating * this.Calculation.Codeforces) / sum +
          (item.NowcoderRating * this.Calculation.Nowcoder) / sum +
          (item.AtcoderRating * this.Calculation.Atcoder) / sum;
    });
    ratingRank.RatingRank.sort((a: any, b: any) => b.Rating - a.Rating);
  },
});
const UIDs = ref<string[]>([]);
onMounted(() => {
  recentContests.get();
  // ratingRank.get();
  _getUsersOnline({
    Page: 1,
    Limit: 20,
  }).then((data: any) => {
    UIDs.value = data.UIDs;
  });
});

watch(
  () => ratingRank.Calculation,
  () => {
    ratingRank.calculateRating();
  },
  {
    deep: true,
  }
);
</script>
