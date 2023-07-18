const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../constants/jwt');

const authMiddleW = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  console.log(authorization)
  if (!authorization || !authorization.startsWith(bearer)) {
    return res.status(401).json({ message: 'Неправильные почта или пароль' });
  }
  const token = authorization.replace(bearer, '');
  let payload;
  console.log(token)
  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неправильные почта или пароль' });
  }
};

module.exports = authMiddleW;
