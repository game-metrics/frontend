import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import { signUp } from '../../api/auth/authAPI'; // axios function
import logo from '../../images/logo1.png';
import { useNavigate } from 'react-router-dom'; // useNavigate
import './SignUp.css'; // custom CSS 

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '90%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '100%',
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '90%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  backgroundColor: 'white',
}));

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const navigate = useNavigate(); 

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const name = document.getElementById('name');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);

    const userDetails = {
      nickname: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      const response = await signUp(userDetails); // Call the service function
      console.log('Response:', response);
      alert('Sign-up successful!');
      navigate('/sign-in'); // 성공시 로그인 페이지로
    } catch (error) {
      console.error('Error:', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  return (
    <div style={{ margin: 'auto' }}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between" className="signup-container">
        <Card variant="outlined" className="signup-card">
          <img src={logo} alt="GameMetric Logo" className="signup-logo" />
          <Typography component="h1" variant="h4">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                error={emailError}
                helperText={emailErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                error={passwordError}
                helperText={passwordErrorMessage}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography>or</Typography>
          </Divider>
          <Box>
            <Button fullWidth variant="outlined">Sign up with Google</Button>
            <Button fullWidth variant="outlined">Sign up with Facebook</Button>
          </Box>
          <Typography>
            Already have an account?{' '}
            <Link href="/sign-in">Sign in</Link>
          </Typography>
        </Card>
      </SignUpContainer>
    </div>
  );
}
