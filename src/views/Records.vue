<template>
  <div class="m-6 flex flex-col gap-6 max-w-6xl mx-auto">
    <div class="flex space-y-4 card bg-white shadow-lg Border p-4 mx-auto max-w-96">
      <div class="join w-full">
        <label class="input input-bordered flex items-center gap-2 join-item w-full">
          <span class="whitespace-nowrap">记录号</span>
          <input type="text" class="grow w-full" v-model="records.searchInfo.SID" />
        </label>
        <button class="btn join-item btn-neutral" @click="records.goToRecord(records.searchInfo.SID)">跳转</button>
      </div>
      <div class="collapse bg-base-200 collapse-arrow rounded-lg">
        <input type="checkbox" />
        <div class="collapse-title text-md font-bold">
          高级筛选
          <div class="badge badge-neutral">{{ filterNumber }}</div>
        </div>
        <div class="collapse-content space-y-2">
          <div
            class="space-y-2 [&_label]:input [&_label]:input-bordered [&_label]:flex [&_label]:items-center [&_label]:gap-2 [&_label_span]:whitespace-nowrap  [&_label_span]:text-sm">
            <label class="w-full">
              <span>UID</span>
              <input type="text" class="grow w-full" v-model="records.searchInfo.UID" />
              <button class="btn btn-neutral btn-sm -mr-2" @click.stop="records.onlyMine()">仅看自己</button>
            </label>
            <label>
              <span>PID</span>
              <input type="text" class="grow w-full" v-model="records.searchInfo.PID" />
            </label>
            <label>
              <span>CID</span>
              <input type="text" class="grow w-full" v-model="records.searchInfo.CID" />
            </label>
            <label>
              <span>LID</span>
              <input type="text" class="grow w-full" v-model="records.searchInfo.LID" />
            </label>
          </div>
          <select class="select select-bordered join-item w-full" v-model="records.searchInfo.Lang">
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
          <button class="btn join-item btn-neutral w-full" @click="records.updateQuery()">搜索</button>
        </div>
      </div>
    </div>
    <component :is="Record" :records="records" />
  </div>
</template>

<script lang="ts" setup name="Records">
import { computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { push } from 'notivue';

import { _getRecords } from '@/apis/record';
import Record from '@/components/Main/Records.vue';
import { submitLanguageOptions, submitStatusOptions } from '@/config';
import { type RecordsType, type RecordType } from '@/interfaces/record';
import { useUserDataStore } from '@/stores/UserData';

const route = useRoute();
const router = useRouter();
const userDataStore = useUserDataStore();

const filterNumber = computed(() => Number(records.searchInfo.PID != '') + Number(records.searchInfo.UID != '') + Number(records.searchInfo.CID != '') + Number(records.searchInfo.LID != '') + Number(records.searchInfo.Lang != 0) + Number(records.searchInfo.Result != ''))

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
  records.get(false);
})

</script>