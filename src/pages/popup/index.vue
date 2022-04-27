<template>
  <div class="pixiv-main-panel">
    <div class="pixiv-main-panel-form">
      <el-checkbox-group v-model="fileTypeCheckList">
        <el-checkbox
          v-for="item in fileTypeCheckOptions"
          :key="item.label"
          :label="item.label"
          border
        ></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="pixiv-main-panel-lists"></div>
    <div class="pixiv-main-panel-foot"></div>
  </div>
</template>

<script setup>
import {ref} from "vue";
const fileTypeCheckList = ref([]);
const fileTypeCheckOptions = [
  {
    label: '.zip'
  },
  {
    label: '.jpg.png.jpeg'
  }
]
</script>

<style lang="scss" scoped>
.pixiv-main-panel {
  width: 400px;
}
</style>