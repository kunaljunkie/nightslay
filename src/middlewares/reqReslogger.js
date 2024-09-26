const logger = require('../servives/logging');

const requestLogger = (req, res, next) => {
  const { method, url, headers, body } = req;
  const logData = {
    method,
    url,
    headers,
    body
  };
  logger.info('HTTP Request', logData);
  next();
};

module.exports = requestLogger;
