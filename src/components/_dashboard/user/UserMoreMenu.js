import axios from 'axios';
import { Icon } from '@iconify/react';
import { useState, useContext } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
//
import { AuthContext } from '../../../context/AuthContext';

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState('');
  const [role, setRole] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const changeState = (event) => {
    setState(event.target.value);
  };

  const changeRole = (event) => {
    setRole(event.target.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    await axios.put(`users/${props.id}`, { state: state, role: role });
    props.getUsers();
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={() => {
          if (props.id !== user.user._id) {
            setOpen(true);
          }
        }}
      >
        <Icon icon={editFill} width={20} height={20} />
      </IconButton>
      <div>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <Box component="form" Validate onSubmit={submit} sx={{ mt: 1 }}>
            <DialogTitle>Editar</DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow id={props.id}>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {/* eslint-disable-next-line  */}
                          <Avatar alt={props.name} src={props.avatar} />
                          <Typography variant="subtitle2" noWrap>
                            {props.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              <FormControl fullWidth>
                <InputLabel id="simple-label" required={true}>Estado</InputLabel>
                <Select
                  labelId="simple-label"
                  id="simple-label"
                  value={state}
                  label="Estado"
                  onChange={changeState}
                  required={true}
                >
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="No autorizado">No autorizado</MenuItem>
                  <MenuItem value="Autorizado">Autorizado</MenuItem>
                </Select>
              </FormControl>
              <br />
              <br />
              <FormControl fullWidth>
                <InputLabel id="simple-label-2" required={true}>Rol</InputLabel>
                <Select
                  labelId="simple-label-2"
                  id="simple-label-2"
                  value={role}
                  label="Rol"
                  onChange={changeRole}
                  required={true}
                >
                  <MenuItem value="Vendedor">Vendedor</MenuItem>
                  <MenuItem value="Administrador">Administrador</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" >Cambiar</Button>
            </DialogActions>
          </Box>
        </Dialog>
      </div>
    </>
  );
}
