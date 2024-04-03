<template>
  <div class="card shadow-lg Border bg-white">
    <table class="table table-zebra mb-4">
      <thead>
        <tr>
          <th>通过状态</th>
          <th>题号</th>
          <th>题目名称</th>
          <th>通过率</th>
          <th>通过数/提交数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in props.problems" :key="item.PID" @click="goToProblem(item.PID)"
          class="cursor-pointer">
          <td class="font-bold talbe-lg">
            {{ item.Status }}
          </td>
          <th>
            {{ ConvertTools.Number2Alpha(index + 1) }}
          </th>
          <td class="font-bold talbe-lg">
            <div>{{ item.Title }}</div>
          </td>
          <td>
            <progress class="progress progress-success w-20"
              :value="ConvertTools.Percentage(item.ACNum, item.SubmitNum)" max="100"></progress>
          </td>
          <td>
            {{ item.ACNum }}
            /
            {{ item.SubmitNum }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup name="ContestProblems">
import { ref, reactive, onMounted, watch } from 'vue';
import { ContestType } from '@/type/contest';
import '@/utils/axios/request';
import { Get, Post } from '@/utils/axios/request';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useRoute, useRouter } from 'vue-router';
import { } from '@icon-park/vue-next';

const route = useRoute();
const router = useRouter();

type problemsType = {
  PID: string,
  Title: string,
  SubmitNum: number,
  ACNum: number,
  Status: string,
}

interface propsType {
  contest?: ContestType;
  problems?: Array<problemsType>,
};

let props = withDefaults(defineProps<propsType>(), {
  contest: () => ({
    CID: 0,
    BeginTime: 0,
    EndTime: 0,
    IsPublic: 0,
    Size: 0,
    Title: '',
    duration: 0,
    description: '',
    problems: '',
    UID: '',
    Type: 0,
    Pass: '',
  }),
  problems: () => [],
});

function goToProblem(PID: string) {
  router.push(`/problem/${PID}/${props.contest.CID}`);
}

onMounted(() => {
  console.log(props.problems);
  
});

</script>