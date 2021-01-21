const express = require('express');
const {
  EmailAlreadyExistsError,
  ConfirmPasswordError,
  EmailNotFoundError,
  InvalidPasswordError,
  InvalidRefreshTokenError,
} = require('../errors');
const { ValidationError } = require('mongoose').Error;
const SuccessResponse = require('../models/responses/success-response');
const ErrorResponse = require('../models/responses/error-response');

class AuthenticationRouter {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Handle a login.
   * @param {object} req The login request.
   * @param {object} res The login response.
   */
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Please provide an email and password.');
    }

    try {
      const tokenResponse = await this.authService.login(email, password);
      return res.json(new SuccessResponse(tokenResponse));
    } catch (error) {
      if (
        error instanceof EmailNotFoundError ||
        error instanceof InvalidPasswordError
      ) {
        return res.status(401).send('Invalid credentials.');
      }
      if (error instanceof ValidationError) {
        return res.status(400).send(error.message);
      }

      return res.sendStatus(500);
    }
  }

  /**
   * Handle a register.
   * @param {object} req The register request.
   * @param {object} res The register response.
   */
  async register(req, res) {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
      return res
        .status(400)
        .send(
          'Please provide an email, username, password, and confirm password.'
        );
    }

    try {
      await this.authService.register(
        email,
        username,
        password,
        confirmPassword
      );
      return res.sendStatus(201);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        return res.status(409).send(error.message);
      }
      if (error instanceof ConfirmPasswordError) {
        return res.status(400).send(error.message);
      }
      if (error instanceof ValidationError) {
        return res.status(400).send(error.message);
      }

      return res.sendStatus(500);
    }
  }

  /**
   * Handle a token refresh.
   * @param {object} req The refresh request.
   * @param {object} res The refresh response.
   */
  async refresh(req, res) {
    const { refreshToken } = req.body;

    try {
      const tokenResponse = await this.authService.refresh(refreshToken);
      return res.json(new SuccessResponse(tokenResponse));
    } catch (error) {
      if (error instanceof InvalidRefreshTokenError) {
        return res.status(400).send('Invalid refresh token.');
      }

      return res.sendStatus(500);
    }
  }

  /**
   * Handle a logout.
   * @param {object} req The logout request.
   * @param {object} res The logout response.
   */
  async logout(req, res) {
    const { user } = req;

    try {
      await this.authService.logoutEverywhere(user.id);
      return res.sendStatus(204);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
}

function createAuthenticationRouter(authService, authenticationMiddleware) {
  const router = express.Router();
  const authenticationRouter = new AuthenticationRouter(authService);

  router.post('/login', (req, res) => authenticationRouter.login(req, res));
  router.post('/register', (req, res) =>
    authenticationRouter.register(req, res)
  );
  router.post('/refresh', (req, res) => authenticationRouter.refresh(req, res));
  router.delete('/logout', authenticationMiddleware, (req, res) =>
    authenticationRouter.logout(req, res)
  );

  return router;
}

module.exports = createAuthenticationRouter;
