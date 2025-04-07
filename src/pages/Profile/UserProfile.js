import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import noimage from "../../images/no-image-icon-23485.png";
import userIcon from "../../images/user.png";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const UserProfile = () => {
    const { username } = useParams();

    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [streams, setStreams] = useState([]);

    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            try {
                const userRes = await fetch(`${API_BASE_URL}/users/${username}`);
                const userData = await userRes.json();
                setProfile(userData.data);

                const streamRes = await fetch(`${API_BASE_URL}/broadcasts/${username}`);
                const streamData = await streamRes.json();
                setStreams(streamData.data.content || []);

                const videoRes = await fetch(`${API_BASE_URL}/videos/profile/${username}`);
                const videoData = await videoRes.json();
                setVideos(videoData.data.content || []);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, [username]);

    return (
        <div>
            {profile && (
                <div>
                    <h1>Email</h1>
                    <p>{profile.email}</p>
                    <h2>Username</h2>
                    <p>{profile.nickname}</p>
                    <h2>Profile Image</h2>
                    <img
                        src={profile.profileImage || userIcon}
                        alt="Profile"
                        width={150}
                    />
                </div>
            )}

            <h2>Passed Streams</h2>
            {streams.length > 0 ? (
                <ul>
                    {streams.map((stream, index) => (
                        <li key={index}>
                            <h4>{stream.title}</h4>
                            <img
                                src={stream.thumbNailUrl || noimage}
                                alt="Stream Thumbnail"
                                width={120}
                            />
                            <p>Category: {stream.categoryId}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No live streams found.</p>
            )}

            <h2>Videos</h2>
            {videos.length > 0 ? (
                <ul>
                    {videos.map((video, index) => (
                        <li key={index}>
                            <h4>{video.title}</h4>
                            <img
                                src={video.thumbNailUrl || noimage}
                                alt="Video Thumbnail"
                                width={120}
                            />
                            <p>Category: {video.categoryId}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No videos found.</p>
            )}
        </div>
    );
};

export default UserProfile;
