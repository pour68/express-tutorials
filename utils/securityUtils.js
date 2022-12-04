const randomSalt = (max = 10) => {
  return Math.floor(Math.random() * max);
};

module.exports = randomSalt;
