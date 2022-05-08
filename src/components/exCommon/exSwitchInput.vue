<template>
  <div class="ex-swtich-input">
    <el-switch v-model="isInput" size="small" />
    <el-input-number
      class="ex-swtich-input__number"
      v-model="num"
      size="small"
      :controls="false"
      unit="¥"
    />
    <!-- <span>-</span> -->
    <el-input-number
      class="ex-swtich-input__number"
      v-model="num"
      size="small"
      :controls="false"
      unit="¥"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
let num = ref(undefined);
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