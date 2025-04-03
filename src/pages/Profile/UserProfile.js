import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const UserProfile = () => {
    const { username } = useParams(); // URL 경로에서 username 가져오기

    const [profile, setProfile] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [videos, setVideos] = useState([]);
    const [streams, setStreams] = useState([]);

    useEffect(() => {
        if (!username) return;

        fetch(`${API_BASE_URL}/api/profile/${username}`)
            .then(res => res.json())
            .then(data => setProfile(data));

        fetch(`${API_BASE_URL}/api/followers/${username}`)
            .then(res => res.json())
            .then(data => setFollowers(data));

        fetch(`${API_BASE_URL}/api/streams/${username}`)
            .then(res => res.json())
            .then(data => setStreams(data));

        fetch(`${API_BASE_URL}/api/videos/${username}`)
            .then(res => res.json())
            .then(data => setVideos(data));
    }, [username]);

    return (
        <div>
            {profile && (
                <div>
                    <h1>{profile.name} (@{username})</h1>
                    <p>{profile.bio}</p>
                </div>
            )}
            <h2>Followers ({followers.length})</h2>
            <ul>
                {followers.map(follower => (
                    <li key={follower.id}>{follower.name}</li>
                ))}
            </ul>
            <h2>Live Streams</h2>
            <ul>
                {streams.map(stream => (
                    <li key={stream.id}>{stream.title}</li>
                ))}
            </ul>
            <h2>Videos</h2>
            <ul>
                {videos.map(video => (
                    <li key={video.id}>
                        <button onClick={() => window.open(video.url, "_blank")}>{video.title}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserProfile;
