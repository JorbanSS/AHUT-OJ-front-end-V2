<template>
  <div class="card bg-white Border p-6 shadow-lg">
    <div v-if="contest.description">
      {{ contest.description }}
    </div>
    <div v-else>
      暂无比赛描述
    </div>
  </div>
</template>

<script lang="ts" setup name="ContestDescription">
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

interface propsType {
  contest?: ContestType;
};

// let problems = reactive<Array<problems>>([])

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
});

</script>

<style scoped></style>@/utils/globalFunctions