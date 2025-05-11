import React, { useState } from 'react';

function Feed() {
  const [tweet, setTweet] = useState(""); 
  const [tweets, setTweets] = useState([]); 

  const handlePostTweet = () => {
    if (tweet.trim()) { 
      setTweets([tweet, ...tweets]); 
      setTweet(""); 
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#16181c] p-8 rounded-2xl shadow-xl">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Write your post
        </label>
        <textarea
          name="message"
          rows="5"
          required
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="What’s happening?"
          className="w-full px-4 py-3 bg-transparent text-white border border-[#2f3336] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] placeholder-gray-500 resize-none"
        ></textarea>
      </div>
      <button
        type="submit"
        onClick={handlePostTweet}
        className="block bg-[#1d9bf0] w-[150px] rounded-md font-medium my-6 mx-auto py-3 text-white hover:bg-[#1a8cd8] hover:scale-105 transition duration-300"
      >
        Post Tweet
      </button>


      <div className="w-full max-w-2xl mt-4">
        {tweets.map((tweet, index) => (
          <div
            key={index}
            className="bg-[#1d1f23] p-4 rounded-xl mb-4 text-white"
          >
            {tweet}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
