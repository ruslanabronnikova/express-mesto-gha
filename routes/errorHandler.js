// errorHandler.js
const NOT_FOUND = 404;

const handleNotFound = (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
};

module.exports = handleNotFound;
