const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants/jwt');

const UnAuthorized = require('../classErrors/UnAuthorized');

const authMiddleW = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnAuthorized('Неправильные почта или пароль'));
  }
  const token = authorization.replace(bearer, '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    return next(new UnAuthorized('Неправильные почта или пароль'));
  }

  return next();
};

module.exports = authMiddleW;
