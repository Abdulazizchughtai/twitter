// Feed.jsx
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import api from "../api/axios";
import TweetForm from "./TweetForm";
import TweetList from "./TweetList";

const Feed = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.email) {
          setCurrentUser({ email: decoded.email });
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Invalid JWT:", err);
        setCurrentUser(null);
      }
    }
  }, []);

  const fetchTweets = async () => {
    try {
      const res = await api.get("/tweets");
      setTweets(res.data);
    } catch (err) {
      console.error("Error fetching tweets:", err);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  if (!currentUser?.email) {
    return <div className="text-white p-4">Loading user info...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <TweetForm currentUser={currentUser} onTweetPosted={fetchTweets} />
      <TweetList currentUser={currentUser} tweets={tweets} onRefresh={fetchTweets} />
    </div>
  );
};

export default Feed;
