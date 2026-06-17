const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const customerRoutes = require('./routes/customerRoutes');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://myapp2025:Madbot%40123@cluster0.vesauoq.mongodb.net/Joost?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('MongoDB Connected');
})
.catch((err) => {
  console.log(err);
});

app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
