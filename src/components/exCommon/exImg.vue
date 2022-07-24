<template>
  <div
    class="ex-img"
    :class="selectedStatus"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <el-skeleton :loading="isSkeleton" class="ex-img__skeleton" animated>
      <template #template>
        <el-skeleton-item class="ex-img__skeleton-single" variant="image" />
      </template>
    </el-skeleton>
    <el-image
      v-if="isStandUp"
      v-bind="$attrs"
      :src="url"
      fit="contain"
      @load="imgLoaded"
    />
    <div v-show="status" class="ex-img-mask" :class="selectedStatus">
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
import { computed, useAttrs, ref } from "vue";

const prop = defineProps({
  url: String,
  modelValue: Boolean,
  status: String,
  isStandUp: Boolean,
});
const $emit = defineEmits(["update:modelValue", "load"]);
const $attrs = useAttrs();
const isSkeleton = ref(true);

const imgLoaded = ($events) => {
  $emit("load", $events);
  isSkeleton.value = false;
};

const selectedStatus = computed(() => {
  if (!prop.statu) {
    return prop.modelValue ? "is-active" : "is-inactive";
  }
  return {
    downloading: "is-downloading",
    success: "is-success",
    error: "is-error",
    pause: "is-pause",
  }[prop.statu];
});
</script>

<style lang="scss" scoped>
.ex-img {
  position: relative;
  cursor: pointer;

  &__skeleton {
    position: absolute;
    height: 100%;

    &-single {
      height: 100%;
    }
  }
  .el-image {
    overflow: unset;
  }

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
