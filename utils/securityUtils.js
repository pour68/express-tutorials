const randomSalt = (max = 100) => {
  return Math.floor(Math.random() * max);
};

module.exports = randomSalt;
