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
    <div class="flex gap-2 group">
      <button class="btn btn-sm mt-2.5 opacity-0 group-hover:opacity-100" @click="deleteComment()">
        <delete-one theme="outline" size="20" @click="deleteComment"></delete-one>
      </button>
      <div class="chat-bubble mt-1">{{ props.comment.Text }}</div>
    </div>
    <!-- <div class="chat-footer opacity-50">
      Delivered
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';

import { DeleteOne } from '@icon-park/vue-next';

import { CommentType } from '@/interfaces/discussion';
import { ConvertTools, getHeadURL } from '@/utils/globalFunctions';
import { useUserDataStore } from '@/stores/UserData';
import { _deleteComment } from '@/apis/discussion';
import { push } from 'notivue';

const userDataStore = useUserDataStore();

interface propsType {
  comment?: CommentType;
  UID?: string,
  getDiscussionsList?: Function,
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
  getDiscussionsList: () => {},
});

function deleteComment() {
  let params = {
    CID: props.comment.CID,
    FCID: props.comment.FCID,
    UID: props.comment.UID,
    SID: props.comment.SID,
  }
  _deleteComment(params)
  .then(() => {
    push.success({
      message: '删除成功',
    });
    props.getDiscussionsList();
  })
}

</script>