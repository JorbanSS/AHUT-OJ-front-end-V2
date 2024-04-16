<template>
  <div class="m-6"></div>
  <div class="m-6 flex justify-center space-x-2">
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base btn-active">
          <document-folder theme="outline" size="18" />
          题目列表
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="router.push('/admin/problem/add')">
          <add theme="outline" size="18" />
          新增题目
        </div>
      </li>
    </ul>
    <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
      <li>
        <div class="font-bold text-base hover:text-red-500" @click="problems.delete()">
          <delete-one theme="outline" size="18" hover:fill="#EC4545" />
          删除题目
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="">
          <afferent-three theme="outline" size="18" />
          导入
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="problems.export()">
          <efferent-three theme="outline" size="18" />
          导出
        </div>
      </li>
    </ul>
  </div>
  <div class="card bg-white shadow-lg Border p-6 max-w-5xl mx-auto">
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
  <div class="bg-white card shadow-lg Border mx-auto max-w-5xl">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th><input type="checkbox" :checked="allSelected" class="checkbox" @click="switchAllSelectedStatus()"></th>
          <th v-for="(item, index) in ['题号', '题目名称', '操作']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in problems.problems" :key="item.PID" @click="switchSelectedStatus(index)"
          class="cursor-pointer">
          <td>
            <input type="checkbox" :checked="item.Selected == true" class="checkbox" />
          </td>
          <th>{{ item.PID }}</th>
          <td>
            <div class="font-bold talbe-lg">{{ item.Title }}</div>
          </td>
          <td class="space-x-2">
            <button class="btn btn-sm btn-neutral" @click.stop="router.push('/admin/problem/edit/' + item.PID)">编辑题目</button>
            <button class="btn btn-sm btn-neutral" @click.stop="router.push('/admin/problem/data/' + item.PID)">编辑数据</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mx-auto py-4 flex space-x-4">
      <Pagination :page="problems.page" :maxPage="maxPage" :changePage="problems.changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup name="AddProblem">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Add, AfferentThree, DeleteOne, DocumentFolder, EfferentThree } from '@icon-park/vue-next';
import { push } from 'notivue';

import { _deleteProblems, _exportProblems, _getProblems } from "@/api/problem";
import Pagination from "@/components/Main/Pagination.vue";
import { problemTypeOptions } from '@/config';
import { type ProblemSimplifiedType, type ProblemsType } from '@/type/problem';

const router = useRouter();

let allSelected = ref<boolean>(false);

function switchSelectedStatus(index: number) {
  problems.problems[index].Selected = !problems.problems[index].Selected;
}

function switchAllSelectedStatus(status?: boolean) {
  if (status == undefined) allSelected.value = !allSelected.value;
  else allSelected.value = status;
  for (let i = 0; i < problems.problems.length; i++) {
    problems.problems[i].Selected = allSelected.value;
  }
}

function getSelectedList() {
  let list: Array<string> = [];
  for (let i = 0; i < problems.problems.length; i++) {
    if (problems.problems[i].Selected == true) {
      list.push(problems.problems[i].PID);
    }
  }
  return list;
}

interface ProblemsListType extends ProblemSimplifiedType {
  Selected: boolean,
};

let problems = reactive<ProblemsType>({
  problems: new Array<ProblemsListType>,
  count: 0,
  page: 1,
  limit: 20,
  searchInfo: {},

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
        for (let index = 0; index < problems.problems.length; index++) {
          problems.problems[index].Selected = false;
        }
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${problems.count} 道题目`,
          })
        }
      })
  },

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) problems.page = page;
  },

  delete() {
    let list = getSelectedList();
    if (list.length == 0) {
      push.warning({
        title: '操作不合法',
        message: '尚未选择任何题目，无法删除',
      })
      return;
    }
    let params = {
      PIDs: list,
    };
    _deleteProblems(params)
      .then(() => {
        this.get();
        switchAllSelectedStatus(false);
        push.success({
          title: '删除成功',
          message: `一共删除了 ${list.length} 个题目`,
        });
      })
  },

  export() {
    let list = getSelectedList();
    if (list.length == 0) {
      push.warning({
        title: '操作不合法',
        message: '尚未选择任何题目，无法导出',
      })
      return;
    }
    let listStr = '';
    for (let i = 0; i < list.length; i++) {
      if (i) listStr += ',';
      listStr += list[i];
    }
    let params = {
      PIDs: listStr,
    };
    _exportProblems(params)
      .then((data: any) => {
        switchAllSelectedStatus(false);
        const blob = new Blob([JSON.stringify(data, null, '\t')]);
        const url = window.URL.createObjectURL(blob);
        let fileName = listStr + '.json';
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        push.success({
          title: '导出成功',
          message: `一共导出了 ${list.length} 个题目`,
        });
      })
  },
})

onMounted(() => {
  problems.get(true);
})

watch(() => problems.page, () => {
  problems.get();
  allSelected.value = false;
})

const maxPage = computed(() => Math.floor(problems.count / problems.limit) + 1);

</script>