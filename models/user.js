const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  profilepic : {
    type : String,
    default : 'def_dp.jpg',
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
