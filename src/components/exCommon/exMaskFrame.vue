<template>
  <div class="ex-mask-frame" :class="selectedStatus" @click="changeStatus">
    <slot></slot>
    <div
      v-show="status && modelValue"
      class="ex-mask-frame-mask"
      :class="selectedStatus"
    >
      <el-icon v-show="status === 'success'"><Check /></el-icon>
      <el-icon v-show="status === 'error'"><Close /></el-icon>
      <el-icon v-show="status === 'pause'"><VideoPause /></el-icon>
      <el-progress
        v-show="status === 'downloading'"
        :percentage="50"
        :indeterminate="true"
        :show-text="false"
      >
      </el-progress>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";

const prop = defineProps({
  status: String,
  modelValue: Boolean,
});
const $emit = defineEmits(["update:modelValue"]);

const selectedStatus = computed(() =>
  !prop.modelValue
    ? "is-inactive"
    : prop.status
    ? {
        downloading: "is-downloading",
        success: "is-success",
        error: "is-error",
        pause: "is-pause",
      }[prop.status]
    : "is-active"
);

const changeStatus = () => {
  if (!prop.status) {
    $emit("update:modelValue", !prop.modelValue);
  }
};
</script>

<style lang="scss" scoped>
.ex-mask-frame {
  position: relative;
  cursor: pointer;

  &.is-success {
    border: 4px solid var(--succeed-color);
  }
  &.is-downloading,
  &.is-pause {
    border: 4px solid var(--primary-color);
  }

  &.is-error {
    border: 4px solid var(--error-color);
  }

  &.is-active {
    border: 4px solid var(--primary-color);
  }

  &.is-inactive {
    border: 4px solid var(--disable-secondary);

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--disable-secondary);
      opacity: 0.8;
    }
  }

  &-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--mask-color);
    ::v-deep .el-progress {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 15px;
      transform: translate(-50%, -50%);
    }

    &.is-success {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--mask-color-1);
      i {
        font-size: 32px;
        color: var(--succeed-color);
      }
    }

    &.is-error {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--mask-color-1);
      i {
        font-size: 32px;
        color: var(--error-color);
      }
    }

    &.is-pause {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--mask-color-1);
      i {
        font-size: 32px;
        color: var(--error-color);
      }
    }
  }
}
</style>
