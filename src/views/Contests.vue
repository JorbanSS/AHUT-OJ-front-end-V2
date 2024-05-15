<template>
  <div class="flex space-y-4 card bg-white shadow-lg Border p-4 mx-auto w-fit">
    <div class="join w-fit">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">比赛号</span>
        <input type="text" class="grow w-60" v-model="contests.searchInfo.CID" />
      </label>
      <button class="btn join-item btn-neutral" @click="contests.goToContest(contests.searchInfo.CID)">跳转</button>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border">
    <div class="overflow-x-hidden rounded-t-2xl">
      <table class="table table-zebra table-pin-rows">
        <thead>
          <tr>
            <th class="hidden md:table-cell">
              状态
            </th>
            <th class="hidden lg:table-cell">
              比赛号
            </th>
            <th>
              比赛名称
            </th>
            <th>
              标签
            </th>
            <th>
              起止时间
            </th>
            <th class="hidden lg:table-cell">
              撰题人
            </th>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr v-for="item in contests.contests" :key="item.CID"
            @click="item.Status ? router.push(`/contest/${item.CID}`) : 0"
            :class="{ 'cursor-pointer': item.Status, 'cursor-not-allowed': item.Status == 0 }">
            <td class="font-bold talbe-lg whitespace-nowrap hidden md:table-cell">
              {{ ContestStatus[item.Status] }}
            </td>
            <th class="hidden lg:table-cell">
              {{ item.CID }}
            </th>
            <td class="font-bold talbe-lg">
              <div>{{ item.Title }}</div>
            </td>
            <td class="space-x-1 space-y-0.5">
              <span class="badge badge-neutral badge-md" v-if="item.Type == 1">
                ICPC
              </span>
              <span class="badge badge-neutral badge-md" v-else>
                OI
              </span>
              <span class="badge badge-neutral badge-md" v-if="item.IsPublic == 1">
                公开
              </span>
              <span class="badge badge-neutral badge-md" v-else>
                加密
              </span>
            </td>
            <td>
              {{ ConvertTools.PrintTime(item.BeginTime, 1) }}
              ~
              {{ ConvertTools.PrintTime(item.EndTime) }}
            </td>
            <td class="hidden lg:table-cell">
              {{ item.UID }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mx-auto py-4 flex space-x-4">
      <Pagination :page="contests.page" :maxPage="maxPage" :changePage="contests.changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Contests">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { push } from 'notivue';

import { _getContests } from '@/apis/contest';
import Pagination from "@/components/Main/Pagination.vue";
import { type ContestSimplifiedType, type ContestsType } from '@/interfaces/contest';
import { ConvertTools, getServerTime } from '@/utils/globalFunctions';

const router = useRouter();

let TimeNow = ref(0);

let ContestStatus = [
  '未开始',
  '进行中',
  '已结束',
];

let contests = reactive<ContestsType>({
  contests: Array<ContestSimplifiedType>(),
  count: 0,
  page: 1,
  limit: 20,
  UID: '',
  searchInfo: {
    CID: '',
  },

  get(showInfo = false) {
    let params = {
      Page: contests.page - 1,
      Limit: contests.limit,
    };
    _getContests(params)
      .then((data: any) => {
        contests.count = data.Size;
        contests.contests = data.Data;
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${contests.count} 场比赛`,
          })
        }
        contests.setStatus();
      })
  },

  setStatus() {
    this.contests.forEach((item) => {
      if (item.EndTime < TimeNow.value) item.Status = 2;
      else if (item.BeginTime > TimeNow.value) item.Status = 0;
      else item.Status = 1;
    })
  },

  goToContest(CID: string) {
    if (CID == "") {
      push.warning({
        title: "无法跳转",
        message: "未填写比赛号",
      })
      return;
    };
    router.push('/contest/' + CID);
  },

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) contests.page = page;
  },
})

function syncSeverTime() {
  getServerTime()
    .then((res: any) => {
      TimeNow.value = res;
      contests.get(true);
    })
}

onMounted(() => {
  syncSeverTime();
});

watch(() => contests.page, () => {
  syncSeverTime();
});

const maxPage = computed(() => Math.ceil(contests.count / contests.limit));

</script>