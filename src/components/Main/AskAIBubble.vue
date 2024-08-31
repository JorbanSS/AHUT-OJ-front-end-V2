<template>
  <div class="chat" :class="{ 'chat-start': props.message.SendByAI, 'chat-end': !props.message.SendByAI }">
    <div class="chat-image avatar">
      <div class="w-12 rounded-full" v-if="!props.message.SendByAI">
        <img alt="Avatar" :src="getHeadURL(userDataStore.HeadURL)" class="cursor-pointer"
          @click="$router.push({ name: 'User', params: { UID: props.message.UID } })" />
      </div>
      <div class="w-12 rounded-full bg-gray-800 p-[11.5px]" v-else>
        <smart-optimization theme="outline" size="25" fill="#fff"/>
      </div>
    </div>
    <div class="chat-header flex items-baseline gap-1" :class="{ 'flex-row-reverse': !props.message.SendByAI }">
      <!-- <span class="badge badge-primary" v-if="props.UID == props.message.UID">楼主</span> -->
      <!-- <span class="cursor-pointer" @click="$router.push({ name: 'User', params: { UID: props.message.UID } })">{{ props.message.UserName }}</span> -->
      <!-- <time class="text-xs opacity-50">{{ ConvertTools.PrintTime(props.message.UpdateTime, 1) }}</time> -->
    </div>
    <div class="flex gap-2 group">
      <!-- <button class="btn btn-sm mt-2.5 opacity-0 group-hover:opacity-100" @click="deletemessage()">
        <delete-one theme="outline" size="20" @click="deletemessage"></delete-one>
      </button> -->
      <div class="chat-bubble mt-1">{{ props.message.Message }}</div>
    </div>
    <!-- <div class="chat-footer opacity-50">
      Delivered
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';

import { DeleteOne, Send, SmartOptimization } from '@icon-park/vue-next';

import { ConvertTools, getHeadURL } from '@/utils/globalFunctions';
import { useUserDataStore } from '@/stores/UserData';
import { _deleteComment } from '@/apis/discussion';
import { push } from 'notivue';
import { Message, Choice, Usage, ModelMessage } from '@/interfaces/askai';

const userDataStore = useUserDataStore();

interface propsType {
  message?: ModelMessage;
}

let props = withDefaults(defineProps<propsType>(), {
  message: () => ({
    ModelType: '',
    Message: '',
    SendByAI: false,
  }),
});

</script>