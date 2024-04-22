<template>
  <div class="card bg-white shadow-lg Border p-6">
    <div class="join w-fit">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">题单号</span>
        <input type="text" class="grow w-32" v-model="problemLists.searchInfo.LID" />
      </label>
      <button class="btn join-item btn-neutral"
        @click="problemLists.goToProblemList(problemLists.searchInfo.LID)">跳转</button>
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
      <Pagination :page="problemLists.page" :maxPage="maxPage" :changePage="problemLists.changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup name="ProblemLists">
import { computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import { push } from 'notivue';

import { _getProblemLists } from '@/apis/problemList';
import Pagination from "@/components/Main/Pagination.vue";
import { type ProblemListSimplifiedType, type ProblemListsType } from '@/interfaces/problemList';
import { ConvertTools } from '@/utils/globalFunctions';

const router = useRouter();

let problemLists = reactive<ProblemListsType>({
  problemLists: Array<ProblemListSimplifiedType>(),
  count: 0,
  page: 1,
  limit: 20,
  UID: '',
  StartTime: 0,
  searchInfo: {
    LID: undefined,
  },

  get(showInfo = false) {
    let params = {
      Page: problemLists.page - 1,
      Limit: problemLists.limit,
    };
    _getProblemLists(params)
      .then((data: any) => {
        problemLists.count = data.Size;
        problemLists.problemLists = data.Data;
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${problemLists.count} 个题单`,
          })
        }
      })
  },

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) problemLists.page = page;
  },

  goToProblemList(LID: string) {
    if (LID == "") {
      push.warning({
        title: "无法跳转",
        message: "未填写题单号",
      })
      return;
    };
    router.push(`/problemlist/${LID}`);
  },
})

onMounted(() => {
  problemLists.get(true);
})

watch(() => problemLists.page, () => {
  problemLists.get();
})

const maxPage = computed(() => Math.floor(problemLists.count / problemLists.limit) + 1);

</script>