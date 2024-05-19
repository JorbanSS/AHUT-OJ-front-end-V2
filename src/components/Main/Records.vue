<template>
  <div class="bg-white card shadow-lg Border">
    <div class="overflow-x-hidden rounded-t-2xl">
      <table class="table table-zebra table-pin-rows text-center">
        <thead>
          <tr>
            <template v-for="[title, style] in [
              ['状态'],
              ['分数', 'hidden md:table-cell'],
              ['提交号', 'hidden md:table-cell'],
              ['题号', '', showPID],
              ['提交者'],
              ['用时', 'hidden md:table-cell'],
              ['内存', 'hidden lg:table-cell'],
              ['语言'],
              ['提交时间', 'hidden sm:table-cell'],
            ]" :key="title">
              <th :class="style" v-if="title != '题号' || showPID">
                {{ title }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody v-auto-animate>
          <tr v-for="item in props.records.records" :key="item.SID">
            <td class="font-bold">
              <span :style="'background-color: ' + submitStatusColor[item.Result]"
                class="text-white rounded-full px-2 py-1">
                {{ item.Result }}
              </span>
            </td>
            <td class="hidden md:table-cell">
              {{ ConvertTools.Percentage(item.PassSample, item.SampleNumber) }}
            </td>
            <th class="font-normal hidden md:table-cell">
              {{ item.SID }}
            </th>
            <td v-if="props.showPID">
              <span class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer" data-tip="跳转题目"
                @click="$router.push(`/problem/${item.PID}`)">
                {{ item.PID }}
              </span>
            </td>
            <td>
              <span class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer" data-tip="查看用户主页"
                @click="$router.push(`/user/${item.UID}`)">
                {{ item.UID }}
              </span>
            </td>
            <td class="hidden md:table-cell">
              {{ item.UseTime }} ms
            </td>
            <td class="hidden lg:table-cell">
              {{ Math.ceil(item.UseMemory / 1024 / 1024) }} MB
            </td>
            <td>
              <span class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer" data-tip="查看代码"
                @click="$router.push(`/record/${item.SID}`)">
                {{ constValStore.SUBMIT_LANG[item.Lang] }}
              </span>
            </td>
            <td class="hidden sm:table-cell">
              {{ ConvertTools.PrintTime(item.SubmitTime, 1, 1) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :page="records.page" :maxPage="maxPage" :changePage="changePage" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, withDefaults } from 'vue';

import { push } from 'notivue';
import { useRouter } from 'vue-router';

import Pagination from "@/components/Main/Pagination.vue";
import { submitStatusColor } from '@/config';
import { RecordsType, RecordType } from '@/interfaces/record';
import { useConstValStore } from '@/stores/ConstVal';
import { ConvertTools } from '@/utils/globalFunctions';

const router = useRouter();
const constValStore = useConstValStore();

let toPage = ref();

interface propsType {
  records?: RecordsType,
  showPID?: boolean,
};

let props = withDefaults(defineProps<propsType>(), {
  records: () => ({
    records: Array<RecordType>(),
    count: 0,
    page: 1,
    limit: 20,
  }),
  showPID: true,
});

function changePage(page: number) {
  if (1 <= page && page <= maxPage.value) props.records.page = page;
}

const maxPage = computed(() => Math.ceil(props.records.count / props.records.limit));

</script>