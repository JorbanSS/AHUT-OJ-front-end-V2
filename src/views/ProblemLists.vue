<template>
  <div class="flex space-y-4 card bg-white shadow-lg Border p-4 mx-auto w-fit">
    <div class="join w-fit">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">题单号</span>
        <input type="text" class="grow w-60" v-model="problemLists.searchInfo.LID" />
      </label>
      <button class="btn join-item btn-neutral"
        @click="problemLists.goToProblemList(problemLists.searchInfo.LID)">跳转</button>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border">
    <div class="overflow-x-hidden rounded-t-2xl">
      <table class="table table-zebra table-pin-rows">
        <thead>
          <tr>
            <template v-for="[title, style] in [
              ['题单号', 'hidden md:table-cell'],
              ['题单名称'],
              ['标签'],
              ['创建时间', 'hidden md:table-cell'],
              ['创建人', 'hidden md:table-cell']
            ]" :key="title">
              <th :class="style">{{ title }}</th>
            </template>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr v-for="item in problemLists.problemLists" :key="item.LID"
            @click="$router.push({
              name: 'ProblemList',
              params: {
                LID: item.LID,
              }
            });" class="cursor-pointer">
            <th class="hidden md:table-cell">
              {{ item.LID }}
            </th>
            <td class="font-bold talbe-lg">
              {{ item.Title }}
            </td>
            <td class="space-y-0.5">
              <template v-for="labelItem in problemListLabelOptions">
                <span class="badge badge-neutral whitespace-nowrap mr-1"
                  v-if="item.Title.split(' - ').length > 1 && item.Title.split(' - ')[0] == labelItem.value">
                  {{ labelItem.value }}
                </span>
              </template>
              <span class="badge badge-neutral whitespace-nowrap mr-1"
                v-if="item.Title.endsWith('(By Clone)')">Cloned</span>
            </td>
            <td class="hidden md:table-cell">
              {{ ConvertTools.PrintTime(item.StartTime, 1) }}
            </td>
            <td class="hidden md:table-cell">
              {{ item.UID }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :page="problemLists.page" :maxPage="maxPage" :changePage="problemLists.changePage" />
  </div>
</template>

<script lang="ts" setup name="ProblemLists">
import { computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import { push } from 'notivue';

import { _getProblemLists } from '@/apis/problemList';
import Pagination from "@/components/Main/Pagination.vue";
import { problemListLabelOptions } from '@/config';
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
    router.push({
      name: 'ProblemList',
      params: {
        LID: LID,
      },
    });
  },
})

onMounted(() => {
  problemLists.get(true);
})

watch(() => problemLists.page, () => {
  problemLists.get();
})

const maxPage = computed(() => Math.ceil(problemLists.count / problemLists.limit));

</script>