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
          <th v-for="(item, index) in ['题号', '题目名称', '标签', '通过率']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in problems.problems" :key="item.PID" @click="router.push(`/problem/${item.PID}`);"
          class="cursor-pointer">
          <th>
            {{ item.PID }}
          </th>
          <td>
            <div class="font-bold talbe-lg">{{ item.Title }}</div>
          </td>
          <td class="space-x-1 space-y-0.5">
            <span class="badge badge-neutral badge-md" v-for="(label, index) in item.Label.split(/;| /)" :key="index"
              v-if="item.label != ''">
              {{ label }}
            </span>
          </td>
          <td>
            <progress class="progress progress-success w-20"
              :value="ConvertTools.Percentage(item.Accepted, item.Submit)" max="100"></progress>
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
          {{ problems.page }} / {{ Math.floor(problems.count / problems.limit + 1) }}
        </button>
        <button class="join-item btn" @click="changePage(1)">
          <right theme="outline" size="20" />
        </button>
        <button class="join-item btn" @click="changePageTo(Math.floor(problems.count / problems.limit + 1))">
          <double-right theme="outline" size="20" />
        </button>
      </div>
      <div class="join">
        <div>
          <div>
            <input class="input input-bordered join-item w-20" placeholder="" v-model="toPage" type="number" min="1"
              :max="Math.floor(problems.count / problems.limit + 1)" />
          </div>
        </div>
        <button class="btn join-item" @click="changePageTo(toPage)">跳转页面</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Problems">
import { ref, reactive, onMounted, watch } from 'vue';
import { type ProblemsType, type ProblemSimplifiedType } from '@/type/problem';
import { Get } from '@/utils/axios/request';
import { Left, Right, DoubleLeft, DoubleRight } from '@icon-park/vue-next';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useRouter } from 'vue-router';

const router = useRouter();

let toPage = ref();

let problems = reactive<ProblemsType>({
  problems: Array<ProblemSimplifiedType>(),
  count: 0,
  page: 1,
  limit: 20,
  searchInfo: {},
  init() {
    problems.count = 0;
    problems.page = 1;
    problems.limit = 20;
    problems.searchInfo = {
      PID: undefined,
      Title: undefined,
      Source: undefined,
      Label: undefined,
    }
  }
})


function getProblems(showInfo: boolean = false) {
  Get('api/problem/list', {
    Page: problems.page - 1,
    Limit: problems.limit,
    PType: '',
    Label: problems.searchInfo.Label,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        problems.count = data.Count;
        problems.problems = data.Data;
      }
    })
    .then(() => {
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: `一共获取了 ${problems.count} 道题目`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function changePageTo(page: number) {
  if (1 <= page && page <= Math.floor(problems.count / problems.limit) + 1) problems.page = page;
}

function changePage(page: number) {
  if (problems.page + page >= 1 && problems.page + page <= Math.floor(problems.count / problems.limit) + 1) problems.page += page;
}

onMounted(() => {
  getProblems(true);
})

watch(() => problems.page, () => {
  getProblems();
})

</script>

<style scoped></style>
@/utils/globalFunctions