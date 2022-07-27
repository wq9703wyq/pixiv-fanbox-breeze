<template>
  <exMaskFrame
    class="ex-img"
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
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
  </exMaskFrame>
</template>

<script setup>
import { useAttrs, ref } from "vue";
import exMaskFrame from "./exMaskFrame.vue";

defineProps({
  url: String,
  modelValue: Boolean,
  // status: String,
  isStandUp: Boolean,
});
const $emit = defineEmits(["update:modelValue", "load"]);
const $attrs = useAttrs();
const isSkeleton = ref(true);

const imgLoaded = ($events) => {
  $emit("load", $events);
  isSkeleton.value = false;
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
