<template>
  <div class="card bg-white shadow-lg Border p-6">
    <div class="join w-fit">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">记录号</span>
        <input type="text" class="grow w-32" v-model="records.searchInfo.SID" />
      </label>
      <button class="btn join-item btn-neutral" @click="records.goToRecord(records.searchInfo.SID)">跳转</button>
    </div>
    <div class="m-3"></div>
    <div class="join w-fit">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">UID</span>
        <input type="text" class="grow w-32" v-model="records.searchInfo.UID" />
      </label>
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">PID</span>
        <input type="text" class="grow w-32" v-model="records.searchInfo.PID" />
      </label>
      <select class="select select-bordered join-item" v-model="records.searchInfo.Lang">
        <option value="0">
          语言不限
        </option>
        <option v-for="item in submitLanguageOptions" :value="item.value" :key="item.value">
          {{ item.name }}
        </option>
      </select>
      <button class="btn join-item btn-neutral" @click="records.get(true)">搜索</button>
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
      <Pagination :page="records.page" :maxPage="maxPage" :changePage="records.changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Records">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { type RecordsType, type RecordType } from '@/type/record';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useConstValStore } from '@/store/ConstVal';
import { useRouter } from 'vue-router';
import { submitLanguageOptions } from '@/config';

import Pagination from "@/components/Main/Pagination.vue";
import { _getRecords } from '@/api/record';

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

  searchInfo: {
    LID: undefined,
    PID: '',
    UID: '',
    Lang: 0,
    Result: '',
  },

  get(showInfo: boolean = false) {
    let params: any = {
      Page: records.page - 1,
      Limit: records.limit,
    };
    if (records.searchInfo.UID != undefined) params.UID = records.searchInfo.UID;
    if (records.searchInfo.LID != undefined) params.LID = records.searchInfo.LID;
    if (records.searchInfo.PID != '') params.PID = records.searchInfo.PID;
    if (records.searchInfo.Lang != 0) params.Lang = records.searchInfo.Lang;
    if (records.searchInfo.Result != '') params.Result = records.searchInfo.Result;
    _getRecords(params)
      .then((data: any) => {
        records.count = data.Count;
        records.records = data.Data;
        if (showInfo) {
          push.success({
            title: '获取成功',
            message: `一共获取了 ${records.count} 条记录`,
          })
        }
      })
  },

  changePage(page: number) {
    if (1 <= page && page <= maxPage.value) records.page = page;
  },

  goToRecord(SID: string) {
    if (SID == "") {
      push.warning({
        title: "无法跳转",
        message: "未填写题号",
      })
      return;
    };
    router.push('/record/' + SID);
  }
})

onMounted(() => {
  records.get(true);
})

watch(() => records.page, () => {
  records.get();
})

const maxPage = computed(() => Math.floor(records.count / records.limit) + 1);

</script>