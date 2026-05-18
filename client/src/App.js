import React, { useState } from 'react';

import {
  Tabs,
  Tab,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Table,
  MenuItem,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

import axios from 'axios';

function App() {

  const [tabValue, setTabValue] = useState(0);

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    transactions: []
  });

  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    transactions: []
  });

  const [searchPhone, setSearchPhone] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [transaction, setTransaction] = useState({
    id: '',
    date: today,
    amount: '',
    productType: 'Vapes'
  });

  const handleChange = (e) => {

    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeNewCustomer = (e) => {

    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value
    });
  };

  const saveCustomer = async () => {

    try {

      await axios.post(
        'http://localhost:5000/api/customers',
        customer
      );

      alert('Customer Saved Successfully');

    } catch (error) {
      console.log(error);
      alert('Error Saving Customer');
    }
  };

  const saveNewCustomer = async () => {

    try {

      await axios.post(
        'http://localhost:5000/api/customers',
        newCustomer
      ).then(res => {
        setNewCustomer({firstName: '',
          lastName: '',
          phone: '',
          dob: '',
          transactions: []})
      });

      alert('Customer Saved Successfully');

    } catch (error) {
      console.log(error);
      alert('Error Saving Customer');
    }
  };

  const searchCustomer = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/api/customers/${searchPhone}`
      );

      setCustomer(response.data);

    } catch (error) {
      alert('Customer Not Found');
    }
  };

  const handleTransactionChange = (e) => {

    setTransaction({
      ...transaction,
      [e.target.name]: e.target.value
    });
  };

  const addTransaction = async () => {

    try {

      const newTransaction = {
        ...transaction,
        id: `TXN-${Date.now()}`
      };

      const updatedCustomer = {
        ...customer,
        transactions: [
          ...(customer.transactions || []),
          newTransaction
        ]
      };

      await axios.put(
        `http://localhost:5000/api/customers/${customer.phone}`,
        updatedCustomer
      ).then(res=>{
        setTransaction({
          id: '',
          date: new Date().toISOString().split('T')[0],
          amount: '',
          productType: 'Vapes'
        });
      });

      setCustomer(updatedCustomer);

      alert('Transaction Added Successfully');

      setTransaction({
        id: '',
        date: '',
        amount: '',
        productType: 'Vapes'
      });

    } catch (error) {
      alert('Failed To Add Transaction');
    }
  };

  const updateCustomer = async () => {

    try {

      await axios.put(
        `http://localhost:5000/api/customers/${customer.phone}`,
        customer
      );

      alert('Customer Updated');

    } catch (error) {
      alert('Update Failed');
    }
  };

  return (

    <Container maxWidth="md" sx={{ mt: 5 }}>

      <Paper elevation={3} sx={{ p: 4 }}>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 4 }}
        >
          <Tab label="Search Joost Customer" />
          <Tab label="Customer Info" />
          <Tab label="New Customer" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ mb: 4 }}>

            <Typography variant="h6">
              Search Customer
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>

              <TextField
                label="Mobile Number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                fullWidth
              />

              <Button
                variant="contained"
                onClick={searchCustomer}
              >
                Search
              </Button>

            </Box>


            {customer.phone && (
              <Paper elevation={2} sx={{ p: 3, mb: 4 }}>

                <Typography variant="h6" gutterBottom>
                  Add Transaction
                </Typography>

                <TextField
                  fullWidth
                  label="Transaction Date"
                  name="date"
                  value={today}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder=""
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Amount Spent"
                  name="amount"
                  value={transaction.amount}
                  onChange={handleTransactionChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="productType"
                  value={transaction.productType}
                  onChange={handleTransactionChange}
                  sx={{ mb: 2 }}
                >

                  <MenuItem value="Vapes">Vapes</MenuItem>
                  <MenuItem value="Cigars">Cigars</MenuItem>
                  <MenuItem value="Eliquids">Eliquids</MenuItem>
                  <MenuItem value="Tobacco">Tobacco</MenuItem>

                </TextField>

                <Button
                  variant="contained"
                  color="success"
                  onClick={addTransaction}
                >
                  Submit Transaction
                </Button>

              </Paper>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <>

            <Typography variant="h6" gutterBottom>
              Customer Info
            </Typography>

            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={customer.firstName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={customer.lastName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Mobile Number"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="date"
              label="DOB"
              name="dob"
              value={customer.dob}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>

              <Button
                variant="contained"
                color="primary"
                onClick={saveCustomer}
              >
                Save Customer
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={updateCustomer}
              >
                Update Customer
              </Button>

            </Box>

            <Typography variant="h6" gutterBottom>
              Transactions
            </Typography>

            <TableContainer component={Paper}>

              <Table>

                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Product Type</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  {customer.transactions?.map((transaction) => (

                    <TableRow key={transaction.id}>

                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.productType}</TableCell>

                    </TableRow>
                  ))}

                </TableBody>

              </Table>

            </TableContainer>

          </>
        )}
        {tabValue === 2 && (
          <>

            <Typography variant="h6" gutterBottom>
              New Customer
            </Typography>

            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={newCustomer.firstName}
              onChange={handleChangeNewCustomer}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={newCustomer.lastName}
              onChange={handleChangeNewCustomer}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Mobile Number"
              name="phone"
              value={newCustomer.phone}
              onChange={handleChangeNewCustomer}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="date"
              label="DOB"
              name="dob"
              value={newCustomer.dob}
              onChange={handleChangeNewCustomer}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>

              <Button
                variant="contained"
                color="primary"
                onClick={saveNewCustomer}
              >
                Save Customer
              </Button>

            </Box>

          </>
        )}

      </Paper>

    </Container>
  );
}

export default App;