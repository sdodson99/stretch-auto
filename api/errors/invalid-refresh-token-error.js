class InvalidRefreshTokenError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = InvalidRefreshTokenError;
