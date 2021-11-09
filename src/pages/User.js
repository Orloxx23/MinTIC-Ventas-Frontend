import * as React from 'react';
import axios from 'axios';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import { Icon } from '@iconify/react';
import profileIcon from '@iconify/icons-vs/profile';
//
import { AuthContext } from '../context/AuthContext';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'email', label: 'Correo', alignRight: false },
  { id: 'role', label: 'Rol', alignRight: false },
  { id: 'state', label: 'Estado', alignRight: false },
  { id: 'createdAt', label: 'Creación', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const formatDate = (date) => {
    const newDate = new Date(date);
    const dia = newDate.getDate();
    const mes = newDate.getMonth();
    const anio = newDate.getFullYear();
    return dia + "/" + (mes + 1) + "/" + anio;
  }

  const { user } = React.useContext(AuthContext);
  const [users, setUsers] = React.useState([]);

  const getUsers = async () => {
    await axios.get('/users').then((res) => {
      setUsers(res.data);
    });
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  const stateColor = (state) => {
    if (state === 'Autorizado') {
      return 'success';
    }
    if (state === 'Pendiente') {
      return 'warning';
    }
    if (state === 'No autorizado') {
      return 'error';
    }
    return 'error';
  };

  const [page, setPage] = React.useState(0);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [filterName, setFilterName] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Usuarios | MinTIC2022">
      <Container>
        <Typography variant="h4" gutterBottom>
          Usuarios
        </Typography>
        <Card>
          <UserListToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            getUsers={getUsers}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>

              <Table>

                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, name, email, role, state, picture, createdAt } = row;

                      return (
                        <TableRow key={_id}>
                          <TableCell> </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={picture} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{role}</TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={stateColor(state)}>
                              {sentenceCase(state)}
                            </Label>
                          </TableCell>
                          <TableCell align="left">{formatDate(createdAt)}</TableCell>

                          <TableCell align="right">
                            {_id === user.user._id ? (
                              <IconButton>
                                <Icon icon={profileIcon} width={20} height={20} />
                              </IconButton>
                            ) : (
                              <UserMoreMenu id={_id} avatar={picture} name={name} getUsers={getUsers} />
                            )}
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
                {isUserNotFound && (
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
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
