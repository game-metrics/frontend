import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import ForgotPassword from "./ForgotPassword";
import { GoogleIcon} from "./CustomIcons";
import logo from "../../images/logo1.png";
import "./css/SignIn.css"; // CSS file
import { useNavigate } from "react-router-dom"; // useNavigate
import { signIn } from '../../api/auth/authAPI'; 

export default function SignIn() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  // OAUTH2.0
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  
  const navigate = useNavigate();

  // 쿠키 가져오기기
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // auth 쿠치가 있으면 홉페이지로 이동동
  React.useEffect(() => {
    const authToken = getCookie("auth");
    if (authToken) {
      console.log("Auth token exists, redirecting to main page.");
      navigate("/"); // Redirect to the main page
    }
  }, [navigate]);

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
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const response = await signIn(userDetails); // Call the service function
      alert("Sign-in successful!");
      setCookie("auth", response.token, 1); // Set auth cookie
      
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error:", error);
      alert("Sign-in failed. Please try again.");
    }
  };

  // Validate inputs 입력 validation
  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  // Set a cookie with expiration 쿠키 만들기기
  const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // 카카오 로그인
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`;
    window.location.href = kakaoAuthUrl;
  };
  const handleGoogleLogin = () => {
    const kakaoAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/sign-in/google&response_type=code&scope=email profile`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div style={{ margin: "auto" }}>
      <Stack className="signin-container">
        <MuiCard className="signin-card" variant="outlined">
          <img src={logo} alt="GameMetric Logo" className="signin-logo" />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
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
                color={emailError ? "error" : "primary"}
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
                color={passwordError ? "error" : "primary"}
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
              sx={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box className="signin-buttons">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleGoogleLogin()}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleKakaoLogin()}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
                alt="KakaoTalk Logo"
                style={{ width: "20px", marginRight: "12px" }}
              />
              Sign in with Kakao
            </Button>
            <Typography className="signin-footer">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" variant="body2" sx={{ alignSelf: "center" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </MuiCard>
      </Stack>

      {/* <a 
  // href="https://accounts.google.com/o/oauth2/v2/auth?client_id=175362941207-5utd0bap67slhe4o8511qjcacetb92fe.apps.googleusercontent.com&redirect_uri=http://localhost:3000/sign-in/google&response_type=code&scope=email profile">
  구글 로그인
</a> */}

    </div> 
  );
}
