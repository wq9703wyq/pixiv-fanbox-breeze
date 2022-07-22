<!--
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 22:12:27
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-06 00:00:02
-->
<template>
  <div class="pixiv-main-panel" :class="{ isPanelExpand: panelExpand }">
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
            @open="datePickOpen"
            @close="datePickCloase"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-loading="grabLoading"
            :disabled="grabLoading"
            type="primary"
            @click="grabDraft"
            ><span>抓取</span></el-button
          >
        </el-form-item>
      </el-from>
      <!-- <exDateRangeView v-model="testDate" @panelChange="panelChange"></exDateRangeView> -->
    </div>
    <div class="pixiv-main-panel-lists"></div>
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
import exDateRangePick from "/@exCom/exDateRangePick.vue";
import { ref } from "vue";
import PopupSender from "/@/utils/popupSender";

const exComponents = {
  ElDatePicker,
  exCheckBoxGroup,
  exSwitchInput,
  exNameRuleInput,
  exFolderNameDrop,
  exDateRangePick,
};
const mainPanelForm = ref({
  fileTypeCheckList: [".jpg.png.jpeg", ".zip"],
  price: { isInput: false, val: Array(2) },
  date: "",
  nameRule: "",
});
const grabLoading = ref(false);
const panelExpand = ref(false);

const datePickOpen = () => {
  panelExpand.value = true;
};

const datePickCloase = () => {
  panelExpand.value = false;
};

const getUserPlanList = async function () {
  const _popupSender = new PopupSender();
  // 请求content返回当前页面作者赞助列表
  const [res] = await _popupSender.sendTabMsg({ event: "getUserPlanList" });
  const topPrice = res.find((item) => item.paymentMethod)?.fee;
  mainPanelForm.value.price = {
    isInput: mainPanelForm.value.price.isInput,
    val: [0, topPrice || 0],
  };
};

const grabDraft = async function () {
  const _popupSender = new PopupSender();
  const filterParams = {
    ...mainPanelForm.value,
    price: mainPanelForm.value.price.isInput
      ? mainPanelForm.value.price.val
      : false,
  };
  grabLoading.value = true;
  // 请求content返回范围内的文件
  const res = await _popupSender.sendTabMsg({
    event: "grabDraftByUser",
    args: {
      filterParams,
    },
  });
  // 向background发送抓取文件
  await PopupSender.sendRunTimeMsg({
    event: "filterFileListPush",
    args: { list: res, mainPanelForm: mainPanelForm.value },
  });
  chrome.runtime.openOptionsPage();
  grabLoading.value = false;
};

const init = async function () {
  getUserPlanList();
  const [_mainPanelForm] = await PopupSender.sendRunTimeMsg({
    event: "popupInit",
  });
  mainPanelForm.value = { ...mainPanelForm.value, ..._mainPanelForm };
};
init();
</script>

<style lang="scss" scoped>
.pixiv-main-panel {
  width: 660px;
  padding: 20px;

  &.isPanelExpand {
    height: 300px;
  }

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
