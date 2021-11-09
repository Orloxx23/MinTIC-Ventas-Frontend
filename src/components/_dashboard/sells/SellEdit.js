import * as React from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    FormControl,
    TextField,
    Typography,
    Grid,
    Autocomplete,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material'

export default function SellEdit(props) {
    const [openEdit, setOpenEdit] = React.useState(false);
    const [products, setProducts] = React.useState([]);
    const [sellValues, setSellValues] = React.useState({
        id: '',
        value: 0,
        amount: '',
        product: {},
        date: '',
        clientId: '',
        clientName: '',
        seller: {},
        state: ''
    });

    const getProducts = async () => {
        await axios.get('/products').then((res) => {
            setProducts(res.data);
        });
    };

    React.useEffect(() => {
        setOpenEdit(props.openEdit);
        setSellValues(
            {
                id: props.sell.id,
                value: props.sell.value,
                amount: props.sell.amount,
                product: props.sell.product,
                date: props.sell.date,
                clientId: props.sell.clientId,
                clientName: props.sell.clientName,
                seller: props.sell.seller,
                state: props.sell.state
            }
        )
        getProducts(() => console.log("lol"));
    }, [props.openEdit, props.sell])

    const handleClose = () => {
        props.closeEdit();
        setOpenEdit(false);
    };

    const handleChange = (prop) => (event) => {
        setSellValues({ ...sellValues, [prop]: event.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        await axios.put(`sells/${props.id}`, {
            id: sellValues.id,
            value: sellValues.value,
            amount: sellValues.amount,
            product: sellValues.product,
            date: sellValues.date,
            clientId: sellValues.clientId,
            clientName: sellValues.clientName,
            seller: sellValues.seller,
            state: sellValues.state
        }).then(() => {
            props.showAlert('Venta editada', 'success');
            props.update();
            props.closeEdit();
        });
    };

    const changeProduct = (product) => {
        setSellValues({ ...sellValues, product: product });
    }

    function formatNumber(number) {
        return (
            new Intl.NumberFormat("ES-CO", {
                minimumSignificantDigits: 1,
                style: "currency",
                currency: "COP"
            }).format(number)
        );
    }

    return (
        <div>
            <Dialog open={openEdit} onClose={handleClose} maxWidth="sm" fullWidth>
                <Box component="form" Validate onSubmit={submit} sx={{ mt: 1 }} autoComplete="off">
                    <DialogTitle>Editar venta</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2">
                            Valor total: {sellValues.product ? (
                                sellValues.product === '0' ? (
                                    '$ 0'
                                ) : (
                                    formatNumber(sellValues.product.price * sellValues.amount)
                                )
                            ) : (
                                '$ 0'
                            )}
                        </Typography>
                        <br />
                        <Grid container spacing={1}>
                            <Grid item xs={9}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        onChange={(event, newValue) => {
                                            changeProduct(newValue);
                                        }}
                                        value={sellValues.product}
                                        options={products}
                                        getOptionLabel={(option) => option.description}
                                        fullWidth
                                        renderInput={(params) => <TextField {...params} label="Producto" />}
                                        required
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="amount"
                                    type="number"
                                    label="Cantidad"
                                    variant="outlined"
                                    placeholder="0"
                                    onChange={handleChange('amount')}
                                    defaultValue={props.sell.amount}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <TextField
                            id="clientId"
                            label="Documento del cliente"
                            variant="outlined"
                            onChange={handleChange('clientId')}
                            defaultValue={props.sell.clientId}
                            required
                            fullWidth
                        />
                        <br /><br />
                        <TextField
                            id="clientName"
                            label="Nombre del cliente"
                            variant="outlined"
                            onChange={handleChange('clientName')}
                            defaultValue={props.sell.clientName}
                            required
                            fullWidth
                        />
                        <br /><br />
                        <TextField
                            id="date"
                            label="Fecha"
                            type="date"
                            onChange={handleChange('date')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={props.sell.date}
                            required
                            fullWidth
                        />
                        <br /><br />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sellValues.state}
                                label="Estado"
                                onChange={handleChange('state')}
                            >
                                <MenuItem value="Cancelada">Cancelada</MenuItem>
                                <MenuItem value="En proceso">En proceso</MenuItem>
                                <MenuItem value="Entregada">Entregada</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit">Editar</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    )
}
