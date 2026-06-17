const express = require('express');
const router = express.Router();

const Customer = require('../models/Customer');

// SAVE CUSTOMER
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SEARCH CUSTOMER BY PHONE (?phone=...)
router.get('/', async (req, res) => {
  try {
    const { phone } = req.query;
    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE CUSTOMER (?phone=...) or (?phone=...&action=reset)
router.put('/', async (req, res) => {
  try {
    const { phone, action } = req.query;

    if (action === 'reset') {
      const updatedCustomer = await Customer.findOneAndUpdate(
        { phone },
        { rewardsResetDate: new Date() },
        { new: true }
      );
      return res.json(updatedCustomer);
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { phone },
      req.body,
      { new: true }
    );
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
