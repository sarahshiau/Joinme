import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";


export default function Calendar (props){
    const localizer = momentLocalizer(moment);
    console.log(props)
    return (
        <div className="calendars">
            <BigCalendar {...props} localizer={ localizer }/>
        </div>
    )
}