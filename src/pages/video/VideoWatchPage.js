// 비디오 보는 페이지 인데 
// param 에서 videoid 를 가져옴.
// 중앙에는 비디오
// 오른 쪽에는 video list 
// 아래는 댓글창?
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VideoWatchPage = () => {
  const { videoId } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    // S3에서 비디오 URL 설정
    const s3BaseUrl = "https://your-bucket.s3.amazonaws.com/";
    setVideoUrl(`${s3BaseUrl}${videoId}.mp4`);

    // 추천 영상 리스트 (샘플)
    setVideoList([
      { id: "video1", title: "다음 영상 1" },
      { id: "video2", title: "다음 영상 2" },
      { id: "video3", title: "다음 영상 3" },
    ]);
  }, [videoId]);

  return (
    <div className="flex h-screen">
      {/* 중앙 비디오 */}
      <div className="flex-1 p-4">
        <video controls className="w-full h-full rounded-xl shadow-lg object-contain">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* 오른쪽 추천 영상 리스트 */}
      <div className="w-1/4 p-4 border-l overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">추천 영상</h2>
        <ul className="space-y-3">
          {videoList.map((video) => (
            <li key={video.id}>
              <a
                href={`/watch/${video.id}`}
                className="text-blue-600 hover:underline block"
              >
                {video.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoWatchPage;
