const express = require('express');
const SuccessResponse = require('../models/responses/success-response');
const ErrorResponse = require('../models/responses/error-response');

class AccountRouter {
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * Handle a get account request.
   * @param {object} req The get account request.
   * @param {object} res The get account response.
   */
  async getAccount(req, res) {
    const { user } = req;

    try {
      const foundUser = await this.userService.getById(user.id);

      if (!foundUser) {
        return res.sendStatus(404);
      }

      const userResponse = {
        id: foundUser._id,
        email: foundUser.email,
        username: foundUser.username,
      };

      return res.json(new SuccessResponse(userResponse));
    } catch (error) {
      return res.sendStatus(500);
    }
  }
}

function createAccountRouter(userService) {
  const router = express.Router();
  const accountRouter = new AccountRouter(userService);

  router.get('/', (req, res) => accountRouter.getAccount(req, res));

  return router;
}

module.exports = createAccountRouter;
