const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: String,
  date: String,
  amount: Number,
  productType: String
});

const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: {
    type: String,
    unique: true
  },
  dob: String,
  transactions: [transactionSchema]
});

module.exports = mongoose.model('Customer', customerSchema, 'customers')