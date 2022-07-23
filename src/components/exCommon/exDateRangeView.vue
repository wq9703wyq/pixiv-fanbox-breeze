<template>
  <div class="ex-date-range-view">
    <exDatePickView
      v-bind="$attrs"
      :model-value="modelValue"
      class="ex-date-range-view__left"
      @update:model-value="(val) => $emits('update:modelValue', val)"
    ></exDatePickView>
    <exDatePickView
      v-bind="$attrs"
      :model-value="modelValue"
      :range-belong="false"
      class="ex-date-range-view__right"
      @update:model-value="(val) => $emits('update:modelValue', val)"
    ></exDatePickView>
  </div>
</template>

<script setup>
import { useAttrs } from "vue";
import exDatePickView from "./exDatePickView.vue";

const $attrs = useAttrs();
defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const $emits = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.ex-date-range-view {
  display: flex;

  &__left {
    padding-right: 10px;
    border-right: 1px solid var(--border-primary);
  }
  &__right {
    padding-left: 10px;
  }
}
</style>
