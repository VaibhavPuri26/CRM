 ##  YouTube Video Fetcher (MERN Stack)

This project allows users to search for YouTube videos, view video details like views, likes, comments, and channel information. The backend fetches the video data from YouTube API and stores it in a MongoDB database. The frontend allows users to search for videos and view the fetched data.
Tech Stack

    Frontend: React
    Backend: Node.js, Express
    Database: MongoDB
    Deployment:
        Backend: Render
        Frontend: Vercel

## Prerequisites

Before you start, ensure you have the following installed:

    Node.js (v14 or higher)
    npm (Node Package Manager)
    MongoDB (For local development if not using Render's cloud database)

## Setup Instructions
1. Clone the GitHub Repository

Clone the project repository to your local machine:

## git clone https://github.com/VaibhavPuri26/<repo-name>.git

## Create an .env file
YOUTUBE_API_KEY=AIzaSyDf7WqL5alto4lzZy8xggiNea4QbAmMhX8
MONGODB_URI=mongodb+srv://VaibhavPuri:Vaibhav1905@ems.fdbge2f.mongodb.net/expenseapp


## Backend File is 
Server.js
To run the backend 
## Run command "node server.js"

## To run Frontend 
Run command "npm run start"

## To run Locally , Do this in app.js "Fetch videos function"
const response = await axios.get("http://localhost:5000/api/videos", {
  params: { query },
});

## Deployment

    The backend is deployed on Render, and you can access it at: https://crm-4-j371.onrender.com.
    The frontend is deployed on Vercel.

## Troubleshooting

    If you encounter any issues with CORS, ensure your backend allows requests from the frontend domain.
    Make sure MongoDB is running, or use the cloud MongoDB connection.

