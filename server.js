const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


const VideoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  description: String,
  likes: Number,
  views: Number,
  comments: Array,
  channelTitle: String,
  channelSubscribers: Number,
});
const Video = mongoose.model("Video", VideoSchema);


app.get("/api/videos", async (req, res) => {
  const { query } = req.query;
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const SEARCH_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}`;

  try {
 
    const searchResponse = await axios.get(SEARCH_URL);
    const videoIds = searchResponse.data.items.map((item) => item.id.videoId).join(",");

    
    const VIDEO_STATS_URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
    const videoStatsResponse = await axios.get(VIDEO_STATS_URL);

  
    const channelIds = videoStatsResponse.data.items.map((item) => item.snippet.channelId).join(",");
    const CHANNEL_INFO_URL = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${API_KEY}`;
    const channelInfoResponse = await axios.get(CHANNEL_INFO_URL);

    const videoData = await Promise.all(searchResponse.data.items.map(async (item) => {
      const videoStats = videoStatsResponse.data.items.find((video) => video.id === item.id.videoId);
      const channelInfo = channelInfoResponse.data.items.find((channel) => channel.id === item.snippet.channelId);

     
      const COMMENTS_URL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${item.id.videoId}&key=${API_KEY}`;
      const commentsResponse = await axios.get(COMMENTS_URL);

      const comments = commentsResponse.data.items.map((commentItem) => commentItem.snippet.topLevelComment.snippet.textDisplay);

      return {
        videoId: item.id.videoId,
        title: item.snippet.title || "No Title",
        description: item.snippet.description || "No Description",
        likes: parseInt(videoStats?.statistics?.likeCount || 0, 10),
        views: parseInt(videoStats?.statistics?.viewCount || 0, 10),
        comments: comments, 
        channelTitle: item.snippet.channelTitle || "Unknown",
        channelSubscribers: parseInt(channelInfo?.statistics?.subscriberCount || 0, 10),
      };
    }));

  
    await Video.insertMany(videoData);
    res.json(videoData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error fetching data");
  }
});


app.get("/api/stored-videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error("Error retrieving stored videos:", error.message);
    res.status(500).send("Error retrieving stored videos");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
