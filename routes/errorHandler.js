const NotFound = require('../classErrors/NotFound');

const handleNotFound = (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
};

module.exports = handleNotFound;
