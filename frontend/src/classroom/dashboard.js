import Calendar from "components/calendar";
import events from "components/events";
import moment from "moment";
import { useMemo } from "react";
import { Views,momentLocalizer  } from 'react-big-calendar'


export default function Dashboard(){
    const localizer = momentLocalizer(moment);
    let allViews = Object.keys(Views).map((k) => Views[k])
    const { defaultDate, max, views } = useMemo(
        () => ({
            defaultDate: new Date(2015, 3, 13),
        //   max: dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours'),
            views:{
                month:true,
                week:true
            }
        }),
        []
      )
    console.log(Views)
    return (
        <Calendar
            // defaultViews={Views.WEEK}
            events={events()}
            style={{ height: 500 }}
            startAccessor="start"
            endAccessor="end"
            step={60}
            views={views}
            defaultDate={defaultDate}
            showMultiDayTimes
            // max={max}

        />
    )
}