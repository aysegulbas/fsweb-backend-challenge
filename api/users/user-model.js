const db = require("../../data/db-config");
const get = () => {
  return db("users");
};

async function userIdYeGoreTweetGetir(user_id) {
  let tweet = await db("tweets as t")
    .leftJoin("users as u", "u.user_id", "t.user_id")
    .where("t.user_id", user_id)
    .select("t.*", "u.user_id");
  return tweet;
}

async function UserIdYeGoreUserGetir(user_id) {
  const users = await db("users as u")
    .leftJoin("tweets as t", "u.user_id", "t.user_id")
    .where("u.user_id", user_id)
    .select("t.*", "u.*");
  if (users.length == 0) {
    return null;
  }
  console.log("users", users);
  let responseUserModel = {
    user_id: users[0].user_id,
    username: users[0].username,
    email: users[0].email,
    password: users[0].password,
    tweets: [],
    retweets: [],
    likes: [],
    follower_user: [],
    following_user: [],
  };
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.tweet_id) {
      let tweetModel = {
        tweet_id: user.tweet_id,
        content: user.content,
        created_at: user.created_at,
      };
      responseUserModel.tweets.push(tweetModel);
    }
  }
  const reusers = await db("users as u")
    .leftJoin("retweets as r", "u.user_id", "r.user_id")
    .where("r.user_id", user_id)
    .select("r.*", "u.*");

  for (let i = 0; i < reusers.length; i++) {
    const reuser = reusers[i];
    let retweetModel = {
      tweet_id: reuser.tweet_id,
      content: reuser.content,
    };
    responseUserModel.retweets.push(retweetModel);
  }
  const likedusers = await db("users as u")
    .leftJoin("likes as l", "u.user_id", "l.user_id")
    .where("l.user_id", user_id)
    .select("l.*", "u.*");

  for (let i = 0; i < likedusers.length; i++) {
    const likeduser = likedusers[i];
    let likedModel = {
      tweet_id: likeduser.tweet_id,
      content: likeduser.content,
    };
    responseUserModel.likes.push(likedModel);
  }
  const followerusers = await db("users as u")
    .leftJoin("relations as rel", "u.user_id", "rel.following_id")
    .where("rel.following_id", user_id)
    .select("rel.*", "u.*");

  for (let i = 0; i < followerusers.length; i++) {
    const followeruser = followerusers[i];
    let followerModel = {
      follower_id: followeruser.follower_id,
    };
    responseUserModel.follower_user.push(followerModel);
  }
  const followingusers = await db("users as u")
    .leftJoin("relations as rel", "u.user_id", "rel.follower_id")
    .where("rel.follower_id", user_id)
    .select("rel.*", "u.*");

  for (let i = 0; i < followingusers.length; i++) {
    const followinguser = followingusers[i];
    let followingModel = {
      following_id: followinguser.following_id,
    };
    responseUserModel.following_user.push(followingModel);
  }
  return responseUserModel;
}
const insert = async (user) => {
  let [user_id] = await db("users").insert(user);
  return getById(user_id);
};
const getByFilter = (filter) => {
  return db("users").where(filter).first();
};
const getById = (user_id) => {
  return db("users")
    .select("user_id", "username")
    .where({ user_id: user_id })
    .first();
};
function getFollowingsById(following_id) {
  return db("relations")
    .select("following_id", "follower_id")
    .where("following_id", following_id)
    .first();
}
async function createfollowing(followings) {
  const [insertedId] = await db("relations").insert(followings);
  const inserted = await db("relations")
    .select("following_id", "follower_id")
    .where("following_id", insertedId)
    .first();
  return inserted;
}
async function getfollowingByUser(user_Id) {
  return await db("relations")
    .select("relations.following_id", "relations.follower_id")
    .where("relations.following_id", user_Id);
}
module.exports = {
  userIdYeGoreTweetGetir,
  UserIdYeGoreUserGetir,
  get,
  insert,
  getByFilter,
  getById,
  getFollowingsById,
  createfollowing,
  getfollowingByUser,
};
