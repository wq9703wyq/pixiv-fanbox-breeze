<template>
  <div class="ex-date-range-view">
    <exDatePickView
      v-bind="$attrs"
      v-model="activeDays"
      class="ex-date-range-view__left"
    ></exDatePickView>
    <exDatePickView
      v-bind="$attrs"
      v-model="activeDays"
      :range-belong="false"
      class="ex-date-range-view__right"
    ></exDatePickView>
  </div>
</template>

<script setup>
import { ref, useAttrs, watch } from "vue";
import exDatePickView from "./exDatePickView.vue";

const $attrs = useAttrs();
const $props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const $emits = defineEmits(["update:modelValue"]);

const activeDays = ref([...$props.modelValue]);

watch(
  () => activeDays.value,
  (value) => {
    $emits("update:modelValue", value);
  }
);
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
