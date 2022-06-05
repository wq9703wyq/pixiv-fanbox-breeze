<template>
  <div class="ex-folder-name-drop" @click="inputFoucus">
    <input
      :ref="$refs.input"
      id="input"
      class="ex-folder-name-drop__input"
      v-model="_value"
      size="small"
    />
    <el-dropdown
      trigger="click"
      type="text"
      @command="handleCommad"
      :hide-on-click="true"
      @visible-change="setSelectionIndex"
    >
      <el-icon class="ex-folder-name-drop__btn"><ArrowDownBold /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            :command="item.label"
            v-for="item in folederNameList"
            :key="item.label"
            >{{ item.label }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import folederNameList from "/@config/folderNameRule";

const props = defineProps({
  modelValue: String,
});

const $emit = defineEmits(["change", "update:modelValue"]);

const value = ref(props.modelValue);
const selectionIndex = ref(0);

const $refs = {
  input: ref(null),
};
const _value = computed({
  get: () => value.value,
  set: (val) => {
    value.value = val;
    $emit("update:modelValue", val);
  },
});
watch(
  () => props.modelValue,
  (val) => {
    value.value = val;
  }
);
function handleCommad(command) {
  const selectionStart = $refs.input.value.selectionStart;
  const selectionEnd = $refs.input.value.selectionEnd;
  if (selectionStart === selectionEnd) {
    _value.value = `${_value.value.slice(
      0,
      selectionStart
    )}${command}${_value.value.slice(selectionStart)}`;
  } else {
    _value.value = `${_value.value.slice(
      0,
      selectionStart
    )}${command}${_value.value.slice(selectionEnd)}`;
  }
  selectionIndex.value = selectionStart + command.length;
}
function setSelectionIndex(visible) {
  if (!visible) {
    inputFoucus();
    $refs.input.value.selectionStart = selectionIndex.value;
    $refs.input.value.selectionEnd = selectionIndex.value;
  }
}
function inputFoucus() {
  $refs.input.value.focus();
}
</script>

<style lang="scss" scoped>
.ex-folder-name-drop {
  display: flex;
  width: 100%;
  height: 24px;
  padding: 3px 15px;
  border-radius: 3px;
  background-color: var(--primary-color-7);
  cursor: text;
  &__input {
    width: 100%;
    border: none;
    outline: none;
    background-color: unset;
    color: var(--text-btn);
  }
  .ex-folder-name-drop__btn {
    line-height: 24px;
    color: var(--text-btn);
  }
  ::v-deep {
    .el-dropdown {
      .el-tooltip__trigger {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}
</style>