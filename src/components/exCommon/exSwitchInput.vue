<template>
  <div class="ex-swtich-input">
    <el-switch v-model="isInput" size="small" />
    <el-input-number
      class="ex-swtich-input__number"
      v-for="(item, index) in num"
      :key="index"
      v-model="num[index]"
      :controls="false"
      unit="¥"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

let num = ref([...props.modelValue]);
let isInput = ref(false);
</script>

<style lang="scss" scoped>
.ex-swtich-input {
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