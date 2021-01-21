const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const {
  EmailNotFoundError,
  EmailAlreadyExistsError,
  ConfirmPasswordError,
  InvalidPasswordError,
  InvalidRefreshTokenError,
} = require('../errors');

class AuthenticationService {
  constructor(userService, refreshTokenService, jwtConfiguration) {
    this.userService = userService;
    this.refreshTokenService = refreshTokenService;

    this.accessSecret = jwtConfiguration.accessSecret;
    this.refreshSecret = jwtConfiguration.refreshSecret;
    this.accessExpiration = jwtConfiguration.accessExpiration;
    this.refreshExpiration = jwtConfiguration.refreshExpiration;
  }

  /**
   * Login a user by checking credentials.
   * @param {string} email The user's email.
   * @param {string} password The user's password.
   * @returns {object} Token credentials if login successful.
   * @throws {EmailNotFoundError} Thrown if user with email not found.
   * @throws {InvalidPasswordError} Thrown if user's password is incorrect.
   * @throws {Error} Thrown if login fails.
   */
  async login(email, password) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new EmailNotFoundError(
        `User with email ${email} does not exist.`,
        email
      );
    }

    const hasCorrectPassword = await bcrypt.compare(password, user.password);
    if (!hasCorrectPassword) {
      throw new InvalidPasswordError('Incorrect password.');
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const tokens = await this.generateTokens(user._id, payload);

    return tokens;
  }

  /**
   * Register a new user.
   * @param {string} email The user's email.
   * @param {string} username The user's username.
   * @param {string} password The user's password.
   * @param {string} confirmPassword The user's password confirmation.
   * @throws {ConfirmPasswordError} Thrown if password and confirm password do not match.
   * @throws {EmailAlreadyExistsError} Thrown if email already exists.
   * @throws {Error} Thrown if registration fails.
   */
  async register(email, username, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new ConfirmPasswordError(
        'Password and confirm password do not match.'
      );
    }

    const existingUser = await this.userService.getByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsError(
        `Email ${email} is already in use.`,
        email
      );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
      email: email,
      username: username,
      password: hashedPassword,
    };

    await this.userService.create(newUser);
  }

  /**
   * Refresh a user's refresh token with new access and refresh tokens.
   * @param {string} refreshToken The user's refresh token.
   * @returns {object} The user's token credentials.
   * @throws {InvalidRefreshTokenError} Thrown if refresh token invalid.
   * @throws {Error} Thrown if refresh fails.
   */
  async refresh(refreshToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, this.refreshSecret, async (err, decoded) => {
        if (err) {
          return reject(new InvalidRefreshTokenError(err.message));
        }

        try {
          const storedRefreshToken = await this.refreshTokenService.getByRefreshToken(
            refreshToken
          );

          if (!storedRefreshToken) {
            return reject(
              new InvalidRefreshTokenError('Refresh token not found.')
            );
          }

          await this.refreshTokenService.deleteById(storedRefreshToken._id);

          const { user: refreshTokenUser } = storedRefreshToken;
          const user = {
            id: refreshTokenUser._id,
            username: refreshTokenUser.username,
            email: refreshTokenUser.email,
            role: refreshTokenUser.role,
          };

          const tokens = await this.generateTokens(user.id, user);

          return resolve(tokens);
        } catch (error) {
          return reject(
            new InvalidRefreshTokenError('Unknown refresh token error.')
          );
        }
      });
    });
  }

  /**
   * Logout a user everywhere by deleting all of their refresh tokens.
   * @param {string} userId The id of the user.
   * @throws {Error} Thrown if logout everywhere fails.
   */
  async logoutEverywhere(userId) {
    await this.refreshTokenService.deleteAllForUserId(userId);
  }

  /**
   * Generate access and refresh tokens for a user.
   * @param {string} userId The user's id.
   * @param {object} payload The payload to sign into the token.
   * @returns {object} The user's generated tokens.
   * @throws {Error} Thrown if generation fails.
   */
  async generateTokens(userId, payload) {
    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiration,
    });
    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiration,
    });

    await this.refreshTokenService.create({
      user: userId,
      refreshToken: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = AuthenticationService;
