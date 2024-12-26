var jwt = require("jsonwebtoken");
async function checkLogin(req, res, next) {
  try {
      // Check if authorization header exists
      if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
         return res.status(401).send({
           success: false,
           message: "Authorization token missing",
         });
       }
       const token = req.headers.authorization.split(" ")[1];
       console.log(token);

    var decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    /* console.log(decoded)   */
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ success: false, message: "Invalid Token" });
  }
}

module.exports = {
  checkLogin,
};
