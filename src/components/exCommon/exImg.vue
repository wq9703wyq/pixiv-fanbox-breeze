<template>
  <exMaskFrame
    class="ex-img"
    v-bind="$attrs"
    :status="imgStatus"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @mouseenter="errorShowIcon = true"
    @mouseleave="errorShowIcon = false"
    @click="imgReload"
  >
    <template #error>
      <div class="ex-img__mask-error">
        <div v-show="!errorShowIcon" class="ex-img__mask-error-default">
          <Close />
        </div>
        <div v-show="errorShowIcon" class="ex-img__mask-error-refresh">
          <Refresh />
        </div>
      </div>
    </template>
    <el-skeleton :loading="isSkeleton" class="ex-img__skeleton" animated>
      <template #template>
        <el-skeleton-item class="ex-img__skeleton-single" variant="image" />
      </template>
    </el-skeleton>
    <el-image
      v-if="isStandUp"
      v-bind="$attrs"
      :src="innerUrl"
      fit="contain"
      @load="imgLoaded"
      @error="imgErrorCatch"
    >
      <template #error><span></span></template>
    </el-image>
  </exMaskFrame>
</template>

<script setup>
import { useAttrs, ref, computed } from "vue";
import exMaskFrame from "./exMaskFrame.vue";

const $props = defineProps({
  url: {
    type: String,
    default: "",
  },
  modelValue: Boolean,
  status: {
    type: String,
    default: "",
  },
  isStandUp: Boolean,
});
const reLoadRandom = ref(0);
const isLoadError = ref(false);
const errorShowIcon = ref(false);
const $emit = defineEmits(["update:modelValue", "load", "error"]);
const $attrs = useAttrs();
const isSkeleton = ref(true);

const imgStatus = computed(() => (isLoadError.value ? "error" : $props.status));

const innerUrl = computed(() =>
  reLoadRandom.value ? `${$props.url}#${reLoadRandom.value}` : `${$props.url}`
);

const imgLoaded = ($events) => {
  $emit("load", $events);
  isSkeleton.value = false;
};

const imgErrorCatch = (error) => {
  $emit("error", error);
  isLoadError.value = true;
  isSkeleton.value = false;
};

const imgReload = () => {
  if (isLoadError.value) {
    reLoadRandom.value += 1;
    isSkeleton.value = true;
    isLoadError.value = false;
  }
};
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
}
</style>
