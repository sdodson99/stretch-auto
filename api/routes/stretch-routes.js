const express = require('express');
const SuccessResponse = require('../models/responses/success-response');
const ErrorResponse = require('../models/responses/error-response');

class StretchRouter {
  constructor(stretchService) {
    this.stretchService = stretchService;
  }

  /**
   * Get many stretches. Gets all stretches by default.
   * Can use query param 'maxAmount' to get a max amount of random stretches.
   * @param {object} req The get all stretches request.
   * @param {object} res The get all stretches response.
   */
  async getManyStretches(req, res) {
    let stretches;

    try {
      if (req.query['maxAmount']) {
        stretches = await this.stretchService.getRandomAmount(
          req.query['maxAmount']
        );
      } else {
        stretches = await this.stretchService.getAll();
      }

      return res.json(new SuccessResponse(stretches));
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
}

function createStretchRouter(stretchService, authenticationMiddleware) {
  const router = express.Router();
  const stretchRouter = new StretchRouter(stretchService);

  router.get('/', (req, res) => stretchRouter.getManyStretches(req, res));

  return router;
}

module.exports = createStretchRouter;
