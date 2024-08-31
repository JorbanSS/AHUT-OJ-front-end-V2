<template>
  <div class="m-6 flex flex-col gap-6 max-w-6xl mx-auto">

    <div class="flex justify-center space-x-2">
      <ul class="menu rounded-box bg-white lg:menu-horizontal Border w-fit">
        <li>
          <div class="font-bold text-base" @click="$router.push({
            name: 'AdminCodeReviewProblemSelect',
            params: {
              CID: route.params.CID,
            },
          })">
            <DocumentFolder theme="outline" size="18" />
            题目列表
          </div>
        </li>
        <li>
          <div class="font-bold text-base btn-active">
            <History theme="outline" size="18" />
            记录列表
          </div>
        </li>
      </ul>
    </div>

    <PageHeader Title="记录" :IconName="History" :Infomation="`请选择需要审查、查重的记录`">
      <div class="flex flex-col gap-3">
        <div class="flex justify-center">
          <div class="join">
            <label class="input input-bordered flex items-center gap-2 join-item">
              <span class="whitespace-nowrap text-sm">记录号</span>
              <input type="text" class="grow" v-model="records.searchInfo.SID" />
            </label>
            <button class="btn join-item" @click="records.goToRecord(records.searchInfo.SID)">
              <go-on theme="outline" size="18" />
              <span>跳转</span>
            </button>
          </div>
        </div>
        <div class="flex justify-center">
          <div class="gap-2 flex flex-col">
            <div class="join join-vertical">
              <label class="input input-bordered flex items-center gap-2 join-item">
                <span class="whitespace-nowrap">UID</span>
                <input type="text" class="grow" v-model="records.searchInfo.UID" />
              </label>
              <div class="join">
                <select class="select select-bordered rounded-r-none rounded-tl-none" v-model="records.searchInfo.Lang">
                  <option value="0">
                    语言不限
                  </option>
                  <option v-for="item in submitLanguageOptions" :value="item.language" :key="item.language">
                    {{ item.label }}
                  </option>
                </select>
                <select class="select select-bordered rounded-l-none rounded-tr-none"
                  v-model="records.searchInfo.Result">
                  <option value="">
                    结果不限
                  </option>
                  <option v-for="item in submitStatusOptions" :value="item" :key="item">
                    {{ item }}
                  </option>
                </select>
              </div>
            </div>
            <button class="btn w-full" @click="records.updateQuery()">
              <search theme="outline" size="18" />
              <span>搜索</span>
            </button>
          </div>
        </div>
      </div>
    </PageHeader>
    <component :is="Record" :records="records" />
  </div>
</template>

<script lang="ts" setup name="Records">
import { computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { History, Search, GoOn, DocumentFolder } from "@icon-park/vue-next";
import { push } from 'notivue';

import { _getRecords } from '@/apis/record';
import Record from '@/components/Main/Records.vue';
import { submitLanguageOptions, submitStatusOptions } from '@/config';
import { type RecordsType, type RecordType } from '@/interfaces/record';
import { useUserDataStore } from '@/stores/UserData';
import PageHeader from '@/components/Main/PageHeader.vue';

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
    PID: route.params.PID,
    CID: route.params.CID,
    UID: '',
    Lang: 0,
    Result: '',
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
      LID: '',
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
    if (records.searchInfo.Lang != 0) query.Lang = records.searchInfo.Lang;
    if (records.searchInfo.Result != '') query.Result = records.searchInfo.Result;
    if (records.page != 0) query.Page = records.page - 1;
    if (records.limit != 20) query.Limit = records.limit;
    router.replace({
      name: 'AdminCodeReviewRecordList',
      query: query,
    })
  },
})

function syncUrl() {
  if (typeof route.params.CID != 'undefined') route.query.CID = route.params.CID;
  if (typeof route.params.PID != 'undefined') route.query.PID = route.params.PID;

  if (typeof route.query.PID != 'undefined') records.searchInfo.PID = route.query.PID;
  if (typeof route.query.UID != 'undefined') records.searchInfo.UID = route.query.UID;
  if (typeof route.query.CID != 'undefined') records.searchInfo.CID = route.query.CID;
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