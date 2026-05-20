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

    const { phone } = req.query;

    // GET CUSTOMER
    if (req.method === 'GET') {

        try {

            const customer = await Customer.findOne({
                phone
            });

            return res.status(200).json(customer);

        } catch (error) {

            return res.status(500).json({
                error: error.message
            });
        }
    }

    // UPDATE CUSTOMER
    if (req.method === 'PUT') {

        try {

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