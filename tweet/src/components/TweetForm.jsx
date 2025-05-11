import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const TweetForm = ({ currentUser }) => {
  const [tweet, setTweet] = useState("");

  const handlePostTweet = async () => {
    if (!tweet.trim()) return;

    try {
      await addDoc(collection(db, "tweets"), {
        text: tweet,
        author: currentUser.email,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
      });

      setTweet("");
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#16181c] p-6 rounded-2xl shadow-xl text-white">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Write your post
      </label>
      <textarea
        rows="4"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="What’s happening?"
        className="w-full px-4 py-3 bg-transparent border border-[#2f3336] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] placeholder-gray-500 resize-none"
      />
      <button
        onClick={handlePostTweet}
        className="mt-4 w-full bg-[#1d9bf0] py-2 rounded-md hover:bg-[#1a8cd8] transition font-medium"
      >
        Post Tweet
      </button>
    </div>
  );
};

export default TweetForm;
