<template>
  <div class="m-6 flex flex-col gap-6 max-w-6xl mx-auto">
    <PageHeader Title="审阅" :IconName="Audit" Infomation='审查、查重比赛期间的代码，以营造良好的学术氛围。\n请前往“比赛管理页面 - 比赛列表”中选择比赛以进入审阅。'>
    </PageHeader>
  </div>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/Main/PageHeader.vue';
import { useUserDataStore } from '@/stores/UserData';

import { Audit } from "@icon-park/vue-next";

const userDataStore = useUserDataStore();

</script>

<style scoped></style>