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

// SEARCH CUSTOMER BY PHONE
router.get('/:phone', async (req, res) => {

  try {

    const customer = await Customer.findOne({
      phone: req.params.phone
    });

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    res.json(customer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE CUSTOMER
router.put('/:phone', async (req, res) => {

  try {

    const updatedCustomer = await Customer.findOneAndUpdate(
      {
        phone: req.params.phone
      },
      req.body,
      {
        new: true
      }
    );

    res.json(updatedCustomer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;