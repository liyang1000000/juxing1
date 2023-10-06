// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var customerSchema = new Schema({
  name: {type: String, lowercase: true },
  email: {type: String, lowercase: true },
  birthday: {type: String, default: ""},
  phone: {type: String, default: ""}
});

// the schema is useless so far
// we need to create a model using it
const customerDB = mongoose.connection.useDb('juxing');
var Customers = customerDB.model('Customer', customerSchema);

// make this available to our users in our Node applications
module.exports = Customers;