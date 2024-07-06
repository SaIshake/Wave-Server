const jwt = require("jsonwebtoken");
const createError = require("./error");


const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }
  
    jwt.verify(token, "123", (err, user) => {
      if (err) return next(createError(403, "Token is not valid!"));
      req.user = user;
      next();
    });
  };
  
const VerifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
      if (req.user.id === req.params.id) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
};


const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  VerifyUser,
  verifyTokenAndAdmin,
};
