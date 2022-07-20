<template>
  <div class="ex-date-pick-view">
    <div class="ex-date-pick-view__head">
      <div class="ex-date-pick-view__head-preview">
        <el-button
          type="text"
          :icon="DArrowLeft"
          @click="moveBeforeDate('year')"
        ></el-button>
        <el-button
          type="text"
          :icon="ArrowLeft"
          @click="moveBeforeDate('month')"
        ></el-button>
      </div>
      <div class="ex-date-pick-view__head-cur-time">
        <div class="ex-date-pick-view__head-cur-time-year">
          {{ curYear }}
        </div>
        <div class="ex-date-pick-view__head-cur-time-month">
          {{ curMonth }}
        </div>
      </div>
      <div class="ex-date-pick-view__head-next">
        <el-button
          type="text"
          :icon="ArrowRight"
          @click="moveAfterDate('month')"
        ></el-button>
        <el-button
          type="text"
          :icon="DArrowRight"
          @click="moveAfterDate('year')"
        ></el-button>
      </div>
    </div>
    <div class="ex-date-pick-view-content">
      <div class="ex-date-view-week"></div>
      <div class="ex-date-view-day">
        <div
          v-for="(date, index) in daysInCurMonthArr"
          :key="date"
          class="ex-date-view-day__single"
          :class="{
            'is-range': daysInRange.includes(date),
            'is-start': daysInRange[0] === date,
            'is-end': daysInRange[daysInRange.length - 1] === date,
          }"
          @click="choiceActiveDate(date)"
          @mouseenter="preSetEnd(date)"
        >
          <div
            :class="{ 'is-active': activeDays.includes(date) }"
            class="ex-date-view-day__single-circle"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import {
  ArrowLeft,
  DArrowLeft,
  ArrowRight,
  DArrowRight,
} from "@element-plus/icons-vue";

const curYear = ref(dayjs().year());
const curMonth = ref(dayjs().format("MM"));
const daysInCurMonthArr = ref([]);
const activeDays = ref([]);
const preEnd = ref();

const daysInRange = computed(() => {
  if (activeDays.value.length <= 1 && !preEnd.value) {
    return [];
  }
  let [day1, day2] = activeDays.value;
  day1 = dayjs(day1);
  day2 = dayjs(preEnd.value || day2);
  const start = day1 > day2 ? day2 : day1;
  const end = day1 > day2 ? day1 : day2;
  return daysInCurMonthArr.value.filter(
    (date) => dayjs(date) >= start && dayjs(date) <= end
  );
});

const preSetEnd = (date) => {
  if (activeDays.value.length && activeDays.value.length < 2) {
    preEnd.value = date;
  }
};

const choiceActiveDate = (date) => {
  preEnd.value = undefined;
  if (
    activeDays.value.length === 2 ||
    (activeDays.value.length === 1 && activeDays.value[0] === date)
  ) {
    activeDays.value = [date];
  } else {
    activeDays.value.push(date);
  }
};

const monthDayInit = () => {
  daysInCurMonthArr.value = [];
  let daysInCurMonth = dayjs(
    `${curYear.value}-${curMonth.value}`
  ).daysInMonth();
  while (daysInCurMonth) {
    daysInCurMonthArr.value.unshift(
      `${curYear.value}-${curMonth.value}-${daysInCurMonth}`
    );
    daysInCurMonth -= 1;
  }
};

const moveAfterDate = (type) => {
  if (type === "year") {
    curYear.value = dayjs(`${curYear.value}`).add(1, "year").year();
  } else if (type === "month") {
    curMonth.value = dayjs(`${curYear.value}-${curMonth.value}`)
      .add(1, "month")
      .format("MM");
  }
  monthDayInit();
};

const moveBeforeDate = (type) => {
  if (type === "year") {
    curYear.value = dayjs(`${curYear.value}`).subtract(1, "year").year();
  } else if (type === "month") {
    curMonth.value = dayjs(`${curYear.value}-${curMonth.value}`)
      .subtract(1, "month")
      .format("MM");
  }
  monthDayInit();
};

monthDayInit();
</script>

<style lang="scss" scoped>
.ex-date-pick-view {
  width: 308px;
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-cur-time {
      display: flex;
      font-size: 16px;
      font-weight: 500;
      color: var(--text-titles);
      &-year {
        &::after {
          content: "-";
          margin: 0 5px;
        }
      }
    }
  }
  &-content {
    width: 308px;
    .ex-date-view-day {
      display: flex;
      flex-wrap: wrap;

      &__single {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        margin: 5px 0;
        &-circle {
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          cursor: pointer;

          &:hover {
            color: var(--button-default-color);
          }

          &.is-active {
            color: var(--button-default-text-hover-color);
            background-color: var(--button-default-color);
            border-radius: 50%;
          }
        }
        &.is-range {
          background-color: var(--primary-color-1);

          &.is-start {
            padding-left: 0;
            margin-left: 10px;
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
          }

          &.is-end {
            padding-right: 0;
            margin-right: 10px;
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
          }
        }
      }
    }
  }
}
</style>
