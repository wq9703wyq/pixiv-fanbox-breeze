<template>
  <div class="ex-folder-name-drop" @click="inputFoucus">
    <el-input
      :ref="$refs.input"
      class="ex-folder-name-drop__input"
      v-model="_value"
      size="small"
    ></el-input>
    <el-dropdown
      trigger="click"
      type="text"
      :hide-on-click="false"
      @command="handleCommad"
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
watch(props.modelValue, (val) => {
  value.value = val;
});
function handleCommad(command) {
  _value.value = `${_value.value}${command}`;
}

function inputFoucus() {
  $refs.input.value.focus();
}
</script>

<style lang="scss" scoped>
.ex-folder-name-drop {
  display: flex;
  height: 24px;
  padding: 3px 15px;
  border-radius: 3px;
  background-color: var(--primary-color-8);
  cursor: text;
  &__input {
    ::v-deep {
      .el-input__wrapper {
        background-color: unset;
        box-shadow: none;
        .el-input__inner {
          color: var(--text-btn);
        }
      }
    }
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