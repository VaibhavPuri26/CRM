import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/api/videos", {
        params: { query },
      });
      console.log(response.data);
      setVideos(response.data);
    } catch (error) {
      setError("Error fetching videos. Please try again.");
      console.error("Error fetching videos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>YouTube Video Fetcher</h1>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for videos"
        />
        <button onClick={fetchVideos}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="video-list">
        {videos.map((video) => (
          <div key={video.videoId} className="video-card">
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
              alt={video.title || "Video Thumbnail"}
              className="video-thumbnail"
            />
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="video-title"
            >
              {video.title || "Untitled Video"}
            </a>
            <p className="video-description">
              {video.description || "No description available."}
            </p>
            <p className="video-stats">
              <strong>Likes:</strong> {video.likes || 0} |{" "}
              <strong>Views:</strong> {video.views || 0}
            </p>
            <p className="channel-info">
              <strong>Channel:</strong> {video.channelTitle || "Unknown"} |{" "}
              <strong>Subscribers:</strong> {video.channelSubscribers || 0}
            </p>
           
            <div className="comments-section">
              <h4>Top Comments:</h4>
              <ul>
                {Array.isArray(video.comments) && video.comments.length > 0 ? (
                  video.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))
                ) : (
                  <li>No comments available.</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
