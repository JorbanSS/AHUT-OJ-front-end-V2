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
        <div class="font-bold text-base" @click="goToEditProblem()">
          <edit-one theme="outline" size="18" />
          编辑题目
        </div>
      </li>
      <li>
        <div class="font-bold text-base" @click="goToProblemData()">
          <ICONdata theme="outline" size="18" />
          编辑数据
        </div>
      </li>
      <li>
        <div class="font-bold text-base hover:text-red-500" @click="deleteProblem()">
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
        <div class="font-bold text-base" @click="exportProblems()">
          <efferent-three theme="outline" size="18" />
          导出
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
    <table class="table table-zebra">
      <thead>
        <tr>
          <th><input type="checkbox" :checked="allSelected" class="checkbox" @click="switchAllSelectedStatus()"></th>
          <th>题号</th>
          <th>题目名称</th>
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
        <button class="btn join-item" @click="toPage ? changePageTo(toPage) : 0">跳转页面</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="AddProblem">
import { DeleteOne, EditOne, Left, Right, DoubleLeft, DoubleRight, AfferentThree, EfferentThree, Data as ICONdata, Add, DocumentFolder } from '@icon-park/vue-next';
import { ref, reactive, onMounted, watch } from 'vue';
import { push } from 'notivue';
import { Get, Post } from '@/utils/axios/request';
import { useRouter } from 'vue-router';
import { type ProblemsType, type ProblemSimplifiedType } from '@/type/problem';

const router = useRouter();

let toPage = ref<number>();
let allSelected = ref<boolean>(false);

function switchSelectedStatus(index: number) {
  problems.problems[index].Selected = !problems.problems[index].Selected;
}

function switchAllSelectedStatus(status?: boolean) {
  if (status == undefined) {
    allSelected.value = !allSelected.value;
  }
  else {
    allSelected.value = status;
  }
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

function deleteProblem() {
  let list = getSelectedList();
  if (list.length == 0) {
    push.warning({
      title: '操作不合法',
      message: '尚未选择任何题目，无法删除',
    })
    return;
  }
  Post('api/problem/delete/', {
    PIDs: list,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        getProblems();
        switchAllSelectedStatus(false);
        push.success({
          title: '删除成功',
          message: `一共删除了 ${list.length} 个题目`,
        });
      }
      else {
        push.error({
          title: `Error: ${data.Code}`,
          message: `${data.Msg}`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
};

function exportProblems() {
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
  Get('api/file/json/download', {
    PIDs: listStr,
  })
    .then((res: any) => {
      let data = res.data;
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
    .catch((err: any) => {
      console.log(err);
    })
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


function getProblems() {
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
        for (let index = 0; index < problems.problems.length; index++) {
          problems.problems[index].Selected = false;
        }
      }
      push.success({
        title: '获取成功',
        message: `一共获取了 ${problems.count} 道题目`,
      })
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function changePageTo(page: number) {
  if (1 <= page && page <= Math.floor(problems.count / problems.limit) + 1) problems.page = page;
  // syncUrl();
}

function changePage(page: number) {
  if (problems.page + page >= 1 && problems.page + page <= Math.floor(problems.count / problems.limit) + 1) problems.page += page;
  // syncUrl();
}

function goToEditProblem() {
  let list = getSelectedList();
  if (list.length != 1) {
    push.warning({
      title: '操作不合法',
      message: '请选择且仅选择一道题目进行编辑',
    })
    return;
  }
  let PID = list[0];
  router.push('/admin/problem/edit/' + PID);
}

function goToProblemData() {
  let list = getSelectedList();
  if (list.length != 1) {
    push.warning({
      title: '操作不合法',
      message: '请选择且仅选择一道题目进行编辑',
    })
    return;
  }
  let PID = list[0];
  router.push('/admin/problem/data/' + PID);
}

onMounted(() => {
  getProblems();
})

watch(() => problems.page, () => {
  getProblems();
  allSelected.value = false;
})


</script>

<style scoped></style>