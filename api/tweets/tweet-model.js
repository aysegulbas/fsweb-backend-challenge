const db = require("../../data/db-config");

function getAllTweets() {
  return db("tweets");
}

async function createTweet(tweet) {
  const [insertedId] = await db("tweets").insert(tweet);
  const inserted = await db("tweets").where("tweet_id", insertedId).first();
  return inserted;
}
async function createRetweet(tweet) {
  const [insertedId] = await db("retweets").insert(tweet);
  const inserted = await db("retweets")
    .select("tweet_id", "user_id")
    .where("tweet_id", insertedId)
    .first();
  return inserted;
}

async function createLike(tweet) {
  const [insertedId] = await db("likes").insert(tweet);
  const inserted = await db("likes")
    .select("tweet_id", "user_id")
    .where("tweet_id", insertedId)
    .first();
  return inserted;
}

function getTweetByTweetId(tweet_id) {
  return db("tweets").where("tweet_id", tweet_id).first();
}
function getTweetByRetweetId(tweet_id) {
  return db("tweets")
    .select("tweet_id", "user_id")
    .where("tweet_id", tweet_id)
    .first();
}

function removeTweet(tweet_id) {
  return db("tweets").where("tweet_id", tweet_id).del();
}
function removeRetweet(tweet_id) {
  return db("retweets").where("retweets.tweet_id", tweet_id).del();
}
async function getlikeByUser(user_Id) {
  return await db("likes")
    .join("tweets", "likes.tweet_id", "tweets.tweet_id")
    .select("likes.tweet_id", "tweets.content")
    .where("likes.user_id", user_Id);
}

async function getRetweetByUser(user_Id) {
  return await db("retweets")
    .join("tweets", "retweets.tweet_id", "tweets.tweet_id")
    .select("retweets.tweet_id", "tweets.content")
    .where("retweets.user_id", user_Id);
}

async function getRetweetByTweetId(tweet_id,user_id) {
  return await db("retweets")
    .join("tweets", "retweets.tweet_id", "tweets.tweet_id")
    .select("retweets.tweet_id", "tweets.content")
    .where("retweets.user_id", user_id);
   
}
async function getByLikeFilter(filter) {
  return await db("likes as l")
    .leftJoin("tweets as t", "l.tweet_id", "t.tweet_id")
    .select("l.like_id")
    .where("like_id", filter)
    .first();

  return getByLikeFilter(like_id);
}
// const getByIdUser = (user_id) => {
//   return db("users").where("user_id", user_id).first();
// };
module.exports = {
  createTweet,
  getTweetByTweetId,
  removeTweet,
  getlikeByUser,
  getByLikeFilter,
  createLike,
  createRetweet,
  getTweetByRetweetId,
  getAllTweets,
  getRetweetByUser,
  removeRetweet,
  getRetweetByTweetId,
};
