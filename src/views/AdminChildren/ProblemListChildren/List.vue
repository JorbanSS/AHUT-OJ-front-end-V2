<template>
  <div class="m-6"></div>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <bill theme="outline" size="18" />
          题单列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="$router.push({ name: 'AddProblemList' })">
          <add theme="outline" size="18" />
          新增题单
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base hover:text-red-500" @click="problemLists.delete()">
          <delete-one theme="outline" size="18" hover:fill="#EC4545" />
          删除题单
        </div>
      </li>
    </ul>
  </div>
  <div class="card bg-white shadow-lg Border mx-auto max-w-5xl">
    <div class="text-2xl p-6">
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
  <div class="m-6"></div>
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th><input type="checkbox" :checked="allSelected" class="checkbox" @click="switchAllSelectedStatus()"></th>
          <th>题单号</th>
          <th>题单名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in problemLists.problemLists" :key="item.PID" @click="switchSelectedStatus(index)"
          class="cursor-pointer">
          <td>
            <input type="checkbox" :checked="item.Selected == true" class="checkbox" />
          </td>
          <th>{{ item.LID }}</th>
          <td>
            <div class="font-bold talbe-lg">{{ item.Title }}</div>
          </td>
          <td class="flex justify-center space-x-2">
            <button class="btn btn-sm btn-neutral" @click.stop="$router.push({
              name: 'EditProblemList',
              params: {
                LID: item.LID,
              }
            })">
              <edit-two theme="outline" size="18" />
              编辑
            </button>
            <button class="btn btn-neutral btn-sm" @click.stop="problemLists.delete(item.LID)">
              <delete-one theme="outline" size="16" />
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :page="problemLists.page" :maxPage="maxPage" :changePage="problemLists.changePage" />
  </div>
</template>

<script lang="ts" setup name="ProblemListsList">
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { Add, Bill, DeleteOne, EditTwo } from '@icon-park/vue-next';
import { push } from 'notivue';

import { _deleteProblemLists, _getProblemLists } from '@/apis/problemList';
import Pagination from "@/components/Main/Pagination.vue";
import { type ProblemListSimplifiedType, type ProblemListsType } from '@/interfaces/problemList';

let allSelected = ref<boolean>(false);

function switchSelectedStatus(index: number) {
  problemLists.problemLists[index].Selected = !problemLists.problemLists[index].Selected;
}

function switchAllSelectedStatus(status?: boolean) {
  if (status == undefined) {
    allSelected.value = !allSelected.value;
  }
  else {
    allSelected.value = status;
  }
  for (let i = 0; i < problemLists.problemLists.length; i++) {
    problemLists.problemLists[i].Selected = allSelected.value;
  }
}

function getSelectedList() {
  let list: Array<number> = [];
  for (let i = 0; i < problemLists.problemLists.length; i++) {
    if (problemLists.problemLists[i].Selected == true) {
      list.push(problemLists.problemLists[i].LID);
    }
  }
  return list;
}

interface ProblemListsListType extends ProblemListSimplifiedType {
  Selected: boolean,
};

let problemLists = reactive<ProblemListsType>({
  problemLists: new Array<ProblemListsListType>,
  count: 0,
  page: 1,
  limit: 20,
  UID: '',
  searchInfo: {},

  get(showInfo = false) {
    let params = {
      Page: problemLists.page - 1,
      Limit: problemLists.limit,
    };
    _getProblemLists(params)
      .then((data: any) => {
        problemLists.count = data.Size;
        problemLists.problemLists = data.Data;
        for (let index = 0; index < problemLists.problemLists.length; index++) {
          problemLists.problemLists[index].Selected = false;
        }
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

  delete(LID?: number) {
    let params = {
      LIDs: new Array<number>(),
    };
    if (LID == undefined) {
      let list = getSelectedList();
      params.LIDs = list;
      if (list.length == 0) {
        push.warning({
          title: '操作不合法',
          message: '尚未选择任何题目，无法删除',
        })
        return;
      }
    } else {
      params.LIDs.push(LID);
    }
    _deleteProblemLists(params)
      .then(() => {
        problemLists.get();
        switchAllSelectedStatus(false);
        push.success({
          title: '删除成功',
          message: `一共删除了 ${params.LIDs.length} 个题单`,
        });
      })
  }

})

onMounted(() => {
  problemLists.get(true);
})

watch(() => problemLists.page, () => {
  problemLists.get();
  allSelected.value = false;
})

const maxPage = computed(() => Math.ceil(problemLists.count / problemLists.limit));


</script>