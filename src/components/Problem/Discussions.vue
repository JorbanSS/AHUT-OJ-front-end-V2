<template>
  <div class="space-y-6">
    <div v-for="discussion in discussions.discussions" :key="discussion.SID">
      <div class="card border shadow-lg p-6 bg-white mb-4">
        <div class="flex justify-between items-center mb-4">
          <div class="flex flex-row items-center">
            <img :src="getHeadURL(discussion.HeadURL)" alt="Avatar" class="w-12 h-12 rounded-full mr-4">
            <div>
              <div class="flex space-x-2">
                <div class="font-bold">{{ discussion.UserName }}</div>
                <span>({{ discussion.UID }})</span>
              </div>
              <div class="text-gray-500 text-sm">{{ ConvertTools.PrintTime(discussion.CreateTime, 1, 1) }}</div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              :style="{ backgroundColor: (discussion.IsFavorite ? '#eb4868' : ''), color: (discussion.IsFavorite ? 'white' : '') }"
              class="btn flex items-center space-x-1"
              @click="discussions.giveThumbsUp(discussion.SID, discussion.IsFavorite)">
              <thumbs-up theme="filled" size="18" />
              <span>{{ discussion.FavoriteCount }}</span>
            </button>
            <button class="btn flex items-center space-x-1">
              <comment theme="outline" size="18" />
              <span>{{ discussion.Data == null ? 0 : discussion.Data.length }}</span>
            </button>
          </div>
        </div>
        <div class="font-bold text-xl mb-2">{{ discussion.Title }}</div>
        <div class="overflow-hidden mb-4">
          <MdPreview :modelValue="discussion.Text" class="-mx-4 -my-5 w-full" />
        </div>
        <div class="divider"></div> 
        <template v-if="discussion.Data != null">
          <div v-for="comment in discussion.Data">
            <component :is="ChatBubble" :comment="comment" :UID="discussion.UID" />
          </div>
        </template>
      </div>
    </div>
  </div>
  <!-- <dialog id="mdEditor" class="modal">
    <div class="modal-box max-w-5xl">
      <h3 class="font-bold text-lg mb-4">发表题解</h3>
      <label class="input input-bordered flex items-center gap-2 mb-2">
        标题
        <input type="text" class="grow" placeholder="" v-model="homeNotice.Title">
      </label>
      <MdEditor v-model="homeNotice.Content" :height="500" :toolbars="markdownToolbars" />
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消修改</button>
          <button class="btn btn-neutral" @click="homeNotice.edit()">提交修改</button>
        </form>
      </div>
    </div>
  </dialog> -->
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { push } from 'notivue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { ThumbsUp, Comment } from '@icon-park/vue-next';

import { } from '@/config';
import { } from '@/interfaces/record';
import { useUserDataStore } from '@/stores/UserData';
import { _getDiscussions, _giveThumbsUp } from '@/apis/discussion';
import { getHeadURL, ConvertTools } from '@/utils/globalFunctions';
import { DiscussionsType } from '@/interfaces/discussion';
import ChatBubble from '@/components/Main/ChatBubble.vue';

const route = useRoute();
const router = useRouter();
const userDataStore = useUserDataStore();

let discussions = reactive<DiscussionsType>({
  PID: '',
  count: 0,
  discussions: [],

  get() {
    let params = {
      PID: this.PID,
      Page: 0,
      Limit: 20,
    }
    _getDiscussions(params)
      .then((data: any) => {
        this.count = data.Count;
        this.discussions = data.SolutionList;
      })
  },

  giveThumbsUp(SID: number, IsFavorite: number) {
    let params = {
      ActionType: IsFavorite ? 3 : 1,
      SID: SID,
      UID: userDataStore.UID,
    };
    if (params.UID == '' || userDataStore.isLogin == false) {
      push.error({
        title: '点赞失败',
        message: '请先登录',
      });
      return;
    }
    _giveThumbsUp(params)
      .then(() => {
        discussions.discussions.forEach((item) => {
          if (item.SID == SID) {
            item.IsFavorite = !item.IsFavorite;
            item.FavoriteCount = IsFavorite ? item.FavoriteCount - 1 : item.FavoriteCount + 1;
            push.success({
              title: item.IsFavorite ? '点赞成功' : '取消点赞成功',
            });
          }
        })
      })
  }
});

function syncUrl() {
  discussions.PID = route.params.PID as string;
}

onMounted(() => {
  syncUrl();
  discussions.get();
})

</script>