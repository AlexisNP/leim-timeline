<script lang="ts" setup>
import { useCalendar } from '@/stores/CalendarStore'

import { Button } from '@/components/ui/button'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import CalendarMenuNav from './CalendarMenuNav.vue'
import CalendarMenuSubnav from './CalendarMenuSubnav.vue'
import CalendarMenuToday from './CalendarMenuToday.vue'
import CalendarSwitch from './CalendarSwitch.vue'
import CalendarCurrentDate from './CalendarCurrentDate.vue'

const { revealAdvancedSearch } = useCalendar()
</script>

<template>
  <header class="pt-4 border-slate-700 border-b-[1px]">
    <div class="px-6 flex justify-between">
      <menu class="flex items-center gap-2">
        <li class="flex items-center">
          <CalendarMenuToday />
        </li>
        <li>
          <CalendarMenuNav />
        </li>
        <li class="ml-6">
          <CalendarCurrentDate />
        </li>
      </menu>

      <menu class="flex items-center gap-2">
        <li>
          <Button search-slash @click="revealAdvancedSearch()">
            <PhMagnifyingGlass size="20" weight="light" />
            Recherche avancée
          </Button>
        </li>
        <li>
          <CalendarSwitch />
        </li>
      </menu>
    </div>

    <div class="ml-6">
      <CalendarMenuSubnav />
    </div>
  </header>
</template>
