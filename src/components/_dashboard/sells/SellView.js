import * as React from 'react';

import axios from 'axios';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { Icon } from '@iconify/react';
import downOutlined from '@iconify/icons-ant-design/down-outlined';

export default function ProductView(props) {
    const [openView, setOpenView] = React.useState(false);
    const formatDate = (date) => {
        const newDate = new Date(date);
        const dia = newDate.getDate();
        const mes = newDate.getMonth();
        const anio = newDate.getFullYear();
        return (dia + 1) + "/" + (mes + 1) + "/" + anio;
    }

    const formatNumber = (number) => {
        return (
            new Intl.NumberFormat("ES-CO", {
                minimumSignificantDigits: 1,
                style: "currency",
                currency: "COP"
            }).format(number)
        );
    }

    const [disponible, setDisponible] = React.useState([]);
    const getProduct = async (id) => {
        await axios.get(`products/${id}`).then((res) => {
            setDisponible(res.data.state)
        });
    };

    const [seller, setSeller] = React.useState([]);
    const getSeller = async (id) => {
        await axios.get(`users/${id}`).then((res) => {
            setSeller(res.data.name);
        });
    };

    React.useEffect(() => {
        getProduct(props.sell.product._id);
        getSeller(props.sell.sellerId);
        setOpenView(props.openView);
    }, [props.openView, props.sell.product._id, props.sell.sellerId])

    const handleClose = () => {
        props.closeView();
        setOpenView(false);
    };

    const stateColor = (state) => {
        if (state === 'Entregada' || state === 'Disponible') {
            return 'success';
        }
        if (state === 'En proceso') {
            return 'info';
        }
        if (state === 'Cancelada' || state === 'No disponible') {
            return 'error';
        }
        return 'error';
    };

    return (
        <div>
            <Dialog
                open={openView}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    {props.sell.id}
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body2">Producto</Typography>
                    <Grid container spacing={0}>
                        <Grid item xs={9}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<Icon icon={downOutlined} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{props.sell.product.description}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                    >
                                        <Chip label={'Precio: ' + formatNumber(props.sell.product.price)} color="primary" variant="outlined" />
                                        <Chip label={disponible} color={stateColor(disponible)} />
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid item xs={2}>
                            <br />
                            <Typography variant="body2">{'Cantidad: ' + props.sell.amount}</Typography>
                        </Grid>
                    </Grid>
                    <br />
                    <Typography variant="body2">Cliente</Typography>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography variant="h4">{props.sell.clientName}</Typography>
                        <Typography variant="body2">ID: {props.sell.clientId}</Typography>
                    </Stack>
                    <br />
                    <Typography variant="caption">Venta</Typography>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={0.5}
                    >
                        <Chip label={props.sell.state} color={stateColor(props.sell.state)} variant="outlined" />
                        <Chip label={'Total: ' + formatNumber(props.sell.value)} color="primary" variant="outlined" />
                        <Chip label={'Fecha: ' + formatDate(props.sell.date)} color="primary" variant="outlined" />
                        <Chip label={'Vendedor: ' + seller} color="primary" variant="outlined" />

                    </Stack>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}
