const Stretch = require('../../models/mongoose/stretch-schema');

class MongooseStretchService {
  /**
   * Get all stretches.
   * @returns {object[]} The list of stretches.
   * @throws {Error} Thrown if getting stretches fails.
   */
  async getAll() {
    return await Stretch.find({}).exec();
  }

  /**
   * Get a random amount of stretches.
   * @param {number} maxAmount The amount of stretches to get.
   * @returns {object[]} The random amount of stretches.
   * @throws {Error} Thrown if getting stretches fails.
   */
  async getRandomAmount(maxAmount) {
    const stretches = [];
    const ids = [];

    for (let index = 0; index < maxAmount; index++) {
      const randomStretchQuery = await Stretch.aggregate([
        { $match: { _id: { $nin: ids } } },
        { $sample: { size: 1 } },
      ]);

      const noStretchesRemaining = randomStretchQuery.length == 0;
      if (noStretchesRemaining) {
        break;
      }

      const randomStretch = randomStretchQuery[0];

      stretches.push(randomStretch);
      ids.push(randomStretch._id);
    }

    return stretches;
  }
}

module.exports = MongooseStretchService;
