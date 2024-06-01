<template>
  <div class="chat" :class="{'chat-start': userDataStore.UID != props.comment.UID, 'chat-end': userDataStore.UID == props.comment.UID}">
    <div class="chat-image avatar">
      <div class="w-12 rounded-full">
        <img alt="Avatar" :src="getHeadURL(props.comment.HeadURL)" class="cursor-pointer" @click="$router.push({ name: 'User', params: { UID: props.comment.UID } })"/>
      </div>
    </div>
    <div class="chat-header flex items-baseline gap-1" :class="{'flex-row-reverse': userDataStore.UID == props.comment.UID}">
      <span class="badge badge-primary" v-if="props.UID == props.comment.UID">楼主</span>
      <span class="cursor-pointer" @click="$router.push({ name: 'User', params: { UID: props.comment.UID } })">{{ props.comment.UserName }}</span>
      <time class="text-xs opacity-50">{{ ConvertTools.PrintTime(props.comment.UpdateTime, 1) }}</time>
    </div>
    <div class="chat-bubble mt-1">{{ props.comment.Text }}</div>
    <!-- <div class="chat-footer opacity-50">
      Delivered
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';

import { CommentType } from '@/interfaces/discussion';
import { ConvertTools, getHeadURL } from '@/utils/globalFunctions';
import { useUserDataStore } from '@/stores/UserData';

const userDataStore = useUserDataStore();

interface propsType {
  comment?: CommentType;
  UID?: string,
}

let props = withDefaults(defineProps<propsType>(), {
  comment: () => ({
    CID: 0,
    FCID: -1,
    UID: '',
    UserName: '',
    HeadURL: '',
    UpdateTime: 0,
    Text: '',
  }),
  UID: '',
});

</script>