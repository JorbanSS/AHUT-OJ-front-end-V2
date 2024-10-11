<template>
    <div class="m-6 flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader Title="我的小组" :IconName="Peoples"
        :Infomation="'个人所属小组'">
        <div class="flex justify-center">
        </div>
      </PageHeader>
  
      <div class="bg-white card shadow-lg Border">
        <div class="overflow-x-hidden rounded-t-2xl">
          <table class="table table-zebra table-pin-rows">
            <thead>
              <tr>
                <template v-for="[title, style] in [
                  ['小组ID', 'hidden md:table-cell'],
                  ['小组名称'],
                  ['创建时间', 'hidden md:table-cell'],
                  ['创建人', 'hidden md:table-cell']
                ]" :key="title">
                  <th :class="style">{{ title }}</th>
                </template>
              </tr>
            </thead>
            <tbody v-auto-animate>
              <tr v-for="item in problemLists.problemLists" :key="item.LID" @click="$router.push({
                name: 'MyGroup',
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
                <td class="hidden md:table-cell">
                  {{ ConvertTools.PrintTime(item.StartTime, 1) }}
                </td>
                <td class="hidden md:table-cell">
                  <span class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer" data-tip="查看用户主页"
                    @click.stop="$router.push({
                      name: 'User',
                      params: {
                        UID: item.UID
                      }
                    })">
                    {{ item.UID }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :page="problemLists.page" :maxPage="maxPage" :changePage="problemLists.changePage" />
      </div>
      <!-- <div class="flex w-full">
      <div class="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">content</div>
      <div class="divider divider-horizontal"></div>
      <div class="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">content</div>
      </div> -->
    </div>
  </template>
  
  <script lang="ts" setup name="ProblemLists">
  import { computed, onMounted, reactive, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  import { Bill, GoOn, People, Peoples } from "@icon-park/vue-next";
  import { push } from 'notivue';
  
  import { _getProblemLists } from '@/apis/problemList';
  import Pagination from "@/components/Main/Pagination.vue";
  import { problemListLabelOptions } from '@/config';
  import { type ProblemListSimplifiedType, type ProblemListsType } from '@/interfaces/problemList';
  import { ConvertTools } from '@/utils/globalFunctions';
  import PageHeader from '@/components/Main/PageHeader.vue';
  
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
  
  })
  
  onMounted(() => {
    problemLists.get(true);
  })
  
  watch(() => problemLists.page, () => {
    problemLists.get();
  })
  
  const maxPage = computed(() => Math.ceil(problemLists.count / problemLists.limit));
  
  </script>