const randomSalt = (max = 100) => {
  return Math.floor(Math.random() * max).toString();
};

module.exports = randomSalt;
