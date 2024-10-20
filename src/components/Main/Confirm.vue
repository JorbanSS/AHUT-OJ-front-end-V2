<template>
  <slot :showConfirmModal="showModal"></slot>
  <dialog id="confirmModal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="text-lg font-bold">确认操作</h3>
      <p class="py-4">你确定要执行此操作吗？</p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn" onclick="closeModal">取消</button>
          <button class="btn btn-primary" @click="confirmAction">确认</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  action: {
    type: Function,
    required: true,
  },
});

// const modal = ref(null);

const showModal = () => {
  // @ts-ignore
  confirmModal.showModal();
};

const closeModal = () => {
  // @ts-ignore
  confirmModal.closeModal();
};

const confirmAction = () => {
  props.action();
};
</script>

<style scoped></style>
