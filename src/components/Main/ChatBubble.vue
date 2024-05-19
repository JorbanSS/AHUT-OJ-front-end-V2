<template>
  <div class="chat" :class="{'chat-start': props.UID == props.comment.UID, 'chat-end': props.UID != props.comment.UID}">
    <div class="chat-image avatar">
      <div class="w-12 rounded-full">
        <img alt="Avatar" :src="getHeadURL(props.comment.HeadURL)" />
      </div>
    </div>
    <div class="chat-header">
      {{ props.comment.UserName }}
      <time class="text-xs opacity-50">{{ ConvertTools.PrintTime(props.comment.UpdateTime, 1, 1) }}</time>
    </div>
    <div class="chat-bubble">{{ props.comment.Text }}</div>
    <!-- <div class="chat-footer opacity-50">
      Delivered
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';

import { CommentType } from '@/interfaces/discussion';
import { ConvertTools, getHeadURL } from '@/utils/globalFunctions';

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