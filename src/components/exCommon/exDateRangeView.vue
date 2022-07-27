<template>
  <div class="ex-date-range-view">
    <exDatePickView
      ref="datePickBeforeIns"
      v-bind="$attrs"
      :model-value="modelValue"
      class="ex-date-range-view__left"
      @update:model-value="(val) => $emits('update:modelValue', val)"
      @panel-change="panelChange"
    ></exDatePickView>
    <exDatePickView
      ref="datePickAfterIns"
      v-bind="$attrs"
      :model-value="modelValue"
      :range-belong="false"
      class="ex-date-range-view__right"
      @update:model-value="(val) => $emits('update:modelValue', val)"
      @panel-change="panelChange"
    ></exDatePickView>
  </div>
</template>

<script setup>
import { useAttrs, ref } from "vue";
import exDatePickView from "./exDatePickView.vue";

const datePickBeforeIns = ref();
const datePickAfterIns = ref();
const $attrs = useAttrs();
defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const $emits = defineEmits(["update:modelValue", "panelChange"]);

const panelChange = (events) => {
  const { changeType, dateType } = events;
  if (changeType === "moveAfter") {
    datePickBeforeIns.value.moveAfterDate(dateType);
  } else if (changeType === "moveBefore") {
    datePickAfterIns.value.moveBeforeDate(dateType);
  }
  $emits("panelChange", events);
};
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
