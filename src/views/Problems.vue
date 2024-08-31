<template>
  <div class="m-6 flex flex-col gap-6 max-w-6xl mx-auto">
    <PageHeader Title="题库" :IconName="DocumentFolder"
      :Infomation="`收录了共 ${problems.count} 条题目，包含自主命题、LOJ、Codeforces 和 Atcoder 等知名 OJ 的题目。`">
      <div class="flex flex-col gap-3">
        <div class="flex justify-center">
          <div class="join">
            <label class="input input-bordered flex items-center gap-2 join-item">
              <span class="whitespace-nowrap text-sm">题号</span>
              <input type="text" class="grow" v-model="problems.searchInfo.PID" />
            </label>
            <button class="btn join-item" @click="problems.goToProblem(problems.searchInfo.PID)">
              <go-on theme="outline" size="18" />
              <span>跳转</span>
            </button>
          </div>
        </div>
        <div class="flex justify-center gap-2 flex-col md:flex-row">
          <div class="join md:join-horizontal join-vertical">
            <label class="input input-bordered flex items-center gap-2 join-item">
              <span class="whitespace-nowrap">标题</span>
              <input type="text" class="grow" v-model="problems.searchInfo.Keyword" />
            </label>
            <label class="input input-bordered flex items-center gap-2 join-item">
              <span class="whitespace-nowrap">标签</span>
              <input type="text" class="grow" v-model="problems.searchInfo.Label" />
            </label>
            <select class="select select-bordered join-item" v-model="problems.searchInfo.PType">
              <option v-for="item in problemTypeOptions" :value="item.value" :key="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>
          <button class="btn md:join-item md:w-24 w-full" @click="problems.get(true)">
            <search theme="outline" size="18" />
            <span>搜索</span>
          </button>
        </div>
      </div>
    </PageHeader>
    
    <div class="bg-white card shadow-lg Border">
      <div class="overflow-x-hidden rounded-t-2xl">
        <table class="table table-zebra table-pin-rows">
          <thead>
            <tr>
              <template v-for="[title, style] in [
                ['题号'],
                ['题目名称'],
                ['标签', 'hidden md:table-cell'],
                ['通过率', 'hidden sm:table-cell']
              ]" :key="title">
                <th :class="style">{{ title }}</th>
              </template>
            </tr>
          </thead>
          <tbody v-auto-animate>
            <tr v-for="item in problems.problems" :key="item.PID" @click="$router.push({
              name: 'Problem',
              params: {
                PID: item.PID,
              },
            })" class="cursor-pointer">
              <th>
                {{ item.PID }}
              </th>
              <td>
                <span class="font-bold talbe-lg Nowarp">{{ item.Title }}</span>
              </td>
              <td class="space-y-0.5 hidden md:table-cell">
                <span class="badge badge-neutral mr-1 font-bold"
                  v-for="(label, index) in item.Label.split(/;| /).filter(item => item != '' && item != '/')"
                  :key="index">
                  {{ label }}
                </span>
              </td>
              <td class="hidden sm:table-cell">
                <progress class="progress progress-success w-20"
                  :value="ConvertTools.Percentage(item.Accepted, item.Submit)" max="100"></progress>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :page="problems.page" :maxPage="maxPage" :changePage="problems.changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Problems">
import { computed, onMounted, reactive, watch } from 'vue';

import { DocumentFolder, Search, GoOn } from "@icon-park/vue-next";
import { push } from "notivue";
import { useRouter } from 'vue-router';

import { _getProblems } from '@/apis/problem';
import Pagination from "@/components/Main/Pagination.vue";
import { problemTypeOptions } from '@/config';
import { type ProblemSimplifiedType, type ProblemsType } from '@/interfaces/problem';
import { ConvertTools } from '@/utils/globalFunctions';
import PageHeader from '@/components/Main/PageHeader.vue';

const router = useRouter();

const filterNumber = computed(() => Number(problems.searchInfo.PID != '') + Number(problems.searchInfo.Label != '') + Number(problems.searchInfo.PType != '') + Number(problems.searchInfo.Keyword != ''))

let problems = reactive<ProblemsType>({
  problems: Array<ProblemSimplifiedType>(),
  count: 0,
  page: 1,
  limit: 20,
  searchInfo: {
    PID: '',
    Label: '',
    PType: '',
    Keyword: '',
  },

  get(showInfo: boolean = false) {
    let params = {
      Page: problems.page - 1,
      Limit: problems.limit,
      PType: problems.searchInfo.PType,
      Label: problems.searchInfo.Label,
      Keyword: problems.searchInfo.Keyword,
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
    router.push({
      name: 'Problem',
      params: {
        PID: PID,
      },
    });
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