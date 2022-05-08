<template>
  <div class="pixiv-main-panel">
    <div class="pixiv-main-panel-form">
      <el-from v-model="mainPanelForm" label-width="120">
        <el-form-item
          v-for="item in mainPanelFormConfig"
          :key="item.prop"
          :label="item.label"
        >
          <component
            :is="exComponents[item.component]"
            v-model="mainPanelForm[item.prop]"
            v-bind="item"
          />
        </el-form-item>
      </el-from>
    </div>
    <div class="pixiv-main-panel-lists"></div>
    <div class="pixiv-main-panel-foot"></div>
  </div>
</template>

<script setup>
import { mainPanelForm as mainPanelFormConfig } from "/@pages/popup/viewsConfig";
import exCheckBoxGroup from "/@exCom/exCheckBoxGroup.vue";
import exSwitchInput from "../../../../components/exCommon/exSwitchInput.vue";
import { ref } from "vue";

const exComponents = {
  exCheckBoxGroup,
  exSwitchInput,
};
let mainPanelForm = ref({
  fileTypeCheckList: [],
  price: [],
});
</script>

<style lang="scss" scoped>
.pixiv-main-panel {
  width: 660px;
  padding: 20px;
}
</style>