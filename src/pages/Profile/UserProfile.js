import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const UserProfile = () => {
    const { username } = useParams(); // URL 경로에서 username 가져오기

    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [streams, setStreams] = useState([]);

    useEffect(() => {
        if (!username) return;

        fetch(`${API_BASE_URL}/users/${username}`)
            .then(res => res.json())
            .then(data => setProfile(data.data));

        fetch(`${API_BASE_URL}/broadcasts/${username}`)
            .then(res => res.json())
            .then(data => setStreams(data.data.content));

        fetch(`${API_BASE_URL}/videos/profile/${username}`)
            .then(res => res.json())
            .then(data => setVideos(data.data.content));

            console.log(profile);
            console.log(streams);
            console.log(videos);
    }, [username]);

    return (
        <div>
            {profile && (
                <div>
                    <h1>이메일</h1>
                    <p>{profile.email}</p>
                </div>
            )}

            <h2>Passed Streams</h2>
            {streams.length > 0 ? (
                <ul>
                    {streams.map((stream, index) => (
                        <li key={index}>
                            <h4>{stream.title}</h4>
                            {/* <p>{stream.description}</p> */}
                            {/* Add other stream properties as needed */}
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
                            {/* <p>{video.description}</p> */}
                            {/* Add other video properties as needed */}
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
