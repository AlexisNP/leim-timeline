<script lang="ts" setup>
import { getRelativeString, type LeimDate } from '@/models/Date'
import type { CalendarEvent } from '@/models/Events'
import { useCalendar } from '@/stores/CalendarStore'
import { useCalendarEvents } from '@/stores/EventStore'

import {
  PhHourglassMedium,
  PhAlarm,
  PhHourglassHigh,
  PhHourglassLow,
  PhArrowBendDoubleUpLeft,
  PhArrowBendDoubleUpRight
} from '@phosphor-icons/vue'
import { Badge } from '@/components/ui/badge'
import { PopoverContent } from '@/components/ui/popover'

const { defaultDate, getFormattedDateTitle, jumpToDate } = useCalendar()
const { getRelativeEventFromEvent } = useCalendarEvents()

const props = defineProps<{
  event: CalendarEvent
  spansMultipleDays: boolean
  isStartEvent?: boolean
  isEndEvent?: boolean
}>()

const emit = defineEmits<{
  (e: 'query:close-popover'): void
}>()

const dateDifference: string = getRelativeString(defaultDate, props.event.startDate)
const dateDuration: string | null = props.event.endDate
  ? getRelativeString(props.event.startDate, props.event.endDate, 'compact')
  : null

function handleJumpToDate(date: LeimDate) {
  jumpToDate(date)
  emit('query:close-popover')
}

function handleGotoRelativeEvent(position: 'next' | 'prev' = 'next') {
  try {
    const { targetDate } = getRelativeEventFromEvent(props.event, position, props.isEndEvent)

    handleJumpToDate(targetDate)
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <PopoverContent
    class="event-details w-96"
    :align="'center'"
    :align-offset="50"
    :side="'left'"
    :collision-padding="60"
    :hide-when-detached="true"
    :class="{
      'border-slate-800': !event.category,
      'border-lime-800': event.category === 'naissance',
      'border-stone-600': event.category === 'mort',
      'border-orange-800': event.category === 'catastrophe',
      'border-pink-800': event.category === 'catastrophe naturelle',
      'border-sky-800': event.category === 'législation',
      'border-purple-800': event.category === 'religion',
      'border-emerald-800': event.category === 'joueurs',
      'border-amber-800': event.category === 'inauguration',
      'border-green-800': event.category === 'invention',
      'border-cyan-800': event.category === 'science',
      'border-slate-600': event.category === 'bénédiction',
      'border-purple-700': event.category === 'découverte',
      'border-indigo-700': event.category === 'exploration',
      'border-amber-700': event.category === 'construction',
      'border-violet-700': event.category === 'arcanologie',
      'border-rose-800': event.category === 'criminalité',
      'border-stone-700': event.category === 'scandale',
      'border-yellow-600': event.category === 'commerce'
    }"
  >
    <div class="grid gap-1">
      <div class="text-lg font-semibold">
        {{ event.title }}
      </div>

      <div class="mb-1">
        <template v-if="!event.endDate">
          <p class="font-semibold">{{ getFormattedDateTitle(event.startDate, true) }}</p>
        </template>
        <template v-else>
          <p class="font-semibold">
            Du {{ getFormattedDateTitle(event.startDate, true) }} au
            {{ getFormattedDateTitle(event.endDate, true) }}
          </p>
        </template>
      </div>

      <div class="mb-1 space-y-1">
        <p class="text-sm italic opacity-75 flex items-center gap-1">
          <PhAlarm size="16" weight="fill" /> {{ dateDifference }}
        </p>
        <template v-if="dateDuration">
          <p class="text-sm italic opacity-75 flex items-center gap-1">
            <PhHourglassMedium size="16" weight="fill" /> Pendant {{ dateDuration }}
          </p>
        </template>
      </div>

      <template v-if="event.category || event.secondaryCategories">
        <ul class="flex gap-1">
          <li v-if="event.category">
            <Badge class="mix-blend-luminosity font-bold bg-gray-600" variant="secondary">
              {{ event.category }}
            </Badge>
          </li>

          <li v-for="cat in event.secondaryCategories" :key="cat">
            <Badge class="mix-blend-luminosity bg-gray-600" variant="secondary">
              {{ cat }}
            </Badge>
          </li>
        </ul>
      </template>

      <template v-if="event.description">
        <hr class="border-slate-500 mt-2" />

        <div class="mt-2 text-sm text-slate-300">
          {{ event.description }}
        </div>
      </template>
    </div>

    <nav v-if="event.startDate && event.endDate" class="absolute -top-2 right-2 flex gap-2">
      <Badge class="hover:opacity-100 hover:bg-slate-300" as-child>
        <button
          class="flex gap-1"
          @click="handleJumpToDate(event.startDate!)"
          title="Naviguer au début"
        >
          <PhHourglassHigh size="16" weight="fill" /> Début
        </button>
      </Badge>
      <Badge class="hover:opacity-100 hover:bg-slate-300" as-child title="Naviguer à la fin">
        <button
          class="flex gap-1"
          @click="handleJumpToDate(event.endDate!)"
          title="Naviguer à la fin"
        >
          <PhHourglassLow size="16" weight="fill" /> Fin
        </button>
      </Badge>
    </nav>

    <nav class="mt-2 flex gap-2">
      <Badge class="hover:opacity-100 hover:bg-slate-300" as-child>
        <button
          class="flex gap-1"
          @click="handleGotoRelativeEvent('prev')"
          title="Évènement précédent"
        >
          <PhArrowBendDoubleUpLeft size="16" weight="fill" /> Précédent
        </button>
      </Badge>
      <Badge class="hover:opacity-100 hover:bg-slate-300" as-child title="Naviguer à la fin">
        <button
          class="flex gap-1"
          @click="handleGotoRelativeEvent('next')"
          title="Évènement suivant"
        >
          <PhArrowBendDoubleUpRight size="16" weight="fill" /> Suivant
        </button>
      </Badge>
    </nav>
  </PopoverContent>
</template>

<style lang="scss">
.border-slate-800 {
  --base-color: var(--color-slate-800);
}
.border-lime-800 {
  --base-color: var(--color-lime-800);
}
.border-stone-600 {
  --base-color: var(--color-stone-600);
}
.border-orange-800 {
  --base-color: var(--color-orange-800);
}
.border-pink-800 {
  --base-color: var(--color-pink-800);
}
.border-sky-800 {
  --base-color: var(--color-sky-800);
}
.border-purple-800 {
  --base-color: var(--color-purple-800);
}
.border-emerald-800 {
  --base-color: var(--color-emerald-800);
}
.border-amber-800 {
  --base-color: var(--color-amber-800);
}
.border-green-800 {
  --base-color: var(--color-green-800);
}
.border-cyan-800 {
  --base-color: var(--color-cyan-800);
}
.border-slate-600 {
  --base-color: var(--color-slate-600);
}
.border-purple-700 {
  --base-color: var(--color-purple-700);
}
.border-indigo-700 {
  --base-color: var(--color-indigo-700);
}
.border-amber-700 {
  --base-color: var(--color-amber-700);
}
.border-violet-700 {
  --base-color: var(--color-violet-700);
}
.border-rose-800 {
  --base-color: var(--color-rose-800);
}
.border-stone-700 {
  --base-color: var(--color-stone-700);
}
.border-yellow-600 {
  --base-color: var(--color-yellow-600);
}

.event-details {
  --bg-color: color-mix(in srgb, var(--base-color), var(--color-slate-950) 85%);
  background-color: var(--bg-color);

  hr {
    border-color: var(--base-color);
  }
}
</style>
