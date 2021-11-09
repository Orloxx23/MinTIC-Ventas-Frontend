import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <Box
      component="img"
      src="https://cpe.ciadti.co/pluginfile.php/1/theme_moove/logo/1604358682/mision.svg"
      sx={{ width: 40, height: 40, ...sx }}
    />
  );
}
