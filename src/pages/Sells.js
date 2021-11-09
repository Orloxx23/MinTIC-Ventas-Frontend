import axios from 'axios';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useContext } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  FormControl,
  Grid,
  Autocomplete
} from '@mui/material';
import { useSnackbar } from 'notistack';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { SellListHead, SellListToolbar, SellMoreMenu } from '../components/_dashboard/sells';
//
import { AuthContext } from '../context/AuthContext';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'value', label: 'Valor total', alignRight: false },
  { id: 'state', label: 'Estado', alignRight: false },
  { id: 'date', label: 'Fecha', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_sell) => _sell.id.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Sells() {
  const { user } = useContext(AuthContext);

  const formatDate = (date) => {
    const newDate = new Date(date);
    const dia = newDate.getDate();
    const mes = newDate.getMonth();
    const anio = newDate.getFullYear();
    return (dia + 1) + "/" + (mes + 1) + "/" + anio;
  }

  const [sells, setSells] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const showAlert = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };



  const [sellValues, setSellValues] = useState({
    value: 0,
    amount: '',
    product: '0',
    date: '',
    clientId: '',
    clientName: '',
    sellerId: '',
    state: ''
  });

  const handleClickOpen = () => {
    getProducts();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSellValues({ ...sellValues, product: '0' });
  };

  const handleChange = (prop) => (event) => {
    setSellValues({ ...sellValues, [prop]: event.target.value });
  };

  const changeProduct = (product) => {
    setSellValues({ ...sellValues, product: product });
  }

  const submit = async (e) => {
    e.preventDefault();

    await axios.post('sells', {
      amount: sellValues.amount,
      product: sellValues.product,
      date: sellValues.date,
      clientId: sellValues.clientId,
      clientName: sellValues.clientName,
      sellerId: user.user._id,
    }).then(() => {
      setSellValues({ ...sellValues, product: '0' });
      showAlert('Nueva venta agregada', 'success');
      getSells();
      setOpen(false);
    });
  }

  const getSells = async () => {
    await axios.get('/sells').then((res) => {
      setSells(res.data);
    });
  };

  const getProducts = async () => {
    await axios.get('/products').then((res) => {
      setProducts(res.data);
    });
  };

  useEffect(() => {
    getSells();
  }, []);

  const stateColor = (state) => {
    if (state === 'Entregada') {
      return 'success';
    }
    if (state === 'En proceso') {
      return 'info';
    }
    if (state === 'Cancelada') {
      return 'error';
    }
    return 'error';
  };


  function formatNumber(number) {
    return (
      new Intl.NumberFormat("ES-CO", {
        minimumSignificantDigits: 1,
        style: "currency",
        currency: "COP"
      }).format(number)
    );
  }

  const trucate = (text) => {
    return text.length > 35 ? text.substring(0, 35) + "..." : text;
  }

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('date');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sells.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sells.length) : 0;

  const filteredSells = applySortFilter(sells, getComparator(order, orderBy), filterName);

  const isSellNotFound = filteredSells.length === 0;

  return (
    <Page title="Ventas | MinTIC2022">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Ventas
          </Typography>
          <Button
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleClickOpen}
          >
            Venta
          </Button>
        </Stack>

        <Card>
          <SellListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            sells={selected}
            getSells={getSells}
            showAlert={showAlert}
            handleSelectAllClick={handleSelectAllClick}
            setSelected={setSelected}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SellListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={sells.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredSells
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, id, value, state, date, amount, product, clientId, clientName, sellerId } = row;
                      const isItemSelected = selected.indexOf(_id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, _id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Stack alignItems="left" spacing={0}>
                              <Typography variant="subtitle2" noWrap>
                                {id}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                {trucate(product.description)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{formatNumber(value)}</TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={stateColor(state)}>
                              {sentenceCase(state)}
                            </Label>
                          </TableCell>
                          <TableCell align="left">{formatDate(date)}</TableCell>
                          <TableCell align="right">
                            <SellMoreMenu id={_id} getSells={getSells} showAlert={showAlert} sell={{
                              id: id,
                              value: value,
                              amount: amount,
                              product: product,
                              date: date,
                              clientId: clientId,
                              clientName: clientName,
                              sellerId: sellerId,
                              state: state
                            }} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isSellNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sells.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box component="form" Validate onSubmit={submit} sx={{ mt: 1 }} autoComplete="off">
          <DialogTitle>Venta</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Valor total: {sellValues.product ? (
                sellValues.product === '0' ? (
                  '$ 0'
                ) : (
                  formatNumber(sellValues.product.price * sellValues.amount)
                )
              ) : (
                '$ 0'
              )}
            </Typography>
            <br />
            <Grid container spacing={1}>
              <Grid item xs={9}>
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    onChange={(event, newValue) => {
                      changeProduct(newValue);
                    }}
                    options={products}
                    getOptionLabel={(option) => option.description}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Producto" />}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="amount"
                  type="number"
                  label="Cantidad"
                  variant="outlined"
                  placeholder="0"
                  onChange={handleChange('amount')}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
            <br />
            <TextField
              id="clientId"
              label="Documento del cliente"
              variant="outlined"
              onChange={handleChange('clientId')}
              required
              fullWidth
            />
            <br /><br />
            <TextField
              id="clientName"
              label="Nombre del cliente"
              variant="outlined"
              onChange={handleChange('clientName')}
              required
              fullWidth
            />
            <br /><br />
            <TextField
              id="date"
              label="Fecha"
              type="date"
              onChange={handleChange('date')}
              InputLabelProps={{
                shrink: true,
              }}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Agregar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Page>

  );
}
