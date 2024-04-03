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
        <button class="btn join-item">搜索</button>
      </div>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th v-for="(item, index) in ['状态', '分数', '提交号', '题号', '提交者', '用时', '内存', '语言', '提交时间']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in records.records" :key="item.SID">
          <td class="font-bold talbe-lg">
            {{ item.Result }}
          </td>
          <td class="talbe-lg">
            100
          </td>
          <th class="font-normal talbe-lg">
            {{ item.SID }}
          </th>
          <td @click="router.push(`/problem/${item.PID}`)"
            class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer" data-tip="跳转题目">
            {{ item.PID }}
          </td>
          <td @click="router.push(`/user/${item.UID}`)"
            class="font-bold text-blue-500 hover:text-blue-400 cursor-pointer">
            {{ item.UID }}
          </td>
          <td>
            {{ item.UseTime }} ms
          </td>
          <td>
            {{ Math.ceil(item.UseMemory / 1024 / 1024) }} MB
          </td>
          <td @click="router.push(`/record/${item.SID}`)"
            class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer" data-tip="查看代码">
            {{ constValStore.SUBMIT_LANG[item.Lang] }}
          </td>
          <td>
            {{ ConvertTools.PrintTime(item.SubmitTime, 1, 1) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mx-auto py-4 flex space-x-4">
      <div class="join">
        <button class="join-item btn" @click="changePage(-1)">
          <left theme="outline" size="20" />
        </button>
        <button class="join-item btn">
          {{ records.page }} / {{ Math.floor(records.count / records.limit + 1) }}
        </button>
        <button class="join-item btn" @click="changePage(1)">
          <right theme="outline" size="20" />
        </button>
      </div>
      <div class="join">
        <div>
          <div>
            <input class="input input-bordered join-item w-20" placeholder="" v-model="toPage" type="number" />
          </div>
        </div>
        <button class="btn join-item" @click="changePageTo(toPage)">跳转页面</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Records">
import { ref, reactive, onMounted, watch } from 'vue';
import { type RecordsType, type RecordType } from '@/type/record';
import '@/utils/axios/request'
import { Get } from '@/utils/axios/request'
import { Left, Right } from '@icon-park/vue-next';
import { push } from 'notivue';
import { ConvertTools } from '@/assets/ts/globalFunctions';
import { useConstValStore } from '@/store/ConstVal';
import { useRouter } from 'vue-router';

const constValStore = useConstValStore();
const router = useRouter();

let toPage = ref();

let records = reactive<RecordsType>({
  records: Array<RecordType>(),
  count: 0,
  page: 1,
  limit: 20,
  UID: undefined,
  StartTime: 0,
  size: 0,
  init() {
    records.count = 0;
    records.page = 1;
    records.limit = 20;
  }
})

function getRecords(showInfo: boolean = false) {
  Get('api/submit/status', {
    Page: records.page - 1,
    Limit: records.limit,
  })
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        records.count = data.Count;
        records.records = data.Data;
      }
    })
    .then(() => {
      if (showInfo) {
        push.success({
          title: '获取成功',
          message: `一共获取了 ${records.count} 条记录`,
        })
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
}

function changePageTo(page: number) {
  if (1 <= page && page <= Math.floor(records.count / records.limit) + 1) records.page = page;
}

function changePage(page: number) {
  if (records.page + page >= 1 && records.page + page <= Math.floor(records.count / records.limit) + 1) records.page += page;
}

onMounted(() => {
  getRecords(true);
})

watch(() => records.page, () => {
  getRecords();
})

</script>