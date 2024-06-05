<template>
  <div class="space-y-6">
    <div class="card bg-white shadow-lg Border p-4 mx-auto">
      <div class="join">
        <select class="select select-bordered join-item" v-model="records.searchInfo.PID">
          <option value="">
            所有题目
          </option>
          <option v-for="item in props.problems" :value="item.PID" :key="item.PID">
            {{ item.PID }} {{ item.Title }}（{{ item.ACNum }} / {{ item.SubmitNum }}）
          </option>
        </select>
        <div
          class="space-y-2 [&_label]:input [&_label]:input-bordered [&_label]:flex [&_label]:items-center [&_label]:gap-2 [&_label_span]:whitespace-nowrap  [&_label_span]:text-sm">
          <label class="join-item">
            <span>UID</span>
            <input type="text" class="grow w-52" v-model="records.searchInfo.UID" />
            <button class="btn btn-neutral btn-sm mr-1" @click.stop="records.onlyMine()">仅看自己</button>
          </label>
        </div>
        <select class="select select-bordered join-item" v-model="records.searchInfo.Lang">
          <option value="0">
            语言不限
          </option>
          <option v-for="item in submitLanguageOptions" :value="item.value" :key="item.value">
            {{ item.label }}
          </option>
        </select>
        <select class="select select-bordered join-item w-full" v-model="records.searchInfo.Result">
          <option value="">
            结果不限
          </option>
          <option v-for="item in submitStatusOptions" :value="item" :key="item">
            {{ item }}
          </option>
        </select>
        <button class="btn join-item btn-neutral w-32" @click="records.updateQuery()">搜索</button>
      </div>
    </div>
    <component :is="Record" :records="records" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch, withDefaults, defineProps } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { push } from 'notivue';

import { _getRecords } from '@/apis/record';
import Record from '@/components/Main/Records.vue';
import { submitLanguageOptions, submitStatusOptions } from '@/config';
import { RecordsType, RecordType } from '@/interfaces/record';
import { useUserDataStore } from '@/stores/UserData';
import { ContestType } from '@/interfaces/contest';
import { ProblemsType } from '@/interfaces/problem';

const route = useRoute();
const router = useRouter();
const userDataStore = useUserDataStore();

const filterNumber = computed(() => Number(records.searchInfo.PID != '') + Number(records.searchInfo.UID != '') + Number(records.searchInfo.CID != '') + Number(records.searchInfo.LID != '') + Number(records.searchInfo.Lang != 0) + Number(records.searchInfo.Result != ''))

interface propsType {
  contest?: ContestType;
  problems?: Array<ProblemsType>,
};

let props = withDefaults(defineProps<propsType>(), {
  contest: () => ({
    CID: 0,
    BeginTime: 0,
    EndTime: 0,
    IsPublic: 0,
    Size: 0,
    Title: '',
    Duration: 0,
    Description: '',
    Problems: '',
    UID: '',
    Type: 0,
    Pass: '',
    Status: 0,
  }),

  problems: () => [],
});

let records = reactive<RecordsType>({
  records: Array<RecordType>(),
  count: 0,
  page: 1,
  limit: 20,

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
    this.updateQuery();
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
      Result: this.searchInfo.Result,
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
      name: 'ContestRecords',
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
  records.searchInfo.CID = route.params.CID;
  records.get(true);
})

watch(() => records.page, () => {
  records.get();
  records.updateQuery();
})

watch(() => records.searchInfo.PID, () => {
  records.updateQuery();
})

watch(() => route.query, () => {
  records.get(false);
})
</script>