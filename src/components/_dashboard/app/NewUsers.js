import axios from 'axios';
import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
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

  const formatDate = (date) => {
    const newDate = new Date(date);
    const dia = newDate.getDate();
    const mes = newDate.getMonth();
    const anio = newDate.getFullYear();
    return (dia) + "/" + (mes + 1) + "/" + anio;
  }

  const { name, picture, createdAt } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={name}
        src={picture}
        sx={{ width: 48, height: 48, borderRadius: 1.5 }}
      />
      <Box sx={{ minWidth: 240 }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {formatDate(createdAt)}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function NewUsers() {
  const [users, setUsers] = React.useState([]);

  const getUsers = async () => {
    await axios.get('/users').then(res => {
      setUsers(res.data);
    })
  }

  React.useEffect(() => {
    getUsers();
  }, []);


  return (
    <Card>
      <CardHeader title="Ultimos usuarios" />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {users.reverse().slice(0, 5).map((user) => (
            <NewsItem key={user.title} news={user} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="/usuarios"
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
