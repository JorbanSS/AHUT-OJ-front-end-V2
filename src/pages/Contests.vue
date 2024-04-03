<template>
  <div class="card bg-white shadow-lg Border">
    <div class="text-2xl mx-4 my-4">
      <div class="join">
        <div>
          <div>
            <input class="input input-bordered join-item" placeholder="Search" />
          </div>
        </div>
        <select class="select select-bordered join-item">
          <option disabled selected>Filter</option>
          <option>Local</option>
          <option>CodeForces</option>
          <option>AtCoder</option>
        </select>
        <button class="btn join-item btn-neutral">搜索</button>
      </div>
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
        <tr v-for="item in contests.contests" :key="item.CID" @click="router.push(`/contest/${item.CID}`)" class="cursor-pointer">
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
      <div class="join">
        <button class="join-item btn" @click="changePageTo(1)">
          <double-left theme="outline" size="20" />
        </button>
        <button class="join-item btn" @click="changePage(-1)">
          <left theme="outline" size="20" />
        </button>
        <button class="join-item btn">
          {{ contests.page }} / {{ Math.floor(contests.count / contests.limit + 1) }}
        </button>
        <button class="join-item btn" @click="changePage(1)">
          <right theme="outline" size="20" />
        </button>
        <button class="join-item btn" @click="changePageTo(Math.floor(contests.count / contests.limit + 1))">
          <double-right theme="outline" size="20" />
        </button>
      </div>
      <div class="join">
        <div>
          <div>
            <input class="input input-bordered join-item w-20" placeholder="" v-model="toPage" type="number" min="1"
              :max="Math.floor(contests.count / contests.limit + 1)" />
          </div>
        </div>
        <button class="btn join-item" @click="changePageTo(toPage)">跳转页面</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Contests">
import { ref, reactive, onMounted, watch } from 'vue';
import { type ContestsType, type ContestSimplifiedType } from '@/type/contest';
import '@/utils/axios/request'
import { Get } from '@/utils/axios/request'
import { Left, Right, DoubleLeft, DoubleRight } from '@icon-park/vue-next';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useRouter } from 'vue-router';

const router = useRouter();

let toPage = ref();

let contests = reactive<ContestsType>({
  contests: Array<ContestSimplifiedType>(),
  count: 0,
  page: 1,
  limit: 20,
  UID: undefined,
  searchInfo: {},
  init() {
    contests.count = 0;
    contests.page = 1;
    contests.limit = 20;
    contests.searchInfo = {
      CID: undefined,
      Title: undefined,
      Source: undefined,
      Label: undefined,
    }
  }
})

function getContests(showInfo: boolean = false) {
  Get('api/contest/list', {
    Page: contests.page - 1,
    Limit: contests.limit,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        contests.count = data.Size;
        contests.contests = data.Data;
      }
    })
    .then(() => {
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: `一共获取了 ${contests.count} 场比赛`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function changePageTo(page: number) {
  if (1 <= page && page <= Math.floor(contests.count / contests.limit) + 1) contests.page = page;
}

function changePage(page: number) {
  if (contests.page + page >= 1 && contests.page + page <= Math.floor(contests.count / contests.limit) + 1) contests.page += page;
}

onMounted(() => {
  getContests(true);
})

watch(() => contests.page, () => {
  getContests();
})


</script>