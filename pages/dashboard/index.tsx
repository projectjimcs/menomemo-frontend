import Grid from '@mui/material/Grid';
import { useEffect } from 'react';
import Calendar from '../../components/Calendar';
import { useMenu } from '../../contexts/MenuContext';
import decodeCookie from '../../helpers/decodeCookie';

function Dashboard(props) {
  const { changeMenu } = useMenu();

  useEffect(() => {
    changeMenu(props.menuType);
  }, []);

  return (
    <Grid container
      sx={{
        display: 'flex',
        marginTop: '2em',
      }}
    >
      <Grid item xs={3}>
        Small
      </Grid>
      <Grid item xs={9}>
        <Calendar />
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