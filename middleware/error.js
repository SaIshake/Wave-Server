const createError = (status, message) => {
  const error = new Error(message);
  error.status = status; // Set your desired status code
  return error;
};

module.exports = createError