<template>
  <div class="ex-date-range-pick">
    <el-button
      class="ex-date-range-pick__button"
      :icon="Calendar"
      @click="isOpen = !isOpen"
      >{{ selectedDate }}</el-button
    >
    <el-drawer
      ref="drawerInstance"
      v-model="isOpen"
      size="100%"
      :show-close="false"
      v-bind="$attrs"
    >
      <template #title>
        <div class="ex-date-range-pick__drawer__header">
          <el-button
            type="text"
            class="ex-date-range-pick__drawer__header-button"
            :icon="ArrowLeft"
            @click="drawerInstance.handleClose()"
            >返回</el-button
          >
        </div>
      </template>
      <exDateRangeView
        :model-value="modelValue"
        v-bind="$attrs"
        @update:model-value="updateValue"
      ></exDateRangeView>
    </el-drawer>
  </div>
</template>
<script setup>
import { ref, useAttrs, computed } from "vue";
import { Calendar, ArrowLeft } from "@element-plus/icons-vue";
import exDateRangeView from "/@exCom/exDateRangeView.vue";

const $props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const $emits = defineEmits(["update:modelValue"]);
const $attrs = useAttrs();
const drawerInstance = ref(null);
const isOpen = ref(false);

const selectedDate = computed(() =>
  $props.modelValue?.length
    ? $props.modelValue[0] === $props.modelValue[1]
      ? `${$props.modelValue[0]}`
      : `${$props.modelValue[0]}  ~  ${$props.modelValue[1]}`
    : "选择日期"
);

const updateValue = (val) => {
  if (val.length === 2) {
    drawerInstance.value.handleClose();
  }
  $emits("update:modelValue", val);
};
</script>
<style lang="scss" scoped>
.ex-date-range-pick {
  &__drawer {
    &__header {
      &-button {
        color: var(--text-normal);
        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
}
::v-deep {
  .el-drawer {
    &__header {
      margin-bottom: 0;
    }

    &__body {
      padding: 5px 20px;
    }
  }
}
</style>
