<template>
  <Row class="justify-center sm:flex-row">
    <template v-if="props.maxPage">
      <div class="join">
        <button class="join-item btn" @click="wrapChangePage(1)">
          <double-left theme="outline" size="20" />
        </button>
        <button class="join-item btn" @click="wrapChangePage(props.page - 1)">
          <left theme="outline" size="20" />
        </button>
        <button class="join-item btn">
          {{ props.page }} / {{ props.maxPage }}
        </button>
        <button class="join-item btn" @click="wrapChangePage(props.page + 1)">
          <right theme="outline" size="20" />
        </button>
        <button class="join-item btn" @click="wrapChangePage(props.maxPage)">
          <double-right theme="outline" size="20" />
        </button>
      </div>

      <div class="join">
        <input
          class="input input-bordered join-item w-20"
          v-model="toPage"
          type="number"
          min="1"
          :max="props.maxPage"
        />
        <button class="btn join-item" @click="wrapChangePage(toPage)">
          跳转
        </button>
      </div>
    </template>

    <span class="pt-4 pb-6 mx-auto" v-else> 无结果 </span>
  </Row>
</template>

<script lang="ts" setup>
import { DoubleLeft, DoubleRight, Left, Right } from "@icon-park/vue-next";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

let toPage = ref();

interface propsType {
  page: number;
  maxPage: number;
  changePage: Function;
}

let props = withDefaults(defineProps<propsType>(), {
  page: 1,
  maxPage: 0,
  changePage: () => {},
});
const wrapChangePage = (toPage: number) => {
  let pg = props.changePage(toPage);
  router.push({ query: { ...route.query, Page: pg } }); //增加历史栈的query
};
</script>
