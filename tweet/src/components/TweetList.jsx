import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

const TweetList = ({ currentUser }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "tweets"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tweetsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (tweet) => {
    const tweetRef = doc(db, "tweets", tweet.id);
    const hasLiked = tweet.likedBy?.includes(currentUser.email);

    const updatedLikes = hasLiked
      ? tweet.likedBy.filter((email) => email !== currentUser.email)
      : [...(tweet.likedBy || []), currentUser.email];

    await updateDoc(tweetRef, {
      likedBy: updatedLikes,
      likes: updatedLikes.length,
    });
  };

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="bg-[#1d1f23] p-4 rounded-xl">
          <p className="text-white">{tweet.text}</p>
          <div className="mt-2 text-sm text-gray-400 flex justify-between items-center">
            <span>By: {tweet.author}</span>
            <button
              onClick={() => handleLike(tweet)}
              className={`text-sm px-2 py-1 rounded transition ${
                tweet.likedBy?.includes(currentUser.email)
                  ? "text-[#1DA1F2]"
                  : "text-gray-400"
              } hover:text-[#1DA1F2] focus:outline-none active:scale-95`}
            >
              ❤️ {tweet.likes || 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TweetList;
