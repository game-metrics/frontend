import Home from "../pages/Home/Home";
import SignIn from "../pages/Login/SignIn";
import KakaoCallback from "../pages/Login/OAuth/Kakao";
import GoogleCallback from "../pages/Login/OAuth/Google";
import Profile from "../pages/Profile/Profile";
import SignUp from "../pages/Login/SignUp";
import BroadCast from "../pages/broadcast/Broadcast";
import Stream from "../pages/broadcast/StreamPage";
import BroadcastSetup from "../pages/broadcast/StreamSetup";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/broadcast", element: <BroadCast /> },
  { path: "/stream", element: <Stream /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-in/kakao", element: <KakaoCallback /> },
  { path: "/sign-in/google", element: <GoogleCallback /> },
  { path: "/broadcast-setup", element: <BroadcastSetup /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/profile", element: <Profile /> },
];

export default routes;
