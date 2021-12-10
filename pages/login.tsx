import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function LoginPage() {
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
        <div>
          <TextField
            required
            id="outlined-required"
            label="Email"
          />
        </div>
        <div>
          <TextField
            required
            id="outlined-password-input"
            label="Password"
            type="password"
          />
        </div>
        <div>
          <Button variant="contained">Login</Button>
        </div>
      </Box>
    </Container>
  )
}

export default LoginPage;