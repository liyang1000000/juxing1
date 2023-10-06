// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  priority: {
        type: Number,
        default: 0 //0 is regular user, 1 for master, 2 for VIP
  },
  name: {type: String, lowercase: true },
  email: {type: String, lowercase: true },
  password: String,
  login_log: [],
  fb_id: {type: String, lowercase: true },
  device_token: {type: String, lowercase: true },
  phone: {type: String, default: ""},
  // birthday:{
  //   month: Number,
  //   day: Number
  // },
  birthday: {type: String, default: ""},
  checkin: {type: Boolean, default: false},
  checkin_log: [],
  reward: [],
  resvs: [],
  checkin_redeem: {type: Number, default: "0"},
  reward_redeem: {type: Number, default: "0"},
  resvs_redeem: {type: Number, default: "0"},
  checkin_left: Number,
  reward_left: Number,
  resvs_left: Number
});

// the schema is useless so far
// we need to create a model using it
const userDB = mongoose.connection.useDb('juxing1');
var Users = userDB.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = Users;