<template>
  <div class="flex flex-col mx-auto">
    <div class="overflow-auto" style="height: calc(100vh - 206px)">
      <div class="max-w-6xl mx-auto py-6" v-auto-animate>
        <div
          v-if="messages.Messages.length == 0 && availableModels.Models.length && availableModels.Models[availableModels.ChoosenModel].ModelType == 'deepseek-coder'"
          class="mx-auto px-6 py-12 rounded-2xl max-w-lg">
          <div class="flex justify-center">
            <smart-optimization theme="outline" size="52" />
          </div>
          <div class="mt-4"></div>
          <div class="flex justify-center">
            <span class="text-xl font-bold">Ask AI something...</span>
          </div>
        </div>
        <template v-for="(message, index) in messages.Messages" :key="index" class="flex items-center">
          <AskAIBubble :message="message"></AskAIBubble>
        </template>
        <div class="chat chat-start" v-if="messages.IsWaiting">
          <div class="chat-image avatar">
            <div class="w-12 rounded-full bg-gray-800 p-[11.5px]">
              <smart-optimization theme="outline" size="25" fill="#fff" />
            </div>
          </div>
          <div class="chat-header flex items-baseline gap-1">
            <!-- <span class="badge badge-primary" v-if="props.UID == props.message.UID">楼主</span> -->
            <!-- <span class="cursor-pointer" @click="$router.push({ name: 'User', params: { UID: props.message.UID } })">{{ props.message.UserName }}</span> -->
            <!-- <time class="text-xs opacity-50">{{ ConvertTools.PrintTime(props.message.UpdateTime, 1) }}</time> -->
          </div>
          <div class="flex gap-2 group">
            <!-- <button class="btn btn-sm mt-2.5 opacity-0 group-hover:opacity-100" @click="deletemessage()">
        <delete-one theme="outline" size="20" @click="deletemessage"></delete-one>
      </button> -->
            <div class="chat-bubble mt-1">
              <span class="loading loading-dots loading-sm"></span>
            </div>
          </div>
          <!-- <div class="chat-footer opacity-50">
      Delivered
    </div> -->
        </div>
      </div>
    </div>
    <div class="mx-auto bg-white rounded-[32px] p-2 shadow-lg max-w-4xl w-full">
      <div class="flex items-end">
        <div class="dropdown dropdown-top">
          <button class="btn btn-neutral text-white rounded-full px-4 py-0.5">
            <div class="flex items-center gap-1.5">
              <up-one theme="filled" size="19" />
              <span class="text-nowrap">
                {{ availableModels.Models.length == 0 ? 'No model available' :
                  availableModels.Models[availableModels.ChoosenModel].ModelType }}
              </span>
            </div>
          </button>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <span class="p-1">模型</span>
            <li v-for="(model, index) in availableModels.Models">
              <a :class="{ 'btn-active': index === availableModels.ChoosenModel }"
                @click="availableModels.ChoosenModel = index" class="block">
                <div class="flex items-center justify-between">
                  <span>{{ model.ModelType }}</span>
                  <div :class="{ 'text-green-500': model.Available, 'text-gray-500': !model.Available }">{{
                    model.Available
                      ? '可用' : '不可用' }}</div>
                </div>
              </a>
            </li>
            <div class="m-1"></div>
            <div class="flex items-center justify-between p-1">
              <span>临时聊天</span>
              <input type="checkbox" class="toggle" checked disabled />
            </div>
            <div class="flex items-center justify-between p-1">
              <span>记忆</span>
              <input type="checkbox" class="toggle" v-model="memoryStatus" />
            </div>
          </ul>
        </div>
        <!-- <button class="btn btn-neutral text-white rounded-full px-4 py-0.5">
          <up-one theme="filled" size="19" />
          {{ availableModels.Models.length == 0 ? 'No model available' :
            availableModels.Models[availableModels.ChoosenModel].ModelType }}
        </button> -->
        <div class="flex w-full items-center">
          <textarea class="focus:outline-none w-full resize-none overflow-hidden text-md p-3"
            placeholder="Ask AI something..." v-model="inputText" ref="textarea" rows="1"
            @keydown="handleKeydown"></textarea>
        </div>
        <button class="btn btn-neutral text-white rounded-full px-4 py-0.5" :disabled="messages.isOutputing"
          @click="messages.send()">
          <up-small theme="outline" size="28" />
        </button>
      </div>
    </div>
    <div class="mb-4"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Copy, UpSmall, UpOne, SmartOptimization, LoadingOne } from '@icon-park/vue-next';
import { push } from 'notivue';

import { useConstValStore } from '@/stores/ConstVal';
import { ConvertTools } from '@/utils/globalFunctions';
import { Message, Model, ModelList, ModelMessage, ModelMessageList } from '@/interfaces/askai';
import { _getModelList, _messageToModel } from '@/apis/askai';
import AskAIBubble from '@/components/Main/AskAIBubble.vue';

const constValStore = useConstValStore();
const route = useRoute();

const handleKeydown = (event: any) => {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    messages.send();
  }
};

let availableModels = reactive<ModelList>({
  Count: 0,
  Models: [],
  ChoosenModel: 0,

  get() {
    _getModelList({})
      .then((data: any) => {
        this.Models = data.ChatList;
        this.Count = this.Models.length;
      })
  }
});

let inputText = ref('');
let memoryStatus = ref(true);
const textarea = ref<HTMLTextAreaElement | null>(null);

const autoExpand = () => {
  if (inputText.value && textarea.value) {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = `${textarea.value.scrollHeight}px`;
  }
};

let messages = reactive<ModelMessageList>({
  Count: 0,
  Messages: new Array<ModelMessage>(),
  IsWaiting: false,

  send() {
    if (inputText.value == '') return;
    availableModels.get();
    if (!availableModels.Models[availableModels.ChoosenModel].Available) {
      push.error({
        title: '操作非法',
        message: '该模型当前不可用, 因为正在比赛期间, 已由管理员关闭',
      })
      return;
    }
    let params = {
      ModelType: availableModels.Models[availableModels.ChoosenModel].ModelType,
      Message: new Array<String>,
    };
    let sentMessage: ModelMessage = {
      ModelType: availableModels.Models[availableModels.ChoosenModel].ModelType,
      Message: inputText.value,
      SendByAI: false,
    };

    if (memoryStatus.value) {
      this.Messages.forEach(item => {
        params.Message.push(item.Message);
      });
    }

    this.Messages.push(sentMessage);
    params.Message.push(inputText.value);
    this.IsWaiting = true;
    _messageToModel(params)
      .then((data: any) => {
        this.IsWaiting = false;
        let recievedMessage: ModelMessage = {
          ModelType: data.model,
          Message: data.choices[0].message.content,
          SendByAI: true,
        }
        this.Messages.push(recievedMessage);
      })
      .catch((error: any) => {
        this.IsWaiting = false;
        let recievedMessage: ModelMessage = {
          ModelType: error.model,
          Message: error.choices[0].message.content,
          SendByAI: true,
        }
        this.Messages.push(recievedMessage);
      });
  }
});

watch(inputText, autoExpand);

onMounted(() => {
  availableModels.get();
  autoExpand();
})

</script>