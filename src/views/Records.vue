<template>
  <div class="flex space-y-4 card bg-white shadow-lg Border p-4 mx-auto w-fit">
    <div class="join w-fit">
      <label class="input input-bordered flex items-center gap-2 join-item">
        <span class="whitespace-nowrap">记录号</span>
        <input type="text" class="grow w-60" v-model="records.searchInfo.SID" />
      </label>
      <button class="btn join-item btn-neutral" @click="records.goToRecord(records.searchInfo.SID)">跳转</button>
    </div>
    <div class="collapse bg-base-200 collapse-arrow rounded-lg">
      <input type="checkbox" />
      <div class="collapse-title text-md font-bold">
        高级筛选
      </div>
      <div class="collapse-content space-y-2">
        <label class="input input-bordered flex items-center gap-2 join-item">
          <span class="whitespace-nowrap">UID</span>
          <input type="text" class="grow w-32" v-model="records.searchInfo.UID" />
          <button class="btn btn-neutral btn-sm -mr-2" @click.stop="records.onlyMine()">仅看自己</button>
        </label>
        <label class="input input-bordered flex items-center gap-2 join-item">
          <span class="whitespace-nowrap">PID</span>
          <input type="text" class="grow w-32" v-model="records.searchInfo.PID" />
        </label>
        <label class="input input-bordered flex items-center gap-2 join-item">
          <span class="whitespace-nowrap">CID</span>
          <input type="text" class="grow w-32" v-model="records.searchInfo.CID" />
        </label>
        <label class="input input-bordered flex items-center gap-2 join-item">
          <span class="whitespace-nowrap">LID</span>
          <input type="text" class="grow w-32" v-model="records.searchInfo.LID" />
        </label>
        <select class="select select-bordered join-item" v-model="records.searchInfo.Lang">
          <option value="0">
            语言不限
          </option>
          <option v-for="item in submitLanguageOptions" :value="item.value" :key="item.value">
            {{ item.name }}
          </option>
        </select>
        <button class="btn join-item btn-neutral w-full" @click="records.updateQuery()">搜索</button>
      </div>
    </div>
  </div>
  <div class="mt-6"></div>
  <div class="bg-white card shadow-lg Border">
    <div class="overflow-x-hidden rounded-t-2xl">
      <table class="table table-zebra table-pin-rows">
        <thead>
          <tr>
            <th>
              状态
            </th>
            <th>
              分数
            </th>
            <th class="hidden md:table-cell">
              提交号
            </th>
            <th>
              题号
            </th>
            <th>
              提交者
            </th>
            <th class="hidden md:table-cell">
              用时
            </th>
            <th class="hidden lg:table-cell">
              内存
            </th>
            <th class="hidden md:table-cell">
              语言
            </th>
            <th class="hidden sm:table-cell">
              提交时间
            </th>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr v-for="item in records.records" :key="item.SID">
            <td class="font-bold talbe-lg">
              {{ item.Result }}
            </td>
            <td>
              {{ ConvertTools.Percentage(item.PassSample, item.SampleNumber) }}
            </td>
            <th class="font-normal talbe-lg hidden md:table-cell">
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
            <td class="hidden md:table-cell">
              {{ item.UseTime }} ms
            </td>
            <td class="hidden lg:table-cell">
              {{ Math.ceil(item.UseMemory / 1024 / 1024) }} MB
            </td>
            <td @click="router.push(`/record/${item.SID}`)"
              class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer hidden md:table-cell" data-tip="查看代码">
              {{ constValStore.SUBMIT_LANG[item.Lang] }}
            </td>
            <td class="hidden sm:table-cell">
              {{ ConvertTools.PrintTime(item.SubmitTime, 1, 1) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mx-auto py-4 flex space-x-4">
      <Pagination :page="records.page" :maxPage="maxPage" :changePage="records.changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup name="Records">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { push } from 'notivue';

import { _getRecords } from '@/apis/record';
import Pagination from "@/components/Main/Pagination.vue";
import { submitLanguageOptions } from '@/config';
import { useConstValStore } from '@/stores/ConstVal';
import { useUserDataStore } from '@/stores/UserData';
import { type RecordsType, type RecordType } from '@/interfaces/record';
import { ConvertTools } from '@/utils/globalFunctions';

const route = useRoute();
const constValStore = useConstValStore();
const router = useRouter();
const userDataStore = useUserDataStore();

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
    PID: '',
    UID: '',
    Lang: 0,
    Result: '',
    CID: '',
    LID: '',
  },

  onlyMine() {
    this.searchInfo.UID = userDataStore.UID;
    this.get(true);
  },

  get(showInfo: boolean = false) {
    let params: any = {
      Page: this.page - 1,
      Limit: this.limit,
      PID: this.searchInfo.PID,
      UID: this.searchInfo.UID,
      Lang: this.searchInfo.Lang,
      CID: this.searchInfo.CID,
      LID: this.searchInfo.LID,
    };
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
  },

  updateQuery() {
    let query: any = {};
    if (records.searchInfo.PID != '') query.PID = records.searchInfo.PID;
    if (records.searchInfo.UID != '') query.UID = records.searchInfo.UID;
    if (records.searchInfo.CID != '') query.CID = records.searchInfo.CID;
    if (records.searchInfo.LID != '') query.LID = records.searchInfo.LID;
    if (records.searchInfo.Lang != 0) query.Lang = records.searchInfo.Lang;
    if (records.searchInfo.Result != '') query.Result = records.searchInfo.Result;
    if (records.page != 0) query.Page = records.page - 1;
    if (records.limit != 20) query.Limit = records.limit;
    router.replace({
      name: 'Records',
      query: query,
    })
  },
})

function syncUrl() {
  if (typeof route.query.PID != 'undefined') records.searchInfo.PID = route.query.PID;
  if (typeof route.query.UID != 'undefined') records.searchInfo.UID = route.query.UID;
  if (typeof route.query.CID != 'undefined') records.searchInfo.CID = route.query.CID;
  if (typeof route.query.LID != 'undefined') records.searchInfo.LID = route.query.LID;
  if (typeof route.query.Lang != 'undefined') records.searchInfo.Lang = route.query.Lang;
  if (typeof route.query.Result != 'undefined') records.searchInfo.Result = route.query.Result;
  if (typeof route.query.Page != 'undefined') records.page = Number(route.query.Page) + 1;
  if (typeof route.query.Limit != 'undefined') records.limit = Number(route.query.Limit);
}

onMounted(() => {
  syncUrl();
  records.get(true);
})

watch(() => records.page, () => {
  records.get();
  records.updateQuery();
})

watch(() => route.query, () => {
  syncUrl();
  records.get(true);
})

const maxPage = computed(() => Math.ceil(records.count / records.limit));

</script>