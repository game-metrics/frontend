import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import noimage from "../../images/no-image-icon-23485.png";
import userIcon from "../../images/user.png";
import "./css/UserProfile.css";

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
        <div className="user-profile">
            {/* User Info */}
            {profile && (
                <div className="profile-card">
                    <img
                        src={profile.profileImage || userIcon}
                        alt="Profile"
                    />
                    <div className="profile-info">
                        <h2>{profile.nickname}</h2>
                        <p>{profile.email}</p>
                    </div>
                </div>
            )}

            {/* Streams */}
            <div className="section">
                <h2 className="section-title">Past Streams</h2>
                {streams.length > 0 ? (
                    <div className="card-list">
                        {streams.map((stream, index) => (
                            <div key={index} className="card">
                                <img
                                    src={stream.thumbNailUrl || noimage}
                                    alt="Stream Thumbnail"
                                />
                                <h4>{stream.title}</h4>
                                <p>Category: {stream.categoryId}</p>
                                <p>Created At: {stream.createdAt}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No streams are found.</p>
                )}
            </div>

            {/* Videos */}
            <div className="section">
                <h2 className="section-title">Videos</h2>
                {videos.length > 0 ? (
                    <div className="card-list">
                        {videos.map((video, index) => (
                            <div key={index} className="card">
                                <img
                                    src={video.thumbNailUrl || noimage}
                                    alt="Video Thumbnail"
                                />
                                <h4>{video.title}</h4>
                                <p>Created At: {video.createdAt}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No videos found.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
