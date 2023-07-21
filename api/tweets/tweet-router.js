const express = require("express");
const router = express.Router();
const tweetModel = require("./tweet-model");
const mw = require("../tweets/tweet-middleware");

const restrict = require("../auth/restricted");

router.get("/", restrict, async (req, res, next) => {
  try {
    const tweet = await tweetModel.getAllTweets();
    res.json(tweet);
  } catch (error) {
    next(error);
  }
});

router.post("/post", restrict, mw.validateTweet, async (req, res, next) => {
  try {
    let modelTweet = {
      user_id: req.body.user_id,
      content: req.body.content,
    };
    if (modelTweet.user_id !== req.decodedToken.user_id) {
      res.status(401).json({ message: "Bu işlem için yetkiniz yok" });
    } else {
      await tweetModel.createTweet(modelTweet);
      res.status(201).json(modelTweet);
    }
  } catch (error) {
    next(error);
  }
});
router.post(
  "/retweets/:id",
  restrict,
  mw.checkTweetId,
  async (req, res, next) => {
    try {
      const retweetedTweet = await tweetModel.getTweetByRetweetId(
        req.params.id
      );
      // retweetedTweet.user_id=req.decodedToken.user_id

      let modelTweet = {
        user_id: req.decodedToken.user_id,
        tweet_id: retweetedTweet.tweet_id,
      };
      console.log("retweet", retweetedTweet);
      await tweetModel.createRetweet(modelTweet);
      res.status(201).json(modelTweet);
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/retweets/:user_id",
  restrict,

  async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const retweets = await tweetModel.getRetweetByUser(user_id);
      if (retweets.length == 0) {
        res.json({
          message: `${user_id} Id'li kullanıcı tarafından retweet edilen tweet yok`,
        });
      } else {
        res.status(200).json(retweets);
      }
    } catch (error) {
      next(error);
    }
  }
);
router.get("/:id", restrict, mw.checkTweetId, async (req, res, next) => {
  try {
    const existTweet = await tweetModel.getTweetByTweetId(req.params.id);
    res.json(existTweet);
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", restrict, mw.checkTweetId, async (req, res) => {
  try {
    const tweet = await tweetModel.getTweetByTweetId(req.params.id);
    console.log("denem", tweet);

    if (tweet.user_id !== req.decodedToken.user_id) {
      res.status(401).json({ message: "Bu işlem için yetkiniz yok" });
    } else {
      await tweetModel.removeTweet(req.params.id);
      res
        .status(201)
        .json({ message: `${req.params.id} Id'li tweet silindi ` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/retweets/:id", restrict, mw.checkTweetId, async (req, res) => {
  try {
    const tweet = await tweetModel.getRetweetByTweetId(req.params.id,req.decodedToken.user_id);
    console.log("retweet", tweet);

   
      await tweetModel.removeRetweet(req.params.id);
      res
        .status(201)
        .json({ message: `${req.params.id} Id'li tweet silindi ` });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/likes/:user_id", restrict, async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const favs = await tweetModel.getlikeByUser(user_id);
    if (favs.length == 0) {
      res.json({
        message: `${user_id} Id'li kullanıcı tarafından beğenilen tweet yok`,
      });
    } else {
      res.status(200).json(favs);
    }
  } catch (error) {
    next(error);
  }
});
router.post("/likes/:id", restrict, mw.checkTweetId, async (req, res, next) => {
  try {
    const likedTweet = await tweetModel.getTweetByRetweetId(req.params.id);
    const newLike = {
      tweet_id: likedTweet.tweet_id,
      user_id: req.decodedToken.user_id,
    };
    await tweetModel.createLike(newLike);

    res.status(201).json(likedTweet);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
