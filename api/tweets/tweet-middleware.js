const tweetModel = require("./tweet-model");
async function checkTweetId(req, res, next) {
  try {
    const existTweet = await tweetModel.getTweetByTweetId(req.params.id);
    if (!existTweet) {
      res.status(404).json({ message: `${req.params.id} Id'li tweet yok ` });
    } else {
      req.existTweet = existTweet;
      next();
    }
  } catch (error) {
    next(error);
  }
}

async function validateTweet(req, res, next) {
  try {
    let { user_id, content } = req.body;
    if (!user_id || !content) {
      res.status(400).json({
        messsage: "Tweet atarken girdiğiniz alanları kontrol ediniz!",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}
// async function validateUser(req, res, next) {
//   try {
//     const existUserx = await tweetModel.getByIdUser(req.params.id);
//     if (!existUserx) {
//       res.status(404).json({ message: "User_id geçersiz" });
//     } else {
//       next();
//     }
//   } catch (error) {
//     next(error);
//   }
// }
module.exports = { checkTweetId, validateTweet };
