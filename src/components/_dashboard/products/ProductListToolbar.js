import axios from 'axios';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import updateIcon from '@iconify/icons-dashicons/update';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

ProductListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  products: PropTypes.array,
  getProducts: PropTypes.func,
  showAlert: PropTypes.func,
  setSelected: PropTypes.func
};

export default function ProductListToolbar({ numSelected, filterName, onFilterName, products, getProducts, showAlert, setSelected }) {
  const deleteProducts = () => {
    const num = numSelected;
    try {
      products.map(async (product) => {
        await axios.delete(`https://mintic-ventas-backend.herokuapp.com/api/products/${product}`).then(() => {
          setSelected([]);
          getProducts();
        });
      })
      showAlert('Se han eliminado ' + num + ' productos correctamente', 'success');
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} seleccionados
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Buscar producto..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => deleteProducts()}>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Actualizar" onClick={() => getProducts()}>
          <IconButton>
            <Icon icon={updateIcon} />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
