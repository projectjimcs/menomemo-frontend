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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function Calendar(props) {
  const isFirstUpdate = useRef(true);
  const calendarRef = useRef(null);
  const { bookings, patients, doctors } = props;
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState({});
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [mode, setMode] = useState('');
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
    setMode('');
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setAllDay(false);
    setTitle('');
    setNotes('');
    setCompleted(false);
    setSelectedPatient('');
    setSelectedDoctor('');
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
    console.log(formattedBooking)
    setTitle(formattedBooking.title);
    setNotes(formattedBooking.notes);
    setDate(parsedStart);
    setStartTime(parsedStart);
    setEndTime(parsedEnd);
    setAllDay(formattedBooking.isAllDay);
    setCompleted(formattedBooking.completed);
    setSelectedBooking(bookingData);
  }

  function handleEditClick() {
    setMode('edit');
  }

  async function handleSubmit() {
    let url = '/bookings'
    let response;

    if (mode === 'edit') {
      url += `/${selectedBooking.id}`;
    }

    const sendData = {
      title: title,
      notes: notes,
      date: date?.format('YYYY-MM-DD'),
      startTime: startTime?.format('HH:mm:ss'),
      endTime: endTime?.format('HH:mm:ss'),
      isAllDay: allDay,
      isCompleted: completed,
      patient: selectedPatient,
      doctor: selectedDoctor,
    };

    try {
      if (mode === 'edit') {
        response = await axiosConfig.put(url, sendData);
      } else {
        response = await axiosConfig.post(url, sendData);
      }

      console.log(response)
      if (response.statusText === 'OK' || response.statusText === 'Created') {
        const updatedBooking = response.data;

        // !!! God awful way, need to change later because it's having to
        // grab all bookings and loop through each update
        props.fetchBookings();
        closeBooking();
      }

    } catch (err) {
      console.log(err)
      console.log('Error in add/update booking');
    }
  }

  function handleDateClick(event) {
    const parsedDate = moment(event.date);
    console.log(parsedDate)
    console.log('date click event')
    console.log(event)
    setMode('add');
    setDate(parsedDate);
    setOpen(true);
  }

  function handlePatientChange(event) {
    setSelectedPatient(event.target.value);
  }

  function handleDoctorChange(event) {
    setSelectedDoctor(event.target.value);
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
        dateClick={handleDateClick}
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
            mode ?
            (
              <Fragment>
                <Typography id="modal-modal-title" variant="h6">
                  {`${mode === 'add' ? 'Add' : 'Edit'} Booking`}
                </Typography>
                <TextField
                  id="title-field"
                  label="Title"
                  variant="outlined"
                  defaultValue={title}
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
                  multiline
                  defaultValue={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel id="patient-select-label">Patient Select</InputLabel>
                  <Select
                    labelId="patient-select-label"
                    id="patient-select"
                    value={selectedPatient}
                    label="Patient Select"
                    onChange={handlePatientChange}
                  >
                    {
                      patients.map((patient) => {
                        return <MenuItem value={patient.uuid}>{`${patient.firstname} ${patient.lastname}`}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="doctor-select-label">Doctor Select</InputLabel>
                  <Select
                    labelId="doctor-select-label"
                    id="doctor-select"
                    value={selectedDoctor}
                    label="Doctor Select"
                    onChange={handleDoctorChange}
                  >
                    {
                      doctors.map((doctor) => {
                        return <MenuItem value={doctor.uuid}>{`${doctor.firstname} ${doctor.lastname}`}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
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
                  {title}
                </Typography>
                <Typography id="modal-modal-date" variant="subtitle1">
                  {date?.format('MMMM Do, YYYY')}
                </Typography>
                <Typography id="modal-modal-time" variant="subtitle2">
                  {allDay ? 'All Day' : `${startTime?.format('h:mm A')} - ${endTime?.format('h:mm A') || 'TBD'}`}
                </Typography>
                <Typography id="modal-modal-description" variant="body2">
                  Notes: {notes || 'N/A'}
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
              onClick={mode ? handleSubmit : handleEditClick}
            >
              {mode ? 'Submit' : 'Edit'}
            </Button>
          </div>
        </Box>
      </Modal>
    </Fragment>
  );
}

export default Calendar;
