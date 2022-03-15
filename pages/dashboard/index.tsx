import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import Calendar from '../../components/Calendar';
import { useMenu } from '../../contexts/MenuContext';
import decodeCookie from '../../helpers/decodeCookie';
import axiosConfig from '../../axiosConfig';

function Dashboard(props) {
  const [bookings, setBookings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const { changeMenu } = useMenu();

  async function fetchBookings() {
    try {
      const data = await axiosConfig.get('/bookings');

      if (data.statusText == 'OK') {
        const formattedBookings = formatBookings(data.data);

        setBookings(formattedBookings);
      }
    } catch (err) {
      console.log('errored out on fetching bookings')
      console.log(err)
    }
  }

  // !!! Very similar to fetch bookings maybe combine?
  async function fetchPatients() {
    try {
      const data = await axiosConfig.get('/patients');

      if (data.statusText == 'OK') {
        const formattedPatients = formatPatients(data.data);

        setPatients(formattedPatients);
      }
    } catch (err) {
      console.log('errored out on patient fetching');
      console.log(err)
    }
  }

  // !!! Very similar to fetch bookings/patients maybe combine?
  async function fetchDoctors() {
    try {
      const data = await axiosConfig.get('user/doctors');

      if (data.statusText == 'OK') {
        setDoctors(data.data);
      }
    } catch (err) {
      console.log('errored out on doctors fetching');
      console.log(err)
    }
  }

  function formatPatients(patients) {
    return patients.map((patient) => {
      return {
        uuid: patient.uuid,
        companyId: patient.companyId,
        firstname: patient.firstname,
        lastname: patient.lastname,
        email: patient.email,
        phone: patient.phone,
      };
    });
  }

  function formatBookings(bookings) {
    return bookings.map((booking) => {
      const bookingData = {
        id: booking.id,
        title: booking.title,
        extendedProps: {
          notes: booking.notes,
          isCompleted: booking.isCompleted,
        }
      }

      if (booking.startTime) {
        bookingData.start = `${booking.date}T${booking.startTime}`;
      } else {
        bookingData.start = booking.date;
        bookingData.allDay = true;
      }

      if (booking.endTime) {
        bookingData.end = `${booking.date}T${booking.endTime}`;
      }

      return bookingData;
    });
  }

  useEffect(() => {
    changeMenu(props.menuType);
    fetchBookings();
    fetchPatients();
    fetchDoctors();
  }, []);

  return (
    <Grid container
      sx={{
        display: 'flex',
        marginTop: '2em',
        marginBottom: '2em',
      }}
    >
      <Grid item xs={3}>
        {
          doctors.map(doctor => {
            return <div>{`${doctor.firstname} ${doctor.lastname}`}</div>;
          })
        }
      </Grid>
      <Grid item xs={9}>
        <Calendar
          bookings={bookings}
          patients={patients}
          doctors={doctors}
          fetchBookings={fetchBookings}
        />
      </Grid>
    </Grid>
  );
}

export async function getServerSideProps(ctx) {
  const userData = decodeCookie(ctx);

  return {
    props: {
      menuType: userData.usertype,
    }
  }
}

export default Dashboard;