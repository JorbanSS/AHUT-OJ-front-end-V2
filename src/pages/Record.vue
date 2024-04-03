<template>
  <div class="card bg-white shadow-lg Border">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th v-for="(item, index) in ['状态', '分数', '提交号', '题号', '提交者', '用时', '内存', '语言', '提交时间']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {{ record.Result }}
          </td>
          <td>
            100
          </td>
          <th class="font-bold talbe-lg">
            {{ record.SID }}
          </th>
          <td>
            {{ record.PID }}
          </td>
          <td>
            {{ record.UID }}
          </td>
          <td>
            {{ record.UseTime }} ms
          </td>
          <td>
            {{ Math.ceil(record.UseMemory / 1024 / 1024) }} MB
          </td>
          <td>
            {{ constValStore.SUBMIT_LANG[record.Lang] }}
          </td>
          <td>
            {{ ConvertTools.PrintTime(record.SubmitTime, 1, 1) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="record.CeInfo != null && record.CeInfo != ''">
    <div class="m-6"></div>
    <div class="card shadow-lg p-6 bg-white Border">
      {{ record.CeInfo }}
    </div>
  </div>
  <div class="m-6"></div>
  <div class="mockup-code card shadow-lg px-6">
    <pre data-prefix="">
      <div></div>
      <code>{{ record.Source }}</code>
    </pre>
  </div>
</template>

<script lang="ts" setup name="Code">
import { ref, reactive, onMounted, watch } from 'vue';
import { type RecordType } from '@/type/record';
import '@/utils/axios/request'
import { Get } from '@/utils/axios/request'
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useConstValStore } from '@/store/ConstVal';
import { useRoute } from 'vue-router';

const constValStore = useConstValStore();
const route = useRoute();

let record = ref<RecordType>({
  SID: 0,
  PID: '',
  UID: '',
  Result: '',
  UseTime: 0,
  UseMemory: 0,
  Lang: 0,
  SubmitTime: 0,
  Source: '',
  CeInfo: '',
  SampleNumber: 0,
  PassSample: 0,
})

function getRecord() {
  Get('api/submit/' + record.value.SID, {})
    .then((res: any) => {
      let data = res.data;
      if (data.Code == 0) {
        record.value = data;
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
}

onMounted(() => {
  record.value.SID = +route.params.SID;
  getRecord();
})

</script>

<style scoped></style>@/utils/globalFunctions