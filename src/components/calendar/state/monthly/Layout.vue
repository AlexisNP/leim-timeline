<script lang="ts" setup>
import type { LeimDate } from '@/models/Date'
import { useCalendar } from '@/stores/CalendarStore'
import { useThrottleFn } from '@vueuse/core'

import DayTile from './DayTile.vue'

const { staticConfig, currentDate, decrementMonth, incrementMonth } = useCalendar()

const daysPerMonth = staticConfig.daysPerMonth

function getNextMonthDate(day: number): LeimDate {
  let nextDay = day
  let nextMonth = currentDate.currentMonth + 1
  let nextYear = currentDate.currentYear
  let nextPeriod = currentDate.currentPeriod

  // If the new value would exceed the max number of month per year
  if (nextMonth >= staticConfig.monthsPerYear) {
    nextMonth = 0
    // Increment the year
    nextYear++
  }

  if (nextYear >= 0) {
    nextPeriod = 'nante'
  }

  return {
    day: nextDay,
    month: nextMonth,
    year: nextYear,
    period: nextPeriod
  }
}

function handleWheel(e: WheelEvent) {
  const isMovingUp = e.deltaY < 0
  if (isMovingUp) {
    moveCalendarLeft()
  } else {
    moveCalendarRight()
  }
}

const moveCalendarLeft = useThrottleFn(() => {
  decrementMonth()
}, 100)

const moveCalendarRight = useThrottleFn(() => {
  incrementMonth()
}, 100)
</script>

<template>
  <div class="grid grid-cols-10" @wheel="handleWheel">
    <DayTile
      v-for="day in daysPerMonth"
      :key="day"
      :date="{
        day: day,
        month: currentDate.currentMonth,
        year: currentDate.currentYear
      }"
    />
    <DayTile
      v-for="nextMonthDay in 8"
      :key="nextMonthDay"
      faded
      :date="getNextMonthDate(nextMonthDay)"
    />
  </div>
</template>
