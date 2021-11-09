// material
import { Box, Grid, Container, Typography } from '@mui/material';
import NewUsers from 'src/components/_dashboard/app/NewUsers';
// components
import Page from '../components/Page';
import {
  AppNewUsers,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Tablero | MinTIC2022">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Tablero</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7} md={4}>
            <AppItemOrders />
          </Grid>
          <Grid item xs={12} sm={7} md={4}>
            <AppWeeklySales />
          </Grid>
          <Grid item xs={12} sm={7} md={4}>
            <AppNewUsers />
          </Grid>

          <Grid item xs={8} >
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={4} >
            <NewUsers />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
