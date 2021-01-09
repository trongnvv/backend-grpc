const mongoose = require('mongoose');
const { Schema } = mongoose;
const VarSchema = new Schema(
  {
    username: String,
    password: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('User', VarSchema);
