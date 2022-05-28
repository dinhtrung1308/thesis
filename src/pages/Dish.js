import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createStyles, makeStyles, Theme, styled } from '@mui/material/styles';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import Tabs from '@mui/material/Tabs';
import moment from 'moment';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// materialimport React, { useState } from 'react';
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  Button,
  Modal,
  TextField,
  Checkbox,
  Divider,
  Autocomplete,
  FormControl
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IngredientInputList from '../components/ingredientInputList/IngredientInputList';
import dishImage from '../assets/img/pho.png';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

const PREFIX = 'Dish';

const classes = {
  createIngredientStyle: `${PREFIX}-createIngredientStyle`,
  createCategory: `${PREFIX}-createCategory`,
  title: `${PREFIX}-title`,
  ingredientGroup: `${PREFIX}-ingredientGroup`
};

const StyledPage = styled(Page)({
  [`& .${classes.createIngredientStyle}`]: {
    display: 'grid',
    gap: '40px',
    alignItems: 'center',
    boxShadow: '10px 10px 10px 10px #f4f4f4',
    height: 'max-content',
    padding: '10px 20px 10px 20px',
    justifyContent: 'space between',
    overflow: 'scroll',
    justifyItems: 'flex-start'
  },
  [`& .${classes.createCategory}`]: {
    display: 'grid',
    gap: '40px',
    alignItems: 'center',
    boxShadow: '10px 10px 10px 10px #f4f4f4',
    height: 'fit-content',
    padding: '10px 20px 10px 20px',
    justifyContent: 'space between',
    justifyItems: 'flex-start'
  },
  [`& .${classes.title}`]: {
    color: '#212B36'
  },
  [`& .${classes.ingredientGroup}`]: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around'
  }
});

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} size="large" />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));
const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: '100vh',
  overflow: 'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
const style2 = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: '50vh',
  overflow: 'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

async function createDishFunction(obj) {
  const TOKEN = sessionStorage.getItem('token');
  return fetch('http://103.116.105.48/api/dish', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}

async function createCategoryFunction(obj) {
  const TOKEN = sessionStorage.getItem('token');
  return fetch('http://103.116.105.48/api/dish/category', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
async function deleteDishFunction(obj) {
  const idDish = localStorage.getItem('idDish');
  const TOKEN = sessionStorage.getItem('token');
  return fetch(`http://103.116.105.48/api/dish/${idDish}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
function checkStatus(a, b) {
  if (!a || !b) return 'None';
  if (b <= a) {
    return 'Quick';
  }
  return 'Late';
}
function getCurrentDate() {
  const d = new Date();
  const currentDate = String(d.getDate());
  const currentMonth = String(d.getMonth() + 1);
  const currentYear = String(d.getFullYear());
  const today = currentYear.concat('/', currentMonth, '/', currentDate);
  return today;
}
export default function Dish() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [quantity, setQuantity] = useState(0.0);
  const [index, setIndex] = useState(1);
  const [startDay, setStartDay] = useState(getCurrentDate);
  const [counts, setCounts] = useState([0]);
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openCategory, setOpenCategory] = React.useState(false);
  const [optionsFilter, setOptionsFilter] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [dishDetail, setDishDetail] = useState([]);
  //   function const
  const [name, setDishName] = useState('');
  const [nameCategory, setNameCategory] = useState('');
  const [valueI, setValueI] = useState({
    ingredientId: '',
    amount: 0
  });
  const [typeName, setTypeName] = useState('');
  const [ingredientInfos, setArrayObjIngredient] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [retailPrice, setPrice] = useState(0);
  const [ingredientPrice, setIngredientPrice] = useState(0);
  const [dish, setDish] = useState([]);
  const [upDish, setUpDish] = useState('');
  const [dishIngredient, setDishIngredient] = useState([]);
  const [analysticsList, setAnalysticsList] = useState([]);
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [openSetCategory, setOpenSetCategory] = useState(false);
  const [estimatedCookingTime, setEstimatedCookingTime] = useState('');
  const [openDishRecord, setOpenDishRecord] = useState(false);
  const token = sessionStorage.getItem('token');
  const TOKEN = sessionStorage.getItem('token');
  const [valueTab, setValueTab] = React.useState('1');

  const handleChangeValueTab = (event, newValue) => {
    setValueTab(newValue);
  };
  const handleOpenDishRecord = () => setOpenDishRecord(true);
  const handleCloseDishRecord = () => {
    setOpenDishRecord(false);
    setDishDetail([]);
  };
  const handleOpenCreateCategory = () => setOpenCategory(true);
  const handleOpenCreateDish = () => setOpen(true);
  const handleOpenSetCategory = (id) => {
    console.log(id);
    setUpDish(id);
    setOpenSetCategory(true);
  };
  const handleCloseCreateDish = () => {
    setOpen(false);
    setArrayObjIngredient([]);
    setIngredientPrice(0);
    setIndex(1);
    setCounts([1]);
  };
  const handleCloseCreateCategory = () => {
    setOpenCategory(false);
    setNameCategory('');
  };
  const handleCloseSetCategory = () => {
    setUpDish('');
    setUpdatedCategory('');
    setOpenSetCategory(false);
  };
  const handleExpandClick = (idDishIngredient) => {
    console.log(idDishIngredient);
    setExpanded(!expanded);
  };
  const getDish = async () => {
    const response = await fetch(`http://103.116.105.48/api/dish?categoryName=${typeName}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setDish(FinalData);
  };
  const getDishIngredigent = async () => {
    const id = localStorage.getItem('idIndex');
    const response = await fetch(`http://103.116.105.48/api/dish/${id}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });

    const FinalData = await response.json();
    setDishIngredient(FinalData);
  };
  const getIngredients = async () => {
    const response = await fetch('http://103.116.105.48/api/inventory/ingredient', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setIngredients(FinalData);
  };
  const getAnalystics = async () => {
    const response = await fetch(
      `http://103.116.105.48/api/performance/dishes-cooking-time?start=${startDay}`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    );
    const FinalData = await response.json();
    setAnalysticsList((analysticsList) => [...analysticsList, ...FinalData]);
  };
  const getOptionsFilter = async () => {
    const response = await fetch('http://103.116.105.48/api/dish/category/get', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setOptionsFilter(FinalData);
  };

  useEffect(() => {
    if (dish.length && !refresh) {
      return;
    }
    getDish();
    getIngredients();
    getOptionsFilter();
    getAnalystics();
  }, [refresh]);
  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(false);
      }, 50);
    }
  }, [refresh]);
  //   const customInput = (counts) => {
  //     counts.map((a) => {
  //       <IngredientInputList key={a.index} item={a} />;
  //     });
  //   };
  useEffect(() => {
    if (dishIngredient.length && !refresh) {
      return;
    }
    getDishIngredigent();
  }, [refresh]);
  const handleSetCategory = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: 'Set Category' })
    };
    const response = await fetch(
      `http://103.116.105.48/api/dish/category/${updatedCategory}/${upDish}`,
      requestOptions
    );

    if (response.ok) {
      toast.success('Set Category Successfully!', { autoClose: 1000 });
      setRefresh(true);
      setOpenSetCategory(false);
      setUpDish('');
      setUpdatedCategory('');
    } else {
      toast.error('Set Category Unseccessfully!', { autoClose: 1000 });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dishObject = await createDishFunction({
      name,
      retailPrice,
      ingredientPrice,
      ingredientInfos,
      estimatedCookingTime
    });
    if (dishObject) {
      toast.success('Create Successfully!', { autoClose: 1000 });
      setRefresh(true);
      setOpen(false);
      setArrayObjIngredient([]);
    } else {
      toast.error('Create Unseccessfully!', { autoClose: 1000 });
    }
  };
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    const message = await createCategoryFunction({
      categoryName: nameCategory
    });
    if (message.ok) {
      toast.success('Create Successfully!', { autoClose: 1000 });
      setRefresh(true);
      setOpenCategory(false);
    } else {
      toast.error('Create Unseccessfully!', { autoClose: 1000 });
    }
  };
  const handleDelete = async (idDish) => {
    localStorage.setItem('idDish', idDish);
    const message = await deleteDishFunction({});
    if (message.ok) {
      toast.success('Delete Successfully!', { autoClose: 1000 });
      setRefresh(true);
    } else {
      toast.error('Delete Unseccessfully!', { autoClose: 1000 });
    }
    localStorage.removeItem('idDish');
  };
  function handleChangeIngredient(e) {
    const newdata = { ...valueI };
    if (e.target.id !== 'amount') {
      newdata.ingredientId = e.target.value;
    } else if (e.target.id === 'amount') {
      newdata.amount = +e.target.value;
    }
    console.log(newdata);
    setValueI(newdata);
  }

  const handleIncrease = () => {
    setIndex(index + 1);

    setCounts([...counts, index]);
    console.log(counts);
  };
  const handleInsert = () => {
    ingredientInfos.push(valueI);
    console.log(ingredientInfos);
  };
  const calculatePrice = () => {
    const indexArray = [];
    const amountArray = [];
    const priceArray = [];
    for (let i = 0; i < ingredientInfos.length; ) {
      indexArray[i] = ingredientInfos[i].ingredientId;
      i += 1;
    }
    for (let i = 0; i < ingredientInfos.length; ) {
      amountArray[i] = ingredientInfos[i].amount;
      i += 1;
    }
    const filteredArrayById = ingredients.filter(({ id }) => indexArray.includes(id));
    for (let i = 0; i < filteredArrayById.length; ) {
      priceArray[i] = filteredArrayById[i].priceEach;
      i += 1;
    }
    let result = 0;
    result = amountArray.reduce(function (r, a, i) {
      return r + a * priceArray[i];
    }, 0);
    let res = 0;
    res = result.toFixed(2);
    setIngredientPrice(Number(res));
  };

  return (
    <StyledPage title="Dish">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Dish
          </Typography>
          <div>
            <Button
              variant="contained"
              // component={RouterLink}
              // to="#"
              onClick={handleOpenCreateDish}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Dish
            </Button>
            <Button
              variant="contained"
              // component={RouterLink}
              // to="#"
              onClick={handleOpenCreateCategory}
              startIcon={<Iconify icon="eva:plus-fill" />}
              style={{ marginLeft: '20px' }}
            >
              New Category
            </Button>
          </div>
        </Stack>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={valueTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeValueTab} aria-label="lab API tabs example">
                <Tab label="Dish Info" value="1" />
                <Tab label="Dish Analystics" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                  {/* <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disablePortal
              options={optionsFilter.map((option) => option.name)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  variant="filled"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search'
                  }}
                />
              )}
            /> */}
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={optionsFilter?.map((option) => option.name)}
                    sx={{ width: 150 }}
                    onChange={(event, value) => {
                      if (value !== null) {
                        setTypeName(value);
                        setRefresh(true);
                      } else if (value === null) {
                        setTypeName('');
                        setRefresh(true);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                  />
                  {/* onChange={(e) => setDishName(e.target.value)} */}
                </Grid>
                {/* <Grid item xs={12} sm={12} md={12}>
                  <Divider />
                </Grid> */}

                {dish?.map((elementDish) => (
                  <Grid item xs={12} sm={6} md={3} key={elementDish.id}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardHeader title={elementDish.name} />
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'baseline',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography marginLeft={3}>
                          {'Category : '}
                          {elementDish.dishCategory === null
                            ? 'Undefined'
                            : elementDish.dishCategory.name}
                        </Typography>
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleOpenSetCategory(elementDish.id)}
                          size="large"
                        >
                          <EditIcon />
                        </IconButton>
                      </div>
                      <CardMedia component="img" height="194" image={dishImage} alt="Paella dish" />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          Price: {elementDish.retailPrice} $
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          Ingredient Price: {elementDish.ingredientPrice} $
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDelete(elementDish.id)}
                          size="large"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <ExpandMore
                          expand={expanded}
                          id={elementDish.id}
                          onClick={(event) => {
                            setActiveIndex(activeIndex === elementDish.id ? null : elementDish.id);
                            localStorage.setItem('idIndex', elementDish.id);
                            setRefresh(true);
                          }}
                          aria-expanded={expanded}
                          aria-label="show more"
                        >
                          <ExpandMoreIcon />
                        </ExpandMore>
                      </CardActions>

                      <Collapse in={activeIndex === elementDish.id} timeout="auto">
                        <CardContent>
                          <Typography variant="h4">Ingredients:</Typography>
                          {dishIngredient?.map((item, i) => (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                              }}
                              key={i}
                            >
                              <Typography paragraph>{item.ingredient.name || ''}</Typography>
                              <Typography paragraph>
                                {' '}
                                {item.amount} {item.unit}
                              </Typography>
                            </div>
                          ))}
                        </CardContent>
                      </Collapse>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value="2">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={startDay}
                  onChange={(newValue) => {
                    setStartDay(moment(newValue).format('YYYY/MM/DD'));
                    setRefresh(true);
                    setAnalysticsList([]);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">No. </TableCell>
                      <TableCell align="center">Dish Name</TableCell>
                      <TableCell align="center">Number of Orders</TableCell>
                      <TableCell align="center">Estimated Cooking Time</TableCell>
                      <TableCell align="center">Average Cooking Time</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analysticsList?.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        onClick={(index) => {
                          setDishDetail((dishDetail) => [...dishDetail, ...item.orderDish]);
                          handleOpenDishRecord(item.orderDish);
                        }}
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{item.dish.name}</TableCell>
                        <TableCell align="center">{item.amount}</TableCell>
                        <TableCell align="center">
                          {item.cookingTimeEst ? item.cookingTimeEst : 'None'}
                        </TableCell>
                        <TableCell align="center">{item.cookingTimeAvr}</TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color:
                              checkStatus(item.cookingTimeEst, item.cookingTimeAvr) === 'Quick'
                                ? 'green'
                                : 'red'
                          }}
                        >
                          {checkStatus(item.cookingTimeEst, item.cookingTimeAvr)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabContext>
        </Box>
        <Modal
          open={open}
          onClose={handleCloseCreateDish}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row-reverse'
              }}
            >
              <IconButton
                aria-label="close"
                onClick={handleCloseCreateDish}
                style={{ color: '#FE4018 ' }}
                size="large"
              >
                <CloseIcon style={{ fontWeight: '900', size: '30' }} />
              </IconButton>
            </div>
            {/* onSubmit={handleSubmit} */}
            <form
              style={{
                display: 'grid',
                gap: '40px',
                alignItems: 'center',
                boxShadow: '10px 10px 10px 10px #f4f4f4',
                height: 'max-content',
                padding: '10px 20px 10px 20px',
                justifyContent: 'space between',
                overflow: 'scroll',
                justifyItems: 'flex-start'
              }}
              onSubmit={handleSubmit}
            >
              <Typography className={classes.title} variant="h4">
                Create Dish
              </Typography>
              <TextField
                id="outlined-helperText"
                label="Name of Dish"
                fullWidth
                required
                defaultValue=""
                onChange={(e) => setDishName(e.target.value)}
              />

              {counts?.map((item, index) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'end',
                    gap: '40px',
                    width: '100%'
                  }}
                  key={index}
                >
                  <div>
                    <InputLabel id="demo-simple-select-helper-label">Ingredient</InputLabel>

                    <Select
                      id="ingredientId"
                      label="Ingredient"
                      defaultValue=""
                      onChange={(e) => handleChangeIngredient(e)}
                    >
                      {ingredients?.map((ingredient) => (
                        <MenuItem key={ingredient.id} value={ingredient.id}>
                          {ingredient.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  {/* <NumericInput
                    precision={1}
                    name="amount"
                    decimalChar="."
                    thousandChar=","
                    label="Quantity"
                    InputLabelProps={{
                      shrink: true
                    }}
                    variant="outlined"
                    onChange={(e) => handleChangeIngredient(e)}
                  /> */}
                  <TextField
                    inputProps={{ type: 'decimal' }}
                    label="Quantity"
                    id="amount"
                    InputLabelProps={{
                      shrink: true
                    }}
                    variant="outlined"
                    onChange={(e) => handleChangeIngredient(e)}
                  />
                  {/* <input
                    label="Quantity"
                    id="amount"
                    type="number"
                    step="0.01"
                    onChange={(e) => handleChangeIngredient(e)}
                  /> */}
                  <Checkbox onClick={handleInsert} />
                  <IconButton onClick={handleIncrease} size="large">
                    <AddIcon style={{ color: '#006400' }} />
                  </IconButton>
                  <IconButton onClick={() => setCounts(counts.splice(index, 1))} size="large">
                    <RemoveIcon style={{ color: '#FF4500' }} />
                  </IconButton>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  gap: '50px',
                  width: '100%'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <Typography>Total Ingredient Price: </Typography>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <Typography>{ingredientPrice}</Typography>
                    <IconButton aria-label="calculate" onClick={calculatePrice} size="large">
                      <AutorenewIcon style={{ color: '#0000CD' }} />
                    </IconButton>
                  </div>
                </div>
                <TextField
                  id="outlined-number"
                  label="Price"
                  type="number"
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Estimated Cooking Time: </Typography>
                <input
                  type="time"
                  step="1"
                  onChange={(e) => setEstimatedCookingTime(e.target.value)}
                />
              </div>

              <div style={{ width: '100%' }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ display: 'block', margin: '0 auto', width: '25%' }}
                >
                  Create
                </Button>
                {/* <Button variant="contained" onClick={handleIncrease}>
                  Add ingredient
                </Button>
                <Button variant="contained" onClick={() => setCounts(counts.splice(1))}>
                  Delete ingredient
                </Button> */}
              </div>
              {/* <Button variant="contained" component="label">
                Upload File
                <input type="file" accept="image/*" />
              </Button> */}
            </form>
          </Box>
        </Modal>
        <Modal
          open={openCategory}
          onClose={handleCloseCreateCategory}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row-reverse'
              }}
            >
              <IconButton
                aria-label="close"
                onClick={handleCloseCreateCategory}
                style={{ color: '#FE4018 ' }}
                size="large"
              >
                <CloseIcon style={{ fontWeight: '900', size: '30' }} />
              </IconButton>
            </div>
            {/* onSubmit={handleSubmit} */}
            <form className={classes.createCategory} onSubmit={handleSubmitCategory}>
              <Typography className={classes.title} variant="h4">
                Create New Category
              </Typography>
              <TextField
                id="outlined-helperText"
                label="Name of Category"
                fullWidth
                required
                defaultValue=""
                onChange={(e) => setNameCategory(e.target.value)}
              />
              <div style={{ width: '100%' }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ display: 'block', margin: '0 auto', width: '25%' }}
                >
                  Create
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
        <Modal
          open={openSetCategory}
          onClose={handleCloseSetCategory}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row-reverse'
              }}
            >
              <IconButton
                aria-label="close"
                onClick={handleCloseSetCategory}
                style={{ color: '#FE4018 ' }}
                size="large"
              >
                <CloseIcon style={{ fontWeight: '900', size: '30' }} />
              </IconButton>
            </div>
            {/* onSubmit={handleSubmit} */}
            <form className={classes.createCategory} onSubmit={handleSetCategory}>
              <Typography className={classes.title} variant="h4">
                Set Dish Category
              </Typography>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Dish Category</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  onChange={(e) => setUpdatedCategory(e.target.value)}
                  label="Dish Category"
                  defaultValue=""
                >
                  {optionsFilter?.map((option, index) => (
                    <MenuItem value={option.id} key={index}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div style={{ width: '100%' }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ display: 'block', margin: '0 auto', width: '25%' }}
                >
                  Set
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
        <Modal
          open={openDishRecord}
          onClose={handleCloseDishRecord}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Details
            </Typography>
            <Divider style={{ marginBottom: 20 }} />
            {dishDetail?.map((item, index) => (
              <Box sx={{ minWidth: 275, marginBottom: '20px' }} key={index}>
                <Card
                  variant="outlined"
                  style={{ display: 'flex', borderRadius: '0px', padding: '20px' }}
                >
                  <Grid container>
                    <Grid item xs={9}>
                      <div style={{ display: 'flex', width: '30%' }}>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                          style={{ marginRight: '10px' }}
                        >
                          Order Id:
                        </Typography>
                        <Typography> </Typography>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                          style={{ color: '#f59b42' }}
                        >
                          {item.orderDishId}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography style={{ color: '#A9A9A9	' }}>
                        {moment(item.finishCook).format('YYYY/MM/DD')}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      Amount:
                    </Grid>
                    <Grid item xs={8}>
                      {item.amount}
                    </Grid>
                    <Grid item xs={4}>
                      Cooking Time:
                    </Grid>
                    <Grid item xs={4}>
                      {item.cookingTime}
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            ))}
          </Box>
        </Modal>
      </Container>
    </StyledPage>
  );
}
