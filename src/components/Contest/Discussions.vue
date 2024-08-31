<template>
  <button class="btn btn-neutral btn-lg w-full rounded-2xl rounded-t-none" :disabled="userDataStore.isLogin == false">
    <add theme="outline" size="22" />
    <span class="text-lg">新建话题</span>
  </button>
  <!-- <button class="btn btn-neutral btn-lg w-full rounded-2xl rounded-t-none" onclick="newDiscussionModal.showModal()"
    :disabled="userDataStore.isLogin == false">
    <add theme="outline" size="22" />
    <span class="text-lg">新建话题</span>
  </button> -->
</template>

<script lang="ts" setup name="ContestDiscussion">
import { ref, reactive, onMounted, watch } from 'vue';
import { } from '@/interfaces/user';
import { Get, Post } from '@/utils/axios/request';
import { push } from 'notivue';
import { ConvertTools } from '@/utils/globalFunctions';
import { useRoute, useRouter } from 'vue-router';
import { } from '@icon-park/vue-next';
import { useUserDataStore } from '@/stores/UserData';

const route = useRoute();
const router = useRouter();
const userDataStore = useUserDataStore();



</script>