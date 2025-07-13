import { useState } from "react";
import { FaRegHeart, FaHeart, FaTrash } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";
import api from "../api/axios";

const TweetList = ({ currentUser, tweets, onRefresh }) => {
  const [comments, setComments] = useState({});
  const [openLikesTweetId, setOpenLikesTweetId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const confirmAction = (action) => {
    setModalAction(() => () => {
      action();
      setShowModal(false);
    });
    setShowModal(true);
  };

  const handleLike = async (tweet) => {
    if (!currentUser?.email) return;

    try {
      await api.put(`/tweets/${tweet._id}/like`, {
        email: currentUser.email,
      });
      onRefresh();
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleAddComment = async (tweetId) => {
    const comment = comments[tweetId]?.trim();
    if (!comment || !currentUser?.email) return;

    try {
      await api.put(`/tweets/${tweetId}/comment`, {
        text: comment,
        author: currentUser.email,
      });
      setComments((prev) => ({ ...prev, [tweetId]: "" }));
      onRefresh();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    confirmAction(async () => {
      try {
        await api.delete(`/tweets/${tweetId}`);
        onRefresh();
      } catch (err) {
        console.error("Error deleting tweet:", err);
      }
    });
  };

  const handleDeleteComment = async (tweetId, comment) => {
    confirmAction(async () => {
      try {
        await api.put(`/tweets/${tweetId}/comment/delete`, {
          text: comment.text,
          author: comment.author,
        });
        onRefresh();
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    });
  };

  const handleCommentChange = (tweetId, value) => {
    setComments((prev) => ({ ...prev, [tweetId]: value }));
  };

  const toggleLikesList = (tweetId) => {
    setOpenLikesTweetId((prevId) => (prevId === tweetId ? null : tweetId));
  };

  return (
    <div className="space-y-6">
      {tweets.map((tweet) => {
        const hasLiked = (tweet.likedBy || []).includes(currentUser.email);

        return (
          <div
            key={tweet._id}
            className="bg-[#1d1f23] p-4 rounded-xl shadow-lg border border-[#333]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">@{tweet.author}</span>
              {tweet.author === currentUser.email && (
                <button
                  onClick={() => handleDeleteTweet(tweet._id)}
                  className="text-red-400 hover:text-red-200 transition"
                  title="Delete Tweet"
                >
                  <FaTrash />
                </button>
              )}
            </div>

            <p className="text-white text-base mb-3">{tweet.text}</p>

            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => handleLike(tweet)}>
                {hasLiked ? (
                  <FaHeart className="text-[#E1306C] text-xl" />
                ) : (
                  <FaRegHeart className="text-white text-xl hover:text-[#E1306C]" />
                )}
              </button>
              <span className="text-gray-300 text-sm">
                {tweet.likes > 0
                  ? `${tweet.likes} like${tweet.likes > 1 ? "s" : ""}`
                  : "No likes yet"}
              </span>
              {tweet.likes > 0 && (
                <button
                  onClick={() => toggleLikesList(tweet._id)}
                  className="text-xs text-gray-400 hover:text-white ml-2"
                >
                  {openLikesTweetId === tweet._id ? "Hide likes" : "View likes"}
                </button>
              )}
            </div>

            {openLikesTweetId === tweet._id && (
              <div className="bg-[#2a2d33] p-2 rounded-md mt-1 text-sm text-gray-300">
                <p className="mb-1 text-white font-medium">Liked by:</p>
                <ul className="list-disc list-inside space-y-1">
                  {(tweet.likedBy || []).map((user, idx) => (
                    <li key={idx}>{user}</li>
                  ))}
                </ul>
              </div>
            )}

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
                      onClick={() => handleDeleteComment(tweet._id, c)}
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
                  className="flex-grow rounded-md px-3 py-2 bg-[#22252a] text-white"
                  value={comments[tweet._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(tweet._id, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddComment(tweet._id);
                    }
                  }}
                />
                <button
                  onClick={() => handleAddComment(tweet._id)}
                  className="bg-[#1d9bf0] hover:bg-[#1a8cd8] rounded-md px-3 py-2 font-semibold text-white"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        );
      })}

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
