import Home from "../pages/Home/Home";
import SignIn from "../pages/Login/SignIn";
import KakaoCallback from "../pages/Login/OAuth/Kakao";
import GoogleCallback from "../pages/Login/OAuth/Google";
import Profile from "../pages/Profile/Profile";
import SignUp from "../pages/Login/SignUp";
import Broadcast from "../pages/broadcast/Broadcast";
import StreamerPage from "../pages/broadcast/StreamPage";
import BroadcastSetup from "../pages/broadcast/StreamSetup";
import VideoWatchPage from "../pages/video/VideoWatchPage";
import UploadVideo from "../pages/video/UpLoadVideoPage";
import SearchResults from "../pages/search/Search"; 

const routes = [
  { path: "/", element: <Home /> },
  { path: "/broadcast", element: <Broadcast /> },
  { path: "/stream", element: <StreamerPage /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-in/kakao", element: <KakaoCallback /> },
  { path: "/sign-in/google", element: <GoogleCallback /> },
  { path: "/broadcast-setup", element: <BroadcastSetup /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/profile", element: <Profile /> },
  { path: "/watch", element: <VideoWatchPage /> },
  { path: "/upload-video", element: <UploadVideo /> },
  { path: "/search",element: <SearchResults/>}
];

export default routes;
