<template>
  <div class="card bg-white shadow-lg Border p-6">
    <div class="join w-fit">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">比赛号</span>
        <input type="text" class="grow w-32" v-model="contests.searchInfo.CID" />
      </label>
      <button class="btn join-item btn-neutral" @click="contests.goToContest(contests.searchInfo.CID)">跳转</button>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th v-for="(item, index) in ['状态', '比赛号', '比赛名称', '标签', '起止时间', '撰题人']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in contests.contests" :key="item.CID" @click="router.push(`/contest/${item.CID}`)"
          class="cursor-pointer">
          <td class="font-bold talbe-lg">
            {{ item.status }}
          </td>
          <th>
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
          <td>
            {{ item.UID }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mx-auto py-4 flex space-x-4">
      <Pagination :page="contests.page" :maxPage="maxPage" :changePage="contests.changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Contests">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useRouter } from 'vue-router';

import Pagination from "@/components/Main/Pagination.vue";
import { type ContestsType, type ContestSimplifiedType } from '@/type/contest';
import { _getContests } from '@/api/contest';

const router = useRouter();

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

onMounted(() => {
  contests.get(true);
})

watch(() => contests.page, () => {
  contests.get(true);
})

const maxPage = computed(() => Math.floor(contests.count / contests.limit) + 1);

</script>