<template>
  <div class="card bg-white Border shadow-lg overflow-hidden">
    <div v-if="props.contest.Description">
      <MdPreview :modelValue="props.contest.Description" class="px-1 mb-4" />
    </div>
    <div class="p-6" v-else>
      暂无比赛描述
    </div>
  </div>
</template>

<script lang="ts" setup name="ContestDescription">
import { ContestType } from '@/interfaces/contest';

import { MdCatalog, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

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
    Status: 0,
  }),
});

</script>