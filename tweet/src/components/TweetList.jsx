import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";

const TweetList = ({ currentUser }) => {
  const [tweets, setTweets] = useState([]);
  const [comments, setComments] = useState({});
  const [openLikesTweetId, setOpenLikesTweetId] = useState(null); 

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

  const handleCommentChange = (tweetId, value) => {
    setComments((prev) => ({ ...prev, [tweetId]: value }));
  };

  const handleAddComment = async (tweetId) => {
    const comment = comments[tweetId]?.trim();
    if (!comment) return;

    const tweetRef = doc(db, "tweets", tweetId);
    await updateDoc(tweetRef, {
      comments: arrayUnion({
        text: comment,
        author: currentUser.email,
        createdAt: new Date().toISOString(),
      }),
    });

    setComments((prev) => ({ ...prev, [tweetId]: "" }));
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this tweet?");
      if (!confirm) return;

      const tweetRef = doc(db, "tweets", tweetId);
      await deleteDoc(tweetRef);
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  const handleDeleteComment = async (tweetId, comment) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this comment?");
      if (!confirm) return;

      const tweetRef = doc(db, "tweets", tweetId);
      await updateDoc(tweetRef, {
        comments: arrayRemove(comment),
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleLikesList = (tweetId) => {
    setOpenLikesTweetId((prevId) => (prevId === tweetId ? null : tweetId));
  };

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="bg-[#1d1f23] p-4 rounded-xl relative">
          <p className="text-white">{tweet.text}</p>

          {tweet.author === currentUser.email && (
            <button
              onClick={() => handleDeleteTweet(tweet.id)}
              className="absolute top-2 right-2 text-red-500 text-xs hover:text-red-400"
              title="Delete Tweet"
            >
              🗑 Delete
            </button>
          )}

          <div className="mt-2 text-sm text-gray-400 flex justify-between items-center">
            <span>By: {tweet.author}</span>
            <div className="flex items-center space-x-2">
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
              <button
                onClick={() => toggleLikesList(tweet.id)}
                className="text-xs text-gray-400 hover:text-white"
              >
                {openLikesTweetId === tweet.id ? "Hide likes" : "View likes"}
              </button>
            </div>
          </div>

          {openLikesTweetId === tweet.id && (
            <div className="mt-2 text-xs text-gray-300 bg-[#2a2d33] p-2 rounded border border-gray-600">
              <p className="mb-1 font-semibold">Liked by:</p>
              {tweet.likedBy && tweet.likedBy.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {tweet.likedBy.map((user, idx) => (
                    <li key={idx}>{user}</li>
                  ))}
                </ul>
              ) : (
                <p>No likes yet.</p>
              )}
            </div>
          )}

          <div className="mt-3 space-y-1 text-sm text-gray-300">
            {(tweet.comments || []).map((c, idx) => (
              <div
                key={idx}
                className="border-l-4 pl-3 border-[#1d9bf0] flex justify-between items-center"
              >
                <p>
                  <strong>{c.author}</strong>: {c.text}
                </p>
                {c.author === currentUser.email && (
                  <button
                    onClick={() => handleDeleteComment(tweet.id, c)}
                    className="text-red-500 text-xs hover:text-red-400 ml-2"
                    title="Delete Comment"
                  >
                    🗑
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comments[tweet.id] || ""}
              onChange={(e) => handleCommentChange(tweet.id, e.target.value)}
              className="flex-1 px-3 py-1 rounded bg-[#2a2d33] border border-gray-600 text-white text-sm focus:outline-none"
            />
            <button
              onClick={() => handleAddComment(tweet.id)}
              className="bg-[#1d9bf0] px-3 py-1 rounded text-sm hover:bg-[#1a8cd8]"
            >
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TweetList;
