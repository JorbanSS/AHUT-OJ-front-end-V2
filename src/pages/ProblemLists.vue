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
          <th v-for="(item, index) in ['题单号', '题单名称', '标签', '创建时间', '创建人']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in problemLists.problemLists" :key="item.LID" @click="router.push(`/problemlist/${item.LID}`);"
          class="cursor-pointer">
          <th>
            {{ item.LID }}
          </th>
          <td class="font-bold talbe-lg">
            {{ item.Title }}
          </td>
          <td class="space-x-1 space-y-0.5">
            <span class="badge badge-neutral badge-md">
              Offical
            </span>
          </td>
          <td>
            {{ ConvertTools.PrintTime(item.StartTime, 1) }}
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
          {{ problemLists.page }} / {{ Math.floor(problemLists.count / problemLists.limit + 1) }}
        </button>
        <button class="join-item btn" @click="changePage(1)">
          <right theme="outline" size="20" />
        </button>
        <button class="join-item btn" @click="changePageTo(Math.floor(problemLists.count / problemLists.limit + 1))">
          <double-right theme="outline" size="20" />
        </button>
      </div>
      <div class="join">
        <div>
          <div>
            <input class="input input-bordered join-item w-20" placeholder="" v-model="toPage" type="number" min="1"
              :max="Math.floor(problemLists.count / problemLists.limit + 1)" />
          </div>
        </div>
        <button class="btn join-item" @click="changePageTo(toPage)">跳转页面</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="ProblemLists">
import { ref, reactive, onMounted, watch } from 'vue';
import { type ProblemListsType, type ProblemListSimplifiedType } from '@/type/problemList';
import '@/utils/axios/request'
import { Get } from '@/utils/axios/request'
import { Left, Right, DoubleLeft, DoubleRight } from '@icon-park/vue-next';
import { push } from 'notivue';
import { ConvertTools } from '@/assets/ts/globalFunctions';
import { useRouter } from 'vue-router';

const router = useRouter();

let toPage = ref();

let problemLists = reactive<ProblemListsType>({
  problemLists: Array<ProblemListSimplifiedType>(),
  count: 0,
  page: 1,
  limit: 20,
  UID: undefined,
  StartTime: 0,
  init() {
    problemLists.count = 0;
    problemLists.page = 1;
    problemLists.limit = 20;
  }
})

function getProblemLists(showInfo: boolean = false) {
  Get('api/training/list', {
    Page: problemLists.page - 1,
    Limit: problemLists.limit,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        problemLists.count = data.Size;
        problemLists.problemLists = data.Data;
      }
    })
    .then(() => {
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: `一共获取了 ${problemLists.count} 个题单`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function changePageTo(page: number) {
  if (1 <= page && page <= Math.floor(problemLists.count / problemLists.limit) + 1) problemLists.page = page;
}

function changePage(page: number) {
  if (problemLists.page + page >= 1 && problemLists.page + page <= Math.floor(problemLists.count / problemLists.limit) + 1) problemLists.page += page;
}

onMounted(() => {
  getProblemLists(true);
})

watch(() => problemLists.page, () => {
  getProblemLists();
})

</script>

<style scoped></style>