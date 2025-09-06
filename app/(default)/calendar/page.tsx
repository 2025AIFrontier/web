'use client'

import { CalendarProvider } from './calendar-context'
import CalendarNavigation from './calendar-navigation'
import CalendarTable from './calendar-table'
import CalendarTitle from './title'
import CalendarContent from './calendar-content'
import CalendarTabs from './calendar-tabs'
import PageSidebarLayout from '@/components/ui/page-sidebar-layout'
import CalendarSidebarMenu from './calendar-sidebar-menu'

export default function Calendar() {

  // Some dummy events data
  const events = [
    // Previous month
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 8, 3),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 8, 7),
      eventName: '⛱️ Relax for 2 at Marienbad',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 12, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 12, 11),
      eventName: 'Team Catch-up',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 18, 2),
      eventEnd: null,
      eventName: '✍️ New Project (2)',
      eventColor: 'yellow'
    },
    // Current month
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 11),
      eventName: 'Meeting w/ Patrick Lin',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 19),
      eventEnd: null,
      eventName: 'Reservation at La Ginestre',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 3, 9),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 3, 10),
      eventName: '✍️ New Project',
      eventColor: 'yellow'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 7, 21),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 7, 22),
      eventName: '⚽ 2024 - Semi-final',
      eventColor: 'red'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 11),
      eventName: 'Meeting w/Carolyn',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 13),
      eventEnd: null,
      eventName: 'Pick up Marta at school',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 14),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 15),
      eventName: 'Meeting w/ Patrick Lin',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 9, 19),
      eventEnd: null,
      eventName: 'Reservation at La Ginestre',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 11, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 11, 11),
      eventName: '⛱️ Relax for 2 at Marienbad',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 11, 19),
      eventEnd: null,
      eventName: '⚽ 2024 - Semi-final',
      eventColor: 'red'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 11),
      eventName: 'Team Catch-up',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 2),
      eventEnd: null,
      eventName: 'Pick up Marta at school',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 3),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 21, 7),
      eventName: '✍️ New Project (2)',
      eventColor: 'yellow'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 11),
      eventName: 'Team Catch-up',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 19),
      eventEnd: null,
      eventName: '⚽ 2024 - Semi-final',
      eventColor: 'red'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 23, 0),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 23, 23),
      eventName: 'You stay at Meridiana B&B',
      eventColor: 'indigo'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 11),
      eventName: 'Meeting w/ Kylie Joh',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth(), 29, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 29, 11),
      eventName: 'Call Request ->',
      eventColor: 'sky'
    },
    // Next month
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 2, 3),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 2, 7),
      eventName: '✍️ New Project (2)',
      eventColor: 'yellow'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 14, 10),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 11),
      eventName: 'Team Catch-up',
      eventColor: 'sky'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 25, 2),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 25, 3),
      eventName: 'Pick up Marta at school',
      eventColor: 'green'
    },
    {
      eventStart: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 27, 21),
      eventEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 27, 22),
      eventName: '⚽ 2024 - Semi-final',
      eventColor: 'red'
    },
  ]

  return (
    <CalendarProvider>
      <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-0 w-full max-w-[96rem] mx-auto">
        <PageSidebarLayout sidebarContent={<CalendarSidebarMenu />}>
          {/* Tab Content */}
          <CalendarTabs>
            <CalendarContent events={events} />
          </CalendarTabs>
        </PageSidebarLayout>
      </div>
    </CalendarProvider>
  )
}