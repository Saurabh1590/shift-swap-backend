const handleValidationError = (err, res) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  res.status(400).json({ message });
};

const handleDuplicateKeyError = (err, res) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  res.status(400).json({ message });
};

const handleCastError = (err, res) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  res.status(400).json({ message });
};

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    console.error("ERROR 💥", err);
  }

  let error = { ...err };
  error.message = err.message;

  if (error.name === "ValidationError") handleValidationError(error, res);
  else if (error.code === 11000) handleDuplicateKeyError(error, res);
  else if (error.name === "CastError") handleCastError(error, res);
  else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message || "Something went wrong!",
    });
  }
};

module.exports = errorMiddleware;