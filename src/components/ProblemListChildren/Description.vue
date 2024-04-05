<template>
  <div class="card bg-white Border p-6 shadow-lg">
    <div v-if="props.problemList.Description">
      {{ props.problemList.Description }}
    </div>
    <div v-else>
      暂无题单描述
    </div>
  </div>
</template>

<script lang="ts" setup name="ProblemListDescription">
import { ProblemListType } from '@/type/problemList.ts';

interface propsType {
  problemList?: ProblemListType;
};

let props = withDefaults(defineProps<propsType>(), {
  problemList: () => ({
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
  }),
});

</script>