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

        fetch(`${API_BASE_URL}/users/search?name=${username}`)
            .then(res => res.json())
            .then(data => setProfile(data));
        
        fetch(`${API_BASE_URL}/broadcasts/${username}`)
            .then(res => res.json())
            .then(data => setStreams(data));

        fetch(`${API_BASE_URL}/videos/profile/${username}`)
            .then(res => res.json())
            .then(data => setVideos(data));

            console.log(profile,videos,streams);
    }, [username]);

    return (
        <div>
            {profile && (
                <div>
                    <h1>{profile.email} (@{username})</h1>
                    <p>{profile.email}</p>
                </div>
            )}
            <h2>Live Streams</h2>

            <h2>Videos</h2>
         
        </div>
    );
};

export default UserProfile;
