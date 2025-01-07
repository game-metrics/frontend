import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import logo from '../../images/logo1.png';
import './SignIn.css';  // CSS file
import { useNavigate } from 'react-router-dom'; // useNavigate
import { signIn } from '../../api/auth/authAPI'; // axios function

export default function SignIn() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);

    const userDetails = {
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      const response = await signIn(userDetails); // Call the service function
      console.log('Response:', response);
      alert('Sign-in successful!');
      navigate('/'); // 성공시 홈페이지로로
    } catch (error) {
      console.error('Error:', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  // validation 
  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

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

    return isValid;
  };

  //
  

  return (
    <div style={{ margin: 'auto'}}>
    <Stack className="signin-container">
      <MuiCard className="signin-card" variant="outlined">
        <img
          src={logo}
          alt="GameMetric Logo"
          className="signin-logo"
        />
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          className="signin-form"
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <ForgotPassword open={open} handleClose={handleClose} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Sign in
          </Button>
          <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Forgot your password?
          </Link>
        </Box>
        <Divider>or</Divider>
        <Box className="signin-buttons">
          {/* 구글버튼 */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with Google')}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>

          {/* 페북버튼 */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with Facebook')}
            startIcon={<FacebookIcon />}
          >
            Sign in with Facebook
          </Button>

          {/* 카카오 버튼 */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with kakao')}
          >
          <img 
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
          style={{width:'20px',marginRight:'12px'}}
          />
            Sign in with kakao
          </Button>
          
          <Typography className="signin-footer">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </MuiCard>
    </Stack>
    </div>
  );
}
