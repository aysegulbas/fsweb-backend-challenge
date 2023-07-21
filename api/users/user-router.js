const router = require("express").Router();
const mw = require("./user-middleware");
const restrict = require("../auth/restricted");
const userModel = require("../users/user-model");
router.get("/twt/:id", mw.validateTweetId, restrict, (req, res, next) => {
  try {
    res.json(req.existTweet);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", mw.validateUserId, (req, res, next) => {
  try {
    res.json(req.existUser);
  } catch (error) {
    next(error);
  }
});

//takip etmeye başla, following'e eklencek

router.post(
  "/relations/:id",
  restrict,
  mw.validateUserId,
  async (req, res, next) => {
    try {
      const newfollowing = {
        following_id: req.params.id,
        follower_id: req.decodedToken.user_id,
      };
      await userModel.createfollowing(newfollowing);
      res.status(201).json(newfollowing);
    } catch (error) {
      next(error);
    }
  }
);
router.get("/relations/:user_id", restrict, async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const favs = await userModel.getfollowingByUser(user_id);
    if (favs.length == 0) {
      res.json({
        message: `${user_id} Id'li kullanıcıyı takip eden yok`,
      });
    } else {
      res.status(200).json(favs);
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
