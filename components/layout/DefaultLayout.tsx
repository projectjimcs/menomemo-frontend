import classes from './DefaultLayout.module.css';
import MainNavigation from '../navigation/MainNavigation';
import Container from '@mui/material/Container';

function DefaultLayout(props) {
    return (
        <div>
            <MainNavigation />
            <Container maxWidth={false}>{props.children}</Container>
        </div>
    );
}

export default DefaultLayout;