<template>
  <div class="space-y-6">
    <div>
      <button class="btn btn-neutral btn-lg w-full rounded-2xl" onclick="newDiscussionModal.showModal()"
        :disabled="userDataStore.isLogin == false">
        <add theme="outline" size="22" />
        <span class="text-lg">新建话题</span>
      </button>
    </div>
    <div v-for="discussion in discussions.discussions" :key="discussion.SID">
      <div class="card border shadow-lg p-6 bg-white mb-4">
        <div class="flex justify-between items-center mb-4">
          <div class="flex flex-row items-center">
            <img :src="getHeadURL(discussion.HeadURL)" alt="Avatar" class="w-12 h-12 rounded-full mr-4 cursor-pointer"
              @click="$router.push({ name: 'User', params: { UID: discussion.UID } })">
            <div>
              <div class="flex space-x-2">
                <div class="font-bold cursor-pointer"
                  @click="$router.push({ name: 'User', params: { UID: discussion.UID } })">{{
                    discussion.UserName }}</div>
              </div>
              <div class="text-gray-500 text-sm">{{ ConvertTools.PrintTime(discussion.CreateTime, 1, 1) }}</div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button class="btn flex items-center space-x-1" v-if="userDataStore.UID == discussion.UID"
              @click="editDiscussion.delete(discussion.SID)">
              <delete-one theme="outline" size="18" />
            </button>
            <button class="btn flex items-center space-x-1" v-if="userDataStore.UID == discussion.UID"
              @click="editDiscussion.openEditModal(discussion.SID)">
              <write theme="outline" size="18" />
            </button>
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
        <!-- <div class="divider" v-if="discussion.Data != null"></div> -->
        <div class="m-1"></div>
        <div class="chat chat-start">
          <div class="chat-image avatar">
            <div class="w-12 rounded-full">
              <img alt="Avatar" :src="getHeadURL(userDataStore.HeadURL)" class="cursor-pointer"
                @click="$router.push({ name: 'User', params: { UID: userDataStore.UID } })" />
            </div>
          </div>
          <div class="chat-header flex items-baseline gap-1"
            :class="{ 'flex-row-reverse': userDataStore.UID == discussion.UID }">
            <span class="cursor-pointer font-bold" @click="$router.push({ name: 'User', params: { UID: userDataStore.UID } })">
              {{ userDataStore.UserName }}</span>
          </div>
          <!-- <div class="chat-bubble mt-1">{{ discussion.Text }}</div> -->
          <textarea class="textarea textarea-bordered w-full mt-1" placeholder=""
            v-model="discussion.NewComment"></textarea>
        </div>
        <button class="btn btn-neutral w-fit ml-auto mt-1"
          @click="discussions.comment(discussion.SID, discussion.NewComment)">发表评论</button>
        <div class="m-3" v-if="discussion.Data != null"></div>
        <template v-if="discussion.Data != null">
          <div v-for="comment in discussion.Data">
            <component :is="CommentBubble" :comment="comment" :UID="discussion.UID" :getDiscussionList="discussions.get" />
          </div>
        </template>
      </div>
    </div>
  </div>
  <dialog id="newDiscussionModal" class="modal">
    <div class="modal-box max-w-5xl">
      <h3 class="font-bold text-lg mb-4">发表话题</h3>
      <label class="input input-bordered flex items-center gap-2 mb-2">
        标题
        <input type="text" class="grow" placeholder="" v-model="newDiscussion.Title">
      </label>
      <MdEditor v-model="newDiscussion.Text" :height="500" :toolbars="markdownToolbars" />
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="newDiscussion.add()">发表话题</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="discussionModal" class="modal">
    <div class="modal-box max-w-5xl">
      <h3 class="font-bold text-lg mb-4">编辑话题</h3>
      <label class="input input-bordered flex items-center gap-2 mb-2">
        标题
        <input type="text" class="grow" placeholder="" v-model="editDiscussion.Title">
      </label>
      <MdEditor v-model="editDiscussion.Text" :height="500" :toolbars="markdownToolbars" />
      <div class="modal-action">
        <form method="dialog">
          <button class="btn mr-2">取消</button>
          <button class="btn btn-neutral" @click="editDiscussion.edit()">提交编辑</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { push } from 'notivue';
import { MdEditor, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import 'md-editor-v3/lib/preview.css';
import { ThumbsUp, Comment, Add, DeleteOne, Write } from '@icon-park/vue-next';

import { markdownToolbars } from '@/config';
import { useUserDataStore } from '@/stores/UserData';
import { _addComment, _addDiscussion, _deleteDiscussion, _editDiscussion, _getDiscussions, _giveThumbsUp } from '@/apis/discussion';
import { getHeadURL, ConvertTools } from '@/utils/globalFunctions';
import { DiscussionsType, NewDiscussionType } from '@/interfaces/discussion';
import CommentBubble from '@/components/Main/CommentBubble.vue';

const route = useRoute();
const router = useRouter();
const userDataStore = useUserDataStore();

let newDiscussion = reactive<NewDiscussionType>({
  Title: '',
  Text: '',

  add() {
    if (userDataStore.isLogin == false) {
      push.warning({
        title: '发表失败',
        message: '请先登录',
      });
      return;
    }
    if (this.Title == '' || this.Text == '') {
      push.warning({
        title: '发表失败',
        message: '标题和内容不能为空',
      });
      return;
    }
    let params = {
      PID: route.params.PID,
      UID: userDataStore.UID,
      SID: 0,
      Title: this.Title,
      Text: this.Text,
    };
    _addDiscussion(params)
      .then(() => {
        push.success({
          title: '新建话题成功',
        });
        discussions.get();
      });
  }
});

let editDiscussion = reactive<NewDiscussionType>({
  SID: 0,
  Title: '',
  Text: '',

  openEditModal(SID: number) {
    const foundDiscussion = discussions.discussions.find((item) => item.SID === SID);
    if (foundDiscussion) {
      this.SID = SID;
      this.Title = foundDiscussion.Title;
      this.Text = foundDiscussion.Text;
    }
    // @ts-ignore
    discussionModal.showModal();
  },

  delete(SID: number) {
    let params = {
      PID: route.params.PID,
      UID: userDataStore.UID,
      SID: SID,
    };
    _deleteDiscussion(params)
      .then(() => {
        push.success({
          title: '删除成功',
        });
        discussions.get();
      });
  },

  edit() {
    if (userDataStore.isLogin == false) {
      push.warning({
        title: '发表失败',
        message: '请先登录',
      });
      return;
    }
    if (this.Title == '' || this.Text == '') {
      push.warning({
        title: '发表失败',
        message: '标题和内容不能为空',
      });
      return;
    }
    let params = {
      PID: route.params.PID,
      UID: userDataStore.UID,
      SID: this.SID,
      Title: this.Title,
      Text: this.Text,
    };
    _editDiscussion(params)
      .then(() => {
        push.success({
          title: '新建话题成功',
        });
        discussions.get();
      });
  }
});

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
  },

  comment(SID: number, commentText: string) {
    let params = {
      CID: 0,
      FCID: 0,
      SID: SID,
      Text: commentText,
      Title: '',
      UID: userDataStore.UID,
    };
    _addComment(params)
      .then(() => {
        push.success({
          title: '评论成功',
        });
        discussions.get();
      })
  },
});

function syncUrl() {
  discussions.PID = route.params.PID as string;
}

onMounted(() => {
  syncUrl();
  discussions.get();
})

</script>