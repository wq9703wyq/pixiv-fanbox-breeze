<!--
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-05 21:36:14
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-05 23:59:28
-->
<template>
  <div class="ex-swtich-input">
    <el-switch v-model="isInput" size="small" @change="updateModelVal" />
    <el-input-number
      v-for="(item, index) in num"
      v-show="isInput"
      :key="index"
      v-model="num[index]"
      class="ex-swtich-input__number"
      :controls="false"
      unit="¥"
      @input="updateModelVal"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      isInput: false,
      val: [],
    }),
  },
});

const $emit = defineEmits(["update:modelValue"]);

const num = ref(props.modelValue.val);
const isInput = ref(props.modelValue.isInput);
watch(
  () => props.modelValue,
  (val) => {
    num.value = [...val.val];
    isInput.value = val.isInput;
  }
);
const updateModelVal = function () {
  $emit("update:modelValue", { isInput: isInput.value, val: [...num.value] });
};
</script>

<style lang="scss" scoped>
.ex-swtich-input {
  height: 35px;
  &__number {
    margin-right: 10px;
    ::v-deep .el-input__wrapper {
      // &::v-deep {
      box-shadow: none;
      border-bottom: 1px solid var(--input-border);
      border-radius: 0;
      &.is-focus {
        border-bottom-color: var(--components-active);
      }
      // }
    }
    &[unit="¥"] {
      ::v-deep .el-input__wrapper {
        &:after {
          content: "¥";
        }
      }
    }
    &::after {
      content: " ";
      position: absolute;
      top: 50%;
      right: -10px;
      transform: translate(-50%);
      width: 5px;
      height: 1px;
      background-color: var(--text-title);
    }
    &:last-child {
      margin-right: unset;
      &::after {
        width: unset;
      }
    }
  }
}
</style>
