import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import emailjs from '@emailjs/browser';
// materialimport React, { useState } from 'react';
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Modal,
  TextField
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
// components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CheckIcon from '@mui/icons-material/Check';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import { createStyles, makeStyles, Theme, styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import Page from '../components/Page';
import materialImage from '../assets/img/material.png';

import Iconify from '../components/Iconify';

const PREFIX = 'Suppliers';
// Change here
const SERVICE_ID = 'service_keh8hbt';
const TEMPLATE_ID = 'template_6vnvg48';
const PUBLIC_KEY = 'Xj3O_cTCszKa2rLkp';
const classes = {
  statusFinished: `${PREFIX}-statusFinished`,
  statusOnDelivery: `${PREFIX}-statusOnDelivery`
};

const StyledPage = styled(Page)({
  [`& .${classes.statusFinished}`]: {
    padding: '5px',
    backgroundColor: '#088F8F',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#fafafa'
  },
  [`& .${classes.statusOnDelivery}`]: {
    padding: '5px',
    backgroundColor: '#FFC349',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#fafafa'
  }
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
// ----------------------------------------------------------------------

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
async function createSupplier(obj) {
  const token = sessionStorage.getItem('token');

  return fetch('https://dutru-kitchen.online/api/supplier', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
async function acceptInvoice(obj) {
  const idInvoice = localStorage.getItem('idInvoice');
  const TOKEN = sessionStorage.getItem('token');

  return fetch(`https://dutru-kitchen.online/api/inventory/invoice/accept/${idInvoice}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
async function updateStatusO2O(obj) {
  const idInvoice1 = localStorage.getItem('idInvoice1');
  const TOKEN = sessionStorage.getItem('token');

  return fetch(`https://dutru-kitchen.online/api/inventory/invoice/delivery/${idInvoice1}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
const d = new Date();
export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [phoneNumber, setSupplierPhoneNumber] = useState('');
  const [openCreateSupplier, setOpenCreateSupplier] = useState(false);
  const handleOpenCreateSupplier = () => setOpenCreateSupplier(true);
  const handleCloseCreateSupplier = () => setOpenCreateSupplier(false);
  const token = sessionStorage.getItem('token');
  const [valueTab, setValueTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };
  const handleSubmitEmail = (quantity, inName, unit, name, email, totalPrice) => {
    console.log(quantity, inName, unit, email, totalPrice);
    const templateParams = {
      ingredient_name: inName,
      ingredient_quantity: quantity,
      ingredient_unit: unit,
      supplier_name: name,
      supplier_email: email,
      total_price: totalPrice
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      function (response) {
        console.log('SUCCESS!', response.status, response.text);
      },
      function (error) {
        console.log('FAILED...', error);
      }
    );
  };
  const getSuppliers = async () => {
    const response = await fetch('https://dutru-kitchen.online/api/supplier', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setSuppliers(FinalData);
  };
  const getInvoiceHistory = async () => {
    const response = await fetch('https://dutru-kitchen.online/api/inventory/invoice', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setInvoiceHistory(FinalData);
  };
  const handleUpdateStatus = async (idInvoice) => {
    localStorage.setItem('idInvoice', idInvoice);
    const message = await acceptInvoice({});
    if (message.ok) {
      toast.success('Accept Successfully!', { autoClose: 1000 });
      setRefresh(true);
    } else {
      toast.error('Accept Unseccessfully!', { autoClose: 1000 });
    }
  };
  const handleUpdateStatusO2O = async (idInvoice) => {
    localStorage.setItem('idInvoice1', idInvoice);
    const message = await updateStatusO2O({});
    if (message.ok) {
      toast.success('Send Email Successfully!', { autoClose: 1000 });
      setRefresh(true);
    } else {
      toast.error('Send Email Unseccessfully!', { autoClose: 1000 });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredientObject = await createSupplier({
      name: supplierName,
      email: supplierEmail,
      phoneNumber
    });
    if (ingredientObject !== null) {
      toast.success('Create Successfully!', { autoClose: 1000 });
      setRefresh(true);
      setOpenCreateSupplier(false);
    } else {
      toast.error('Create Unseccessfully!', { autoClose: 1000 });
    }
  };
  useEffect(() => {
    if (invoiceHistory.length && !refresh) {
      return;
    }
    getSuppliers();
    getInvoiceHistory();
  }, [refresh]);

  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(false);
      }, 50);
    }
  }, [refresh]);
  return (
    <StyledPage title="Suppliers">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Suppliers
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenCreateSupplier}
          >
            Add Supplier
          </Button>
        </Stack>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={valueTab} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Supplier List" {...a11yProps(0)} />
              <Tab label="Invoice History" {...a11yProps(1)} />
              {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
            </Tabs>
          </Box>
          <TabPanel value={valueTab} index={0}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers?.map((supplier, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {supplier.name}
                      </TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phoneNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow style={{ backgroundColor: '#2087DC', color: '#fafafa' }}>
                    <TableCell style={{ color: '#fafafa', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell style={{ color: '#fafafa', fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell style={{ color: '#fafafa', fontWeight: 'bold' }}>
                      Ingredient Name
                    </TableCell>
                    <TableCell style={{ color: '#fafafa', fontWeight: 'bold' }}>
                      Invoice Price
                    </TableCell>
                    <TableCell style={{ color: '#fafafa', fontWeight: 'bold' }}>
                      Supplier Name
                    </TableCell>
                    <TableCell style={{ color: '#fafafa', fontWeight: 'bold' }}>
                      Supplier Email
                    </TableCell>
                    <TableCell style={{ color: '#fafafa', fontWeight: 'bold' }}>
                      Supplier Phone Number
                    </TableCell>
                    <TableCell style={{ color: '#fafafa', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell style={{ color: '#fafafa', fontWeight: 'bold' }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceHistory?.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {moment(item.createdAt).subtract(7, 'hours').format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {moment(item.createdAt).subtract(7, 'hours').format('HH:mm:ss')}
                      </TableCell>
                      <TableCell>{item.ingredient?.name}</TableCell>
                      <TableCell>{item.invoicePrice}</TableCell>
                      <TableCell>{item.supplier.name}</TableCell>
                      <TableCell>{item.supplier.email}</TableCell>
                      <TableCell>{item.supplier.phoneNumber}</TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="button"
                          display="block"
                          gutterBottom
                          className={
                            item.status === 'Finished'
                              ? classes.statusFinished
                              : classes.statusOnDelivery
                          }
                        >
                          {item.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          if (item.status === 'Openning') {
                            return (
                              <IconButton
                                aria-label="update"
                                onClick={() => {
                                  handleUpdateStatusO2O(item.invoceId);
                                  handleSubmitEmail(
                                    item.amount,
                                    item.ingredient.name,
                                    item.unit,
                                    item.supplier.name,
                                    item.supplier.email,
                                    item.invoicePrice
                                  );
                                }}
                                size="large"
                              >
                                <CheckIcon />
                              </IconButton>
                            );
                          }
                          if (item.status === 'On Delivery') {
                            return (
                              <IconButton
                                aria-label="update"
                                onClick={() => {
                                  handleUpdateStatus(item.invoceId);
                                }}
                                size="large"
                              >
                                <CheckIcon />
                              </IconButton>
                            );
                          }
                          return <Typography />;
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          {/* <TabPanel value={valueTab} index={2}>
            Item Three
          </TabPanel> */}
        </Box>
      </Container>
      <Modal
        open={openCreateSupplier}
        onClose={handleCloseCreateSupplier}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '30em',
              padding: '10px 20px 10px 20px',
              justifyContent: 'space-around'
            }}
            onSubmit={handleSubmit}
          >
            <Typography className={classes.title} variant="h4">
              Add new supplier
            </Typography>
            <TextField
              id="outlined-helperText"
              label="Name of Supplier"
              defaultValue=""
              required
              onChange={(e) => setSupplierName(e.target.value)}
            />
            <TextField
              id="outlined-number"
              label="Email"
              type="email"
              required
              InputLabelProps={{
                shrink: true
              }}
              onChange={(e) => setSupplierEmail(e.target.value)}
            />
            <TextField
              id="outlined-number"
              label="Phone Number"
              type="number"
              required
              InputLabelProps={{
                shrink: true
              }}
              onChange={(e) => setSupplierPhoneNumber(e.target.value)}
            />

            <Button variant="contained" type="submit">
              Create
            </Button>
            {/* <Button variant="contained" component="label">
                Upload File
                <input type="file" accept="image/*" />
              </Button> */}
          </form>
        </Box>
      </Modal>
    </StyledPage>
  );
}
