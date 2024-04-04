<template>
  <div class="card bg-white Border p-6 shadow-lg">
    <div v-if="props.contest.Description">
      {{ props.contest.Description }}
    </div>
    <div v-else>
      暂无比赛描述
    </div>
  </div>
</template>

<script lang="ts" setup name="ContestDescription">
import { ContestType } from '@/type/contest';

interface propsType {
  contest?: ContestType;
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
  }),
});

</script>