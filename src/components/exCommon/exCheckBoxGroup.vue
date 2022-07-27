<template>
  <div>
    <el-checkbox-group class="ex_check-box-group" v-model="innerSelected">
      <el-checkbox
        v-for="el in options"
        :key="el.label"
        v-bind="el"
      ></el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  options: Object,
  modelValue: Array,
});
const $emit = defineEmits(["update:modelValue"]);
const innerSelected = computed({
  get: () => props.modelValue,
  set: (val) => {
    $emit("update:modelValue", val);
  },
});
</script>

<!-- <style lang="scss" scoped>
</style> -->
