class EmailNotFoundError extends Error {
  constructor(message, email) {
    super(message);

    this.email = email;
  }
}

module.exports = EmailNotFoundError;
