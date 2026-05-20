import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!mongoose.connections[0].readyState) {

    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

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

    // SAVE CUSTOMER
    if (req.method === 'POST') {

        try {

            const customer = new Customer(req.body);

            const savedCustomer =
                await customer.save();

            return res.status(201).json(savedCustomer);

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