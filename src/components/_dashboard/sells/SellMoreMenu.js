import axios from 'axios';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import eyeFilled from '@iconify/icons-ant-design/eye-filled';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import SellView from './SellView';
import SellEdit from './SellEdit';

// ----------------------------------------------------------------------

export default function SellMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const closeView = () => {
    setOpenView(false);
  }

  const closeEdit = () => {
    setOpenEdit(false);
  }

  const deleteSell = (id) => {
    axios.delete(`/sells/${id}`).then(() => {
      props.showAlert('Se ha eliminado correctamente', 'success');
      props.getSells();
    });
  }

  const update = () => {
    props.getSells();
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => setOpenView(true)}>
          <ListItemIcon>
            <Icon icon={eyeFilled} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Ver" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => setOpenEdit(true)}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Editar" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => deleteSell(props.id)}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Eliminar" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

      </Menu>
      <SellView openView={openView} showAlert={props.showAlert} closeView={closeView} sell={props.sell}/>
      <SellEdit openEdit={openEdit} showAlert={props.showAlert} closeEdit={closeEdit} sell={props.sell} update={update} id={props.id}/>
    </>
  );
}
