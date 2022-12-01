const mongoose = require("mongoose");
const options = require("../settings/dbConnSettings");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, options);
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbConnection;
