import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from '@fullcalendar/daygrid'
import momentPlugin from '@fullcalendar/moment'
import { useRef } from "react";

function Calendar(props) {
  const calendarRef = useRef(null);
  const { bookings } = props;

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[momentPlugin, dayGridPlugin, interactionPlugin]}
      editable
      selectable
      displayEventTime
      events={bookings}
      eventTimeFormat={{
        hour: 'numeric',
        minute: '2-digit',
        meridiem: true,
      }}
    />
  );
}

export default Calendar;
