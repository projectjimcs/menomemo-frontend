import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from '@fullcalendar/daygrid'
import momentPlugin from '@fullcalendar/moment'
import React, { Fragment, useEffect, useRef, useState } from "react";
import moment, { Moment } from 'moment';
import axiosConfig from '../axiosConfig';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import TimePicker from '@mui/lab/TimePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function Calendar(props) {
  const isFirstUpdate = useRef(true);
  const calendarRef = useRef(null);
  const { bookings } = props;
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState({});
  const [editView, setEditView] = useState(false);
  const [date, setDate] = useState<Moment | null>(null);
  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);
  const [allDay, setAllDay] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (isFirstUpdate.current) {
      isFirstUpdate.current = false;
    } else {
      openBooking();
    }
  }, [selectedBooking]);

  function openBooking() {
    setOpen(true);
  }

  function closeBooking() {
    setOpen(false);
    setEditView(false);
  }

  function handleBookingClick(booking) {
    const bookingData = booking.event;

    const parsedStart = moment(bookingData.start)
    const parsedEnd = bookingData.end ? moment(bookingData.end) : parsedStart.clone().endOf('day');

    const formattedBooking = {
      id: bookingData.id,
      title: bookingData.title,
      isAllDay: bookingData.allDay,
      bookingDate: parsedStart.format('MMMM Do, YYYY'),
      startTime: parsedStart.format('h:mm A'),
      endTime: parsedEnd ? parsedEnd.format('h:mm A') : null,
      notes: bookingData.extendedProps.notes,
      completed: bookingData.extendedProps.isCompleted,
    }

    setTitle(formattedBooking.title);
    setNotes(formattedBooking.notes);
    setDate(parsedStart);
    setStartTime(parsedStart);
    setEndTime(parsedEnd);
    setAllDay(formattedBooking.isAllDay);
    setCompleted(formattedBooking.completed);
    setSelectedBooking(formattedBooking);
  }

  function handleEditClick() {
    setEditView(true);
  }

  async function handleEditSubmit() {
    try {
      const response = await axiosConfig.put(`/bookings/${selectedBooking.id}`, {
        title: title,
        notes: notes,
        date: date?.format('YYYY-MM-DD'),
        startTime: startTime?.format('HH:mm:ss'),
        endTime: endTime?.format('HH:mm:ss'),
        isAllDay: allDay,
        isCompleted: completed,
      });

      console.log(response)
    } catch (err) {
      console.log('Error in updating booking');
    }
  }

  return (
    <Fragment>
      <FullCalendar
        ref={calendarRef}
        plugins={[momentPlugin, dayGridPlugin, interactionPlugin]}
        editable
        displayEventTime
        events={bookings}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: true,
        }}
        eventClick={handleBookingClick}
      />

      <Modal
        open={open}
        onClose={closeBooking}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          {
            editView ?
            (
              <Fragment>
                <Typography id="modal-modal-title" variant="h6">
                  Edit Booking
                </Typography>
                <TextField
                  id="title-field"
                  label="Title"
                  variant="outlined"
                  defaultValue={selectedBooking.title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <div>
                  <FormControlLabel control={
                    <Checkbox
                      checked={allDay}
                      onChange={(e) => {
                        setAllDay(e.target.checked);
                      }}
                    />
                  } label="All Day" />
                </div>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newDate) => {
                    setDate(newDate);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(newStartTime) => {
                    setStartTime(newStartTime);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(newEndTime) => {
                    setEndTime(newEndTime);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TextField
                  id="notes-field"
                  label="Notes"
                  variant="outlined"
                  defaultValue={selectedBooking.notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                  }}
                />
                <div>
                  <FormControlLabel control={
                    <Checkbox
                      checked={completed}
                      onChange={(e) => {
                        setCompleted(e.target.checked);
                      }}
                    />
                  } label="Completed" />
                </div>
              </Fragment>
            )
            :
            (
              <Fragment>
                <Typography id="modal-modal-title" variant="h6">
                {selectedBooking.title}
                </Typography>
                <Typography id="modal-modal-date" variant="subtitle1">
                  {selectedBooking.bookingDate}
                </Typography>
                <Typography id="modal-modal-time" variant="subtitle2">
                  {selectedBooking.isAllDay ? 'All Day' : `${selectedBooking.startTime} - ${selectedBooking.endTime || 'TBD'}`}
                </Typography>
                <Typography id="modal-modal-description" variant="body2">
                  Notes: {selectedBooking.notes || 'N/A'}
                </Typography>
              </Fragment>
            )
          }
          <div>
            <Button
              variant="contained"
              onClick={closeBooking}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={editView ? handleEditSubmit : handleEditClick}
            >
              {editView ? 'Submit' : 'Edit'}
            </Button>
          </div>
        </Box>
      </Modal>
    </Fragment>
  );
}

export default Calendar;
