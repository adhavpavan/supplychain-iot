const { v4: uuidv4 } = require('uuid');

/**
 * Create an object composed of the picked object properties
 * @returns {String}
 */
const getUUID = () => {
  const randomUUID = uuidv4();
 return randomUUID.slice(0, 12);
  // return uuidv4();
};

module.exports = {
  getUUID,
};
