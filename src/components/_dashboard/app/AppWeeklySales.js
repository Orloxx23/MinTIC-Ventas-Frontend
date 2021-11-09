import * as React from "react";
import axios from 'axios';
import { Icon } from '@iconify/react';
import baselineSell from '@iconify/icons-ic/baseline-sell';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------


export default function AppWeeklySales() {
  const [sells, setSells] = React.useState([]);
  const [total, setTotal] = React.useState();

  const getSells = async () => {
    await axios.get('/sells').then(res => {
      setSells(res.data);
    })
  }

  React.useEffect(() => {
    getSells();
    setTotal(sells.length)
  }, [sells.length]);

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={baselineSell} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(total)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Ventas
      </Typography>
    </RootStyle>
  );
}
