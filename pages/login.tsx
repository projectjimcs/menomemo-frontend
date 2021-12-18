import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import axiosConfig from '../axiosConfig'
import Alert from '@mui/material/Alert';

function LoginPage() {
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [invalidLoginError, setInvalidLoginError] = useState(false);

  function handleFieldChange({ target }) {
    if (!target.value) {
      if (target.name === 'email') {
        setEmailError(true);
        setEmailErrorMessage('Email must not be empty');
      }
    } else {
      if (target.name === 'email') {
        setEmailError(false);
        setEmailErrorMessage('');
      } else {
        setPasswordError(false);
        setPasswordErrorMessage('');
      }

      setState({
        ...state,
        [target.name]: target.value,
      });
    }
  }

  function handleLogin(event) {
    event.preventDefault();

    axiosConfig.post('/login', {
      email: state.email,
      password: state.password,
    }).then((response) => {
      console.log(response)
    }).catch((err) => {
      setInvalidLoginError(true);
    })
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        }}
        noValidate
        autoComplete="off"
      >
        {
          invalidLoginError && 
          <Alert severity="error" style={{marginBottom: 5}}>Invalid Credentials - Please Try Again</Alert>
        }
        <div>
          <TextField
            required
            id="outlined-required"
            name="email"
            label="Email"
            error={emailError}
            helperText={emailErrorMessage}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <TextField
            required
            id="outlined-password-input"
            label="Password"
            type="password"
            name="password"
            error={passwordError}
            helperText={passwordErrorMessage}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <Button type="submit" variant="contained" onClick={handleLogin}>Login</Button>
        </div>
      </Box>
    </Container>
  )
}

export default LoginPage;