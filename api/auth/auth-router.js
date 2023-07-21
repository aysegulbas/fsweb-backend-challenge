const { JWT_SECRET } = require("../../helper");
const userModel = require("../users/user-model");
const mv = require("./auth-middleware");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const restrict = require("./restricted");

router.post("/register", mv.usernameBostamı, async (req, res, next) => {
  //elimizde username
  try {
    const { username, password } = req.body;

    const newUser = {
      username: username,

      password: req.hashedPassword,
    };
    const insertedUser = await userModel.insert(newUser);
    res.json(insertedUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", mv.userNameVarmı, (req, res) => {
  const { password } = req.body;
  //compareSync fonksiypnu hashlenmiş password istemiyor, zaten databasede passwordler hashlenmiş şekilde duruyor. databasedeki hashlenmiş passwordu çekiyor.
  if (req.user && bcrypt.compareSync(password, req.user.password)) {
    const payload = {
      //tokenın içine data saklıyoruz, bu şekilde encode edicez, başka bieyerde decode edip kullanıcaz
      user_id: req.user.user_id,
      username: req.user.username,
      password: req.user.password,
    };
    const options = {
      expiresIn: "24h",
    };
    const token = jwt.sign(payload, JWT_SECRET, options); //tokenı oluşturduk
    res.json({ message: `${req.user.username} geri geldi`, token: token }); //tokenı da çağırıyoruzki bazı requestlerde gerekibilir
  } else {
    res.status(401).json({ message: "geçersiz kullanıcı adı veya şifre" }); //password eşleşmedi
  }
});
// router.get("/isloggedin", restrict, (req, res, next) => {
//   try {
//     res.status(200).json({ message: "Kullanıcı hala login" });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
