<template>
  <div class="card bg-white Border p-6 sha">
    {{ contest.description }}
  </div>
</template>

<script lang="ts" setup name="ContestDescription">
import { ref, reactive, onMounted, watch } from 'vue';
import { ContestType } from '@/type';
import '@/utils/axios/request';
import { Get, Post } from '@/utils/axios/request';
import { push } from 'notivue';
import { ConvertTools } from '@/assets/ts/globalFunctions';
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

<style scoped></style>