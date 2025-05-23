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
import { FaRegHeart, FaHeart, FaTrash } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";

const TweetList = ({ currentUser }) => {
  const [tweets, setTweets] = useState([]);
  const [comments, setComments] = useState({});
  const [openLikesTweetId, setOpenLikesTweetId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

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

  const confirmAction = (action) => {
    setModalAction(() => () => {
      action();
      setShowModal(false);
    });
    setShowModal(true);
  };

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

  const handleDeleteTweet = (tweetId) => {
    confirmAction(() => deleteDoc(doc(db, "tweets", tweetId)));
  };

  const handleDeleteComment = (tweetId, comment) => {
    confirmAction(() =>
      updateDoc(doc(db, "tweets", tweetId), {
        comments: arrayRemove(comment),
      })
    );
  };

  const toggleLikesList = (tweetId) => {
    setOpenLikesTweetId((prevId) => (prevId === tweetId ? null : tweetId));
  };

  return (
    <div className="space-y-6">
      {tweets.map((tweet) => {
        const hasLiked = tweet.likedBy?.includes(currentUser.email);

        return (
          <div
            key={tweet.id}
            className="bg-[#1d1f23] p-4 rounded-xl shadow-lg border border-[#333] transition-all"
          >
            {/* Author */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">@{tweet.author}</span>
              {tweet.author === currentUser.email && (
                <button
                  onClick={() => handleDeleteTweet(tweet.id)}
                  className="text-red-400 hover:text-red-200 transition"
                  title="Delete Tweet"
                >
                  <FaTrash />
                </button>
              )}
            </div>

            {/* Tweet content */}
            <p className="text-white text-base mb-3">{tweet.text}</p>

            {/* Tweet Image */}
            {tweet.imageUrl && typeof tweet.imageUrl === "string" && (
              <img
                src={tweet.imageUrl}
                alt="Tweet Image"
                className="mt-3 rounded-lg max-h-60 object-cover w-full"
              />
            )}

            {/* Likes */}
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => handleLike(tweet)}>
                {hasLiked ? (
                  <FaHeart className="text-[#E1306C] text-xl" />
                ) : (
                  <FaRegHeart className="text-white text-xl hover:text-[#E1306C] transition" />
                )}
              </button>
              <span className="text-gray-300 text-sm">
                {tweet.likes > 0
                  ? `${tweet.likes} like${tweet.likes > 1 ? "s" : ""}`
                  : "No likes yet"}
              </span>
              {tweet.likes > 0 && (
                <button
                  onClick={() => toggleLikesList(tweet.id)}
                  className="text-xs text-gray-400 hover:text-white ml-2"
                >
                  {openLikesTweetId === tweet.id ? "Hide likes" : "View likes"}
                </button>
              )}
            </div>

            {/* Likes list */}
            {openLikesTweetId === tweet.id && (
              <div className="bg-[#2a2d33] p-2 rounded-md mt-1 text-sm text-gray-300">
                <p className="mb-1 text-white font-medium">Liked by:</p>
                <ul className="list-disc list-inside space-y-1">
                  {(tweet.likedBy || []).map((user, idx) => (
                    <li key={idx}>{user}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Comments */}
            <div className="space-y-2 text-sm text-gray-300 mt-3">
              {(tweet.comments || []).map((c, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-[#2a2d33] p-2 rounded-lg"
                >
                  <p>
                    <span className="font-semibold text-white">{c.author}</span>{" "}
                    <span>{c.text}</span>
                  </p>
                  {c.author === currentUser.email && (
                    <button
                      onClick={() => handleDeleteComment(tweet.id, c)}
                      className="text-red-400 hover:text-red-200 transition ml-3"
                      title="Delete Comment"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-grow rounded-md px-3 py-2 bg-[#22252a] text-white focus:outline-none"
                  value={comments[tweet.id] || ""}
                  onChange={(e) => handleCommentChange(tweet.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddComment(tweet.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleAddComment(tweet.id)}
                  className="bg-[#1d9bf0] hover:bg-[#1a8cd8] rounded-md px-3 py-2 font-semibold transition text-white"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Confirmation modal */}
      {showModal && (
        <ConfirmationModal
          onConfirm={() => modalAction()}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TweetList;
