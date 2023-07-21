const { HASH_ROUND } = require("../../helper");
const userModel=require("../users/user-model")
const bcrypt = require("bcryptjs");
const userNameVarmı = async (req, res, next) => {
    const { username } = req.body;
    const user = await userModel.getByFilter({ username: username });
    if (!user) {
      res.status(401).json({ message: "user tanımlı değil" }); //login için yazıyoruz şuan, username olmalı databasede
    } else {
      req.user = user;
      next();
    }
  };
  const usernameBostamı = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await userModel.getByFilter({ username: username });
    if (user) {
      res.status(422).json({ message: "User zaten var" });
    } else {
      //hazır elimizde username varken passwordu burda hashledik. böylece requestin içinde hashkenmiş password var
      const hashedPassword = bcrypt.hashSync(password,HASH_ROUND);
      req.hashedPassword = hashedPassword;
      //reuestin içinde hashlenmiş passwordu saklamış olduk.routerda registera da yazabilirdik.
      next();
    }
  };
  module.exports = { userNameVarmı, usernameBostamı };