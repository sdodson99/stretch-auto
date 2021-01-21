class InvalidPasswordError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = InvalidPasswordError;
