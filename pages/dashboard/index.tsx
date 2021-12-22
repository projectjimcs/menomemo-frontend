import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import Calendar from '../../components/Calendar';
import { useMenu } from '../../contexts/MenuContext';
import decodeCookie from '../../helpers/decodeCookie';
import axiosConfig from '../../axiosConfig';

function Dashboard(props) {
  const [bookings, setBookings] = useState([]);
  const { changeMenu } = useMenu();

  async function fetchBookings() {
    try {
      const data = await axiosConfig.get('/bookings');

      if (data.statusText == 'OK') {
        const formattedBookings = formatBookings(data.data);

        setBookings(formattedBookings);
      }
    } catch (err) {
      console.log('errored out')
      console.log(err)
    }
  }

  function formatBookings(bookings) {
    return bookings.map((booking) => {
      const bookingData = {
        id: booking.id.toString(),
        title: booking.title,
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
        Small
      </Grid>
      <Grid item xs={9}>
        <Calendar
          bookings={bookings}
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