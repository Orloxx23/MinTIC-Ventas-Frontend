import axios from 'axios';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useSnackbar } from 'notistack';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { ProductListHead, ProductListToolbar, ProductMoreMenu } from '../components/_dashboard/products';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'description', label: 'Descripción', alignRight: false },
  { id: 'price', label: 'Precio', alignRight: false },
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
    return filter(array, (_product) => _product.description.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Products() {
  const formatDate = (date) => {
    const newDate = new Date(date);
    const dia = newDate.getDate();
    const mes = newDate.getMonth();
    const anio = newDate.getFullYear();
    return dia + "/" + (mes + 1) + "/" + anio;
  }

  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const showAlert = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const [productValues, setProductValues] = useState({
    description: '',
    price: 0,
    state: ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (prop) => (event) => {
    setProductValues({ ...productValues, [prop]: event.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('products', {
      description: productValues.description,
      price: productValues.price,
      state: productValues.state
    }).then(() => {
      showAlert('Nuevo producto agregado', 'success');
      getProducts();
      setOpen(false);
    });
  }

  const getProducts = async () => {
    await axios.get('/products').then((res) => {
      setProducts(res.data);
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const stateColor = (state) => {
    if (state === 'Disponible') {
      return 'success';
    }
    if (state === 'No disponible') {
      return 'error';
    }
    return 'error';
  };

  const trucate = (text) => {
    return text.length > 35 ? text.substring(0, 35) + "..." : text;
  }

  function FormatNumber(number) {
    return (
      new Intl.NumberFormat("ES-CO", {
        minimumSignificantDigits: 1,
        style: "currency",
        currency: "COP"
      }).format(number)
    );
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
    console.log(event);
    if (event.target.checked) {
      const newSelecteds = products.map((n) => n._id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  const filteredProducts = applySortFilter(products, getComparator(order, orderBy), filterName);

  const isProductNotFound = filteredProducts.length === 0;

  return (
    <Page title="Productos | MinTIC2022">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Productos
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleClickOpen}
          >
            Producto
          </Button>
        </Stack>

        <Card>
          <ProductListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            products={selected}
            getProducts={getProducts}
            showAlert={showAlert}
            handleSelectAllClick={handleSelectAllClick}
            setSelected={setSelected}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={products.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, description, price, state, createdAt } = row;
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
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {trucate(description)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{FormatNumber(price)}</TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={stateColor(state)}>
                              {sentenceCase(state)}
                            </Label>
                          </TableCell>
                          <TableCell align="left">{formatDate(createdAt)}</TableCell>
                          <TableCell align="right">
                            <ProductMoreMenu id={_id} getProducts={getProducts} showAlert={showAlert} product={{
                              description: description,
                              price: price,
                              state: state,
                              createdAt: createdAt
                            }}/>
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
                {isProductNotFound && (
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
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box component="form" Validate onSubmit={submit} sx={{ mt: 1 }} autoComplete="off">
          <DialogTitle>Producto</DialogTitle>
          <DialogContent>
            <br />
            <TextField
              id="description"
              label="Descripción"
              variant="outlined"
              onChange={handleChange('description')}
              multiline
              maxRows={2}
              required
              fullWidth
            />
            <br /><br />
            <TextField
              id="price"
              label="Precio"
              variant="outlined"
              onChange={handleChange('price')}
              required
              fullWidth
            />
            <br /><br />
            <FormControl fullWidth>
              <InputLabel id="state-label">Estado</InputLabel>
              <Select
                labelId="state-label"
                id="state"
                value={productValues.state}
                label="state-label"
                onChange={handleChange('state')}
                fullWidth
              >
                <MenuItem value="Disponible">Disponible</MenuItem>
                <MenuItem value="No disponible">No disponible</MenuItem>
              </Select>
            </FormControl>
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
