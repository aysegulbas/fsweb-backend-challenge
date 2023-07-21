const userModel = require("./user-model");

async function validateTweetId(req, res, next) {
  try {
    const existTweet = await userModel.userIdYeGoreTweetGetir(req.params.id);
    if (existTweet.length == 0) {
      res.status(404).json({ message: "Tweet yok" });
    } else {
      req.existTweet = existTweet;
      next();
    }
  } catch (error) {
    next(error);
  }
}

async function validateUserId(req, res, next) {
  try {
    const existUser = await userModel.UserIdYeGoreUserGetir(req.params.id);
    if (!existUser) {
      res.status(404).json({ message: "User_id geçersiz" });
    } else {
      req.existUser = existUser;
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateTweetId,
  validateUserId,
};
