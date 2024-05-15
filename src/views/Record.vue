<template>
  <div role="alert" class="alert text-white shadow-lg font-bold border-0"
    :style="'background-color: ' + submitStatusColor[record.Result]" v-if="record.Result != ''">
    <component :is="submitInfo[record.Result].icon" theme="outline" size="24" />
    <span class="text-lg">{{ submitInfo[record.Result].label }}</span>
  </div>
  <div class="m-6"></div>
  <div class="card bg-white shadow-lg Border">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th v-for="(item, index) in ['分数', '提交号', '题号', '提交者', '用时', '内存', '语言', '提交时间']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {{ ConvertTools.Percentage(record.PassSample, record.SampleNumber) }}
          </td>
          <th class="font-bold talbe-lg">
            {{ record.SID }}
          </th>
          <td @click="$router.push(`/problem/${record.PID}`)"
            class="font-bold text-blue-500 tooltip hover:text-blue-400 cursor-pointer" data-tip="跳转题目">
            {{ record.PID }}
          </td>
          <td @click="$router.push(`/user/${record.UID}`)"
            class="font-bold text-blue-500 hover:text-blue-400 cursor-pointer">
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
      {{ record.ErrInfo }}
    </div>
  </div>
  <div class="m-6"></div>
  <button class="btn w-fit btn-sm btn-neutral" @click="copyData()">
    <copy theme="outline" size="18" />
    复制内容
  </button>
  <div class="m-2"></div>
  <div class="mockup-code card shadow-lg px-6">
    <pre v-for="(item, index) in record.Source.split('\n')" :data-prefix="index + 1"><code>{{ item }}</code></pre>
  </div>
</template>

<script lang="ts" setup name="Code">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Copy } from '@icon-park/vue-next';
import confetti from 'canvas-confetti';
import { push } from 'notivue';
import useClipboard from 'vue-clipboard3';

import { _getRecord } from '@/apis/record';
import { submitInfo, submitStatusColor } from '@/config';
import { useConstValStore } from '@/stores/ConstVal';
import { type RecordType } from '@/interfaces/record';
import { ConvertTools } from '@/utils/globalFunctions';

const { toClipboard } = useClipboard();
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
  ErrInfo: '',
  SampleNumber: 0,
  PassSample: 0,
  UpdateNumber: 0,
  autoUpdateTimeout: null,

  get() {
    _getRecord({}, record.value.SID)
      .then((data: any) => {
        record.value.PID = data.PID;
        record.value.UID = data.UID;
        record.value.Result = data.Result;
        record.value.UseTime = data.UseTime;
        record.value.UseMemory = data.UseMemory;
        record.value.Lang = data.Lang;
        record.value.SubmitTime = data.SubmitTime;
        record.value.Source = data.Source;
        record.value.ErrInfo = data.ErrInfo;
        record.value.SampleNumber = data.SampleNumber;
        record.value.PassSample = data.PassSample;
      })
      .then(() => {
        if (record.value.Result == 'AC') startConfetti();
        if (record.value.Result === 'JUDGING' || record.value.Result == 'REJUDGING' || record.value.Result == 'PENDING') {
          if (record.value.UpdateNumber <= 10) {
            this.autoUpdate();
          } else {
            push.error({
              title: '获取失败',
              message: '获取记录状态超时，请尝试刷新页面',
            });
          }
        }
      })
  },

  autoUpdate() {
    console.log("autoUpdate");
    this.autoUpdateTimeout = setTimeout(() => {
      this.UpdateNumber++;
      this.get();
    }, this.UpdateNumber / 3 * 1000 + 500);
  }
})

function startConfetti() {
  let end = Date.now() + (1.3 * 1000); // 时间为2秒
  let colors = ['#bb0000', '#ffffff']; // 颜色数组

  function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }
  frame();
}

async function copyData() {
  try {
    await toClipboard(record.value.Source);
    push.success({
      title: '复制成功',
      message: '已复制文件内容到剪贴板',
    })
  } catch (e) {
    push.error({
      title: '复制失败',
    })
  }
}

onMounted(() => {
  clearTimeout(record.value.Source);
  record.value.SID = +route.params.SID;
  record.value.get();
})

onUnmounted(() => {
  clearTimeout(record.value.autoUpdate);
});

</script>