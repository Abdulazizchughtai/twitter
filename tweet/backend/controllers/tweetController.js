const asyncHandler = require("express-async-handler");
const Tweet = require("../models/Tweet");

// @desc Get all tweets
// @route GET /api/tweets
// @access Public
const getTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find().sort({ createdAt: -1 });
  res.status(200).json(tweets);
});

// @desc Create a tweet
// @route POST /api/tweets
// @access Public
const createTweet = asyncHandler(async (req, res) => {
  const { text, author, imageUrl } = req.body;

  if (!text || !author) {
    res.status(400);
    throw new Error("Text and author are required");
  }

  const tweet = await Tweet.create({
    text,
    author,
    createdAt: new Date(),
    likes: 0,
    likedBy: [],
    comments: [],
  });

  res.status(201).json(tweet);
});


const likeTweet = asyncHandler(async (req, res) => {
     console.log("LIKE request received");
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    res.status(404);
    throw new Error("Tweet not found");
  }

  const email = req.body.email;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const hasLiked = tweet.likedBy.includes(email);

  if (hasLiked) {
    tweet.likedBy = tweet.likedBy.filter(e => e !== email); 
  } else {
    tweet.likedBy.push(email);
  }

  tweet.likes = tweet.likedBy.length;
  await tweet.save();

  res.status(200).json(tweet);
});


// Add a comment to a tweet
const commentOnTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    res.status(404);
    throw new Error("Tweet not found");
  }

  const { text, author } = req.body;
  if (!text || !author) {
    res.status(400);
    throw new Error("Comment text and author required");
  }

  tweet.comments.push({ text, author, createdAt: new Date() });
  await tweet.save();

  res.status(200).json(tweet);
});

// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) {
    res.status(404);
    throw new Error("Tweet not found");
  }

  await tweet.deleteOne();
  res.status(200).json({ message: "Tweet deleted" });
});



// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { text, author } = req.body;
  const tweet = await Tweet.findById(req.params.id);

  if (!tweet) {
    res.status(404);
    throw new Error("Tweet not found");
  }

  tweet.comments = tweet.comments.filter(
    (c) => !(c.text === text && c.author === author)
  );

  await tweet.save();
  res.status(200).json(tweet);
});

module.exports = {
  getTweets,
  createTweet,
  likeTweet,
  commentOnTweet,
  deleteTweet,
 
  deleteComment,
};

