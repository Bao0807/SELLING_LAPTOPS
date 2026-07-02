const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  // Sequelize bad object ID or similar DB errors can be caught here
  if (err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error.statusCode = 400;
    error.message = message;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    error.statusCode = 400;
    error.message = 'Duplicate field value entered';
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: Array.isArray(error.message)
      ? error.message[0]
      : error.message || 'Server Error'
  });
};

module.exports = { errorHandler };
