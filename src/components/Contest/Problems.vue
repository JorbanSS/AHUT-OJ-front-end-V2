<template>
  <div class="card shadow-lg Border bg-white">
    <table class="table table-zebra mb-4">
      <thead>
        <tr>
          <th v-for="(item, index) in ['通过状态', '题号', '题目名称', '通过率', '通过数/提交数']" :key="index">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in props.problems" :key="item.PID" @click="$router.push({
          name: 'Problem',
          params: {
            PID: item.PID,
            BindID: 'C' + props.contest.CID,
          }
        });" class="cursor-pointer">
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

import { ContestType } from '@/interfaces/contest';
import { ConvertTools } from '@/utils/globalFunctions';

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

</script>