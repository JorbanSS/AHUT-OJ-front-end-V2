<template>
  <div class="flex flex-row space-x-6 card bg-white shadow-lg Border p-6">
    <div class="join w-fit">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">题号</span>
        <input type="text" class="grow w-32" v-model="problems.searchInfo.PID" />
      </label>
      <button class="btn join-item btn-neutral" @click="problems.goToProblem(problems.searchInfo.PID)">跳转</button>
    </div>
    <div class="join w-fit">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">标签</span>
        <input type="text" class="grow w-32" v-model="problems.searchInfo.Label" />
      </label>
      <select class="select select-bordered join-item" v-model="problems.searchInfo.PType">
        <option v-for="item in problemTypeOptions" :value="item.value" :key="item.value">
          {{ item.label }}
        </option>
      </select>
      <button class="btn join-item btn-neutral" @click="problems.get(true)">搜索</button>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border">
    <div class="overflow-x-hidden rounded-t-2xl" style="max-height: calc(100vh - 124px - 252px)">
      <table class="table table-zebra table-pin-rows">
        <thead>
          <tr>
            <th v-for="(item, index) in ['题号', '题目名称', '标签', '通过率']" :key="index">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr v-for="item in problems.problems" :key="item.PID" @click="router.push(`/problem/${item.PID}`);"
            class="cursor-pointer">
            <th>
              {{ item.PID }}
            </th>
            <td>
              <span class="font-bold talbe-lg Nowarp">{{ item.Title }}</span>
            </td>
            <td class="space-x-1 space-y-0.5">
              <span class="badge badge-neutral badge-md"
                v-for="(label, index) in item.Label.split(/;| /).filter(item => item != '' && item != '/')"
                :key="index">
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
    </div>
    <div class="mx-auto py-4 flex space-x-4">
      <Pagination :page="problems.page" :maxPage="maxPage" :changePage="problems.changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Problems">
import { computed, onMounted, reactive, watch } from 'vue';

import { push } from "notivue";
import { useRouter } from 'vue-router';

import { _getProblems } from '@/apis/problem';
import Pagination from "@/components/Main/Pagination.vue";
import { problemTypeOptions } from '@/config';
import { type ProblemSimplifiedType, type ProblemsType } from '@/interfaces/problem';
import { ConvertTools } from '@/utils/globalFunctions';

const router = useRouter();

let problems = reactive<ProblemsType>({
  problems: Array<ProblemSimplifiedType>(),
  count: 0,
  page: 1,
  limit: 20,
  searchInfo: {
    PID: '',
    Label: '',
    PType: '',
  },

  get(showInfo: boolean = false) {
    let params = {
      Page: problems.page - 1,
      Limit: problems.limit,
      PType: problems.searchInfo.PType,
      Label: problems.searchInfo.Label,
    }
    _getProblems(params)
      .then((data: any) => {
        problems.count = data.Count;
        problems.problems = data.Data;
      })
      .then(() => {
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${problems.count} 道题目`,
          })
        }
      })
  },

  goToProblem(PID: string) {
    if (PID == "") {
      push.warning({
        title: "无法跳转",
        message: "未填写题号",
      })
      return;
    };
    router.push('/problem/' + PID);
  },

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) problems.page = page;
  },
})

onMounted(() => {
  problems.get(true);
})

watch(() => problems.page, () => {
  problems.get();
})

const maxPage = computed(() => Math.ceil(problems.count / problems.limit));

</script>