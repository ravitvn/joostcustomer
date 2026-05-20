import mongoose from 'mongoose';
import connectDB from './mongodb';

const transactionSchema = new mongoose.Schema({
    id: String,
    date: String,
    amount: Number,
    productType: String
});

const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    dob: String,
    transactions: [transactionSchema]
});

const Customer =
    mongoose.models.Customer ||
    mongoose.model('Customer', customerSchema, 'customers');

export default async function handler(req, res) {

    await connectDB();

    // GET
    if (req.method === 'GET') {

        try {

            const { phone } = req.query;

            const customer =
                await Customer.findOne({ phone });

            return res.status(200).json(customer);

        } catch (error) {

            return res.status(500).json({
                error: error.message
            });
        }
    }

    // POST
    if (req.method === 'POST') {

        try {

            const customer =
                new Customer(req.body);

            const savedCustomer =
                await customer.save();

            return res.status(201).json(savedCustomer);

        } catch (error) {

            return res.status(500).json({
                error: error.message
            });
        }
    }

    // PUT
    if (req.method === 'PUT') {

        try {

            const { phone } = req.query;

            const updatedCustomer =
                await Customer.findOneAndUpdate(
                    { phone },
                    req.body,
                    { new: true }
                );

            return res.status(200).json(updatedCustomer);

        } catch (error) {

            return res.status(500).json({
                error: error.message
            });
        }
    }

    return res.status(405).json({
        message: 'Method Not Allowed'
    });
}