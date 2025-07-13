// routes/tweetRoutes.js

const express = require("express");
const router = express.Router();
const {
  getTweets,
  createTweet,
  likeTweet,
  commentOnTweet,
  deleteComment,
  deleteTweet,
} = require("../controllers/tweetController");

router.get("/", getTweets);
router.post("/", createTweet);
router.put("/:id/like", likeTweet);
router.put("/:id/comment", commentOnTweet);
router.put("/:id/comment/delete", deleteComment);
router.delete("/:id", deleteTweet);

module.exports = router;
