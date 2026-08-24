const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklistModel;
