import { serverSupabaseClient } from "#supabase/server";
import { z } from 'zod'
import type { Calendar } from "~/models/CalendarConfig";

const querySchema = z.object({
  world_id: z.number({ coerce: true }).positive().int()
})

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const query = await getValidatedQuery(event, querySchema.parse)

  const output = client
    .from('world_calendars')
    .select(`
      id,
      months:calendar_months (*),
      events:calendar_events (
        id,
        title,
        description,
        hidden,
        startDate:start_date,
        endDate:end_date,
        wiki,
        category:calendar_events_category (*)
      )
    `)
    .eq('world_id', query.world_id)
    .limit(1)
    .single<Calendar>()

  return output
})
