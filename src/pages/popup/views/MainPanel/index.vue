<template>
  <div class="pixiv-main-panel">
    <div class="pixiv-main-panel-form">
      <el-from v-model="mainPanelForm" label-width="120">
        <el-form-item
          v-for="item in mainPanelFormConfig"
          :key="item.prop"
          :label="item.label"
          :class="item.class"
        >
          <component
            :is="exComponents[item.component]"
            v-model="mainPanelForm[item.prop]"
            v-bind="item.attrs"
          />
        </el-form-item>
      </el-from>
    </div>
    <div class="pixiv-main-panel-lists">
      
    </div>
    <div class="pixiv-main-panel-foot"></div>
  </div>
</template>

<script setup>
import { mainPanelForm as mainPanelFormConfig } from "/@pages/popup/viewsConfig";
import { ElDatePicker } from "element-plus";
import exCheckBoxGroup from "/@exCom/exCheckBoxGroup.vue";
import exSwitchInput from "/@exCom/exSwitchInput.vue";
import exNameRuleInput from "/@exCom/exNameRuleInput.vue";
import exFolderNameDrop from "/@exCom/exFolderNameDrop.vue";
import { ref } from "vue";

const exComponents = {
  ElDatePicker,
  exCheckBoxGroup,
  exSwitchInput,
  exNameRuleInput,
  exFolderNameDrop
};
let mainPanelForm = ref({
  fileTypeCheckList: [],
  price: Array(2),
  date: '',
  nameRule: ''
});
</script>

<style lang="scss" scoped>
.pixiv-main-panel {
  width: 660px;
  height: 500px;
  padding: 20px;

  ::v-deep {
    .el-form {
      &-item {
        &.label-position__top {
          display: block;
        }
      }
    }
  }
}
</style>