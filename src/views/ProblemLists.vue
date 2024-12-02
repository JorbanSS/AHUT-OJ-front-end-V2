<template>
  <MainContainer>
    <PageHeader
      Title="题单"
      :IconName="Bill"
      :Infomation="`收录了共 ${problemLists.count} 个题单，以供 ACM 集训队训练、赛后补题、程序设计赛竞赛公选课、C 语言程序设计必修课、算法设计与分析必修课使用。`"
    >
      <div class="flex justify-center">
        <div class="join">
          <label class="input input-bordered flex items-center gap-2 join-item">
            <span class="whitespace-nowrap text-sm">题单号</span>
            <input
              type="text"
              class="grow"
              v-model="problemLists.searchInfo.LID"
            />
          </label>
          <button
            class="btn join-item"
            @click="problemLists.goToProblemList(problemLists.searchInfo.LID)"
          >
            <go-on theme="outline" size="18" />
            <span>跳转</span>
          </button>
        </div>
      </div>
    </PageHeader>

    <Card class="p-0 overflow-x-hidden">
      <Col class="p-0">
        <table class="table table-zebra table-pin-rows">
          <thead>
            <tr>
              <template
                v-for="[title, style] in [
                  ['题单号', 'hidden md:table-cell'],
                  ['题单名称'],
                  ['标签'],
                  ['创建时间', 'hidden md:table-cell'],
                  ['创建人', 'hidden md:table-cell'],
                ]"
                :key="title"
              >
                <th :class="style">{{ title }}</th>
              </template>
            </tr>
          </thead>
          <tbody v-auto-animate>
            <tr
              v-for="item in problemLists.problemLists"
              :key="item.LID"
              @click="
                $router.push({
                  name: 'ProblemList',
                  params: {
                    LID: item.LID,
                  },
                })
              "
              class="cursor-pointer"
            >
              <th class="hidden md:table-cell">
                {{ item.LID }}
              </th>
              <td class="font-bold talbe-lg">
                {{ item.Title }}
              </td>
              <td class="space-y-0.5">
                <template v-for="labelItem in problemListLabelOptions">
                  <span
                    class="badge badge-neutral whitespace-nowrap mr-1 font-bold"
                    v-if="
                      item.Title.split(' - ').length > 1 &&
                      item.Title.split(' - ')[0] == labelItem.value
                    "
                  >
                    {{ labelItem.value }}
                  </span>
                </template>
                <span
                  class="badge text-white whitespace-nowrap mr-1 font-bold"
                  v-if="item.Title.endsWith('(By Clone)')"
                  style="background-color: #4398da"
                  >Cloned</span
                >
              </td>
              <td class="hidden md:table-cell">
                {{ ConvertTools.PrintTime(item.StartTime, 1) }}
              </td>
              <td class="hidden md:table-cell">
                <span
                  class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer"
                  data-tip="查看用户主页"
                  @click.stop="
                    $router.push({
                      name: 'User',
                      params: {
                        UID: item.UID,
                      },
                    })
                  "
                >
                  {{ item.UID }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <Pagination
          :page="problemLists.page"
          :maxPage="maxPage"
          :changePage="problemLists.changePage"
          class="pb-6"
        />
      </Col>
    </Card>
  </MainContainer>
</template>

<script lang="ts" setup name="ProblemLists">
import { computed, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";

import { Bill, GoOn } from "@icon-park/vue-next";
import { push } from "notivue";

import { _getProblemLists } from "@/apis/problemList";
import Pagination from "@/components/Main/Pagination.vue";
import { problemListLabelOptions } from "@/config";
import {
  type ProblemListSimplifiedType,
  type ProblemListsType,
} from "@/interfaces/problemList";
import { ConvertTools } from "@/utils/globalFunctions";
import PageHeader from "@/components/Main/PageHeader.vue";

const router = useRouter();

let problemLists = reactive<ProblemListsType>({
  problemLists: Array<ProblemListSimplifiedType>(),
  count: 0,
  page: 1,
  limit: 20,
  UID: "",
  StartTime: 0,
  searchInfo: {
    LID: undefined,
  },

  get(showInfo = false) {
    let params = {
      Page: problemLists.page - 1,
      Limit: problemLists.limit,
    };
    _getProblemLists(params).then((data: any) => {
      // console.log(data)
      problemLists.count = data.Size;
      problemLists.problemLists = data.Data;
      if (showInfo) {
        push.success({
          title: "获取成功",
          message: `一共获取了 ${problemLists.count} 个题单`,
        });
      }
    });
  },

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) problemLists.page = page;
    return problemLists.page;
  },

  goToProblemList(LID: string) {
    if (LID == "") {
      push.warning({
        title: "无法跳转",
        message: "未填写题单号",
      });
      return;
    }
    router.push({
      name: "ProblemList",
      params: {
        LID: LID,
      },
    });
  },
});

onMounted(() => {
  problemLists.get(true);
});

watch(
  () => problemLists.page,
  () => {
    problemLists.get();
  }
);

const maxPage = computed(() =>
  Math.ceil(problemLists.count / problemLists.limit)
);
</script>
