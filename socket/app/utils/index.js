const config = require('../../config/config.json');

class Utils {
  static getCustomer(accessToken) {
    const customer = jwt.decode(accessToken, config.jwtSecret, true);
    return customer;
  }
}

module.exports = new AppHelper();
