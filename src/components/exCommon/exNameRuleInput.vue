<template>
  <div class="ex-name-rule-input">
    <el-breadcrumb class="ex-name-rule-input__path" separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in folderPath"
        :key="`${item}_${index}`"
        class="ex-name-rule-input__path-folder"
      >
        <span v-if="index !== folderPath.length - 1">{{ item }}</span>
        <exFolderNameDrop
          v-else
          v-model="folderPath[index]"
          @change="addFolderPath"
        />
      </el-breadcrumb-item>
      <el-breadcrumb-item class="ex-name-rule-input__path-file"
        >file Name</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import exFolderNameDrop from "./exFolderNameDrop.vue";
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      folderPath: [""],
      fileName: "",
    }),
  },
});
let folderPath = ref([...props.modelValue.folderPath]);
let fileName = ref(props.modelValue.fileName);

watch(props.modelValue, (val) => {
  folderPath = val.folderPath;
  fileName = val.fileName;
});

function addFolderPath(path) {
  // folderPath.value.push(path.command);
}
function removeFolderPath(index) {
  folderPath.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.ex-name-rule-input {
  padding: 20px;

  &__path-file {
    height: 24px;
  }
}
</style>