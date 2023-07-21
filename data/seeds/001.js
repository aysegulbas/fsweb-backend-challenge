/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const defaultUser = [
  {
    user_id: 1,
    username: "aysegul_bas",
    email: "aysegul@aysegul.com",
    password: "1234",
  },
  {
    user_id: 2,
    username: "aytac_sahin",
    email: "aytac@aytac.com",
    password: "1234",
  },
  {
    user_id: 3,
    username: "ihsan",
    email: "ihsan@ihsan.com",
    password: "1234",
  },
];
const defaultTweet = [
  {
    tweet_id: 1,
    user_id: 1,
    content: "Yine zamlar geldi",
  },
  {
    tweet_id: 2,
    user_id: 1,
    content: "İzmir yanıyor",
  },
  {
    tweet_id: 3,
    user_id: 2,
    content: "Ali Koç istifa",
  },
  {
    tweet_id: 4,
    user_id: 2,
    content: "Hükümet istifa",
  },
  {
    tweet_id: 5,
    user_id: 3,
    content: "Sigaraya yine zam geldi",
  },
];
const defaultRetweet = [
  {
    user_id: 1,
    tweet_id: 3,
  },
  {
    user_id: 1,
    tweet_id: 4,
  },
  {
    user_id: 2,
    tweet_id: 1,
  },
  {
    user_id: 3,
    tweet_id: 1,
  },
];
const defaultLiked = [
  {
    user_id: 1,
    tweet_id: 5,
  },
  {
    user_id: 1,
    tweet_id: 3,
  },
  {
    user_id: 2,
    tweet_id: 1,
  },
  {
    user_id: 2,
    tweet_id: 2,
  },
  {
    user_id: 2,
    tweet_id: 5,
  },
];
const deafultRelation = [
  {
    follower_id: 2,
    following_id: 1,
  },
  {
    follower_id: 1,
    following_id: 2,
  },
  {
    follower_id: 3,
    following_id: 1,
  },
  {
    follower_id: 3,
    following_id: 2,
  },
];
exports.seed = async function (knex) {
  await knex("users").truncate();
  await knex("tweets").truncate();
  await knex("retweets").truncate();
  await knex("likes").truncate();
  await knex("relations").truncate();

  await knex("users").insert(defaultUser);
  await knex("tweets").insert(defaultTweet);
  await knex("retweets").insert(defaultRetweet);
  await knex("likes").insert(defaultLiked);
  await knex("relations").insert(deafultRelation);
};
