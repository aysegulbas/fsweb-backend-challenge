const jwt=require("jsonwebtoken");
const { JWT_SECRET } = require("../../helper");

module.exports = (req, res, next) => {
    //token var mı?varsa doğrulayacak.tokenın içinde tutulacakları login metodunda payload içinde yazdık
    const token = req.headers.authorization;
    
    if (!token) {
      res.status(401).json({ message: "token gereklidir" });
    } else {
      jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
        if (error) {
          res.status(401).json({ message: "Token geçersizdir" });
        } else {
          //token varsa request içine atmalıyız
          req.decodedToken = decodedToken;
          next();
        }
      });
    }}