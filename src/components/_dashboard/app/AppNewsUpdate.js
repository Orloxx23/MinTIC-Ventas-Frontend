import axios from 'axios';
import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import checkCircleFilled from '@iconify/icons-ant-design/check-circle-filled';
import { styled } from '@mui/material/styles';
// material
import { Box, Stack, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
// utils
//
import Scrollbar from '../../Scrollbar';

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.object.isRequired
};

function NewsItem({ news }) {
  function formatNumber(number) {
    return (
      new Intl.NumberFormat("ES-CO", {
        minimumSignificantDigits: 1,
        style: "currency",
        currency: "COP"
      }).format(number)
    );
  }

  const formatDate = (date) => {
    const newDate = new Date(date);
    const dia = newDate.getDate();
    const mes = newDate.getMonth();
    const anio = newDate.getFullYear();
    return (dia + 1) + "/" + (mes + 1) + "/" + anio;
  }

  const { id, product, value, amount, date } = news;

  const IconWrapperStyle = styled('div')(({ theme }) => ({
    color: theme.palette.success.main
  }));

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box>
        <IconWrapperStyle>
          <Icon icon={checkCircleFilled} width={24} height={24} />
        </IconWrapperStyle>
      </Box>
      <Box sx={{ minWidth: 240 }}>
        <Typography variant="subtitle2" noWrap>
          {id}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {'(x' + amount + ') ' + product.description}
        </Typography>
        <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
          {'Total: ' + formatNumber(value)}
        </Typography>
        <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
          {'Fecha: ' + formatDate(date)}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function AppNewsUpdate() {
  const [sells, setSells] = React.useState([]);

  const getSells = async () => {
    await axios.get('/sells').then(res => {
      setSells(res.data);
    })
  }

  React.useEffect(() => {
    getSells();
  }, []);


  return (
    <Card>
      <CardHeader title="Ultimas ventas entregadas" />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {sells.reverse().slice(0, 5).map((sell) => (
            sell.state === 'Entregada' ? (<NewsItem key={sell.title} news={sell} />) : ('')
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="/ventas"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Icon icon={arrowIosForwardFill} />}
        >
          Ver mas
        </Button>
      </Box>
    </Card>
  );
}
