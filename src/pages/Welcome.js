import * as React from 'react'
import axios from 'axios'
import Page from '../components/Page';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Grid,
    TextField,
    FormControl,
    Autocomplete,
    Button
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext';

export default function Welcome() {
    const { user } = React.useContext(AuthContext);

    const [products, setProducts] = React.useState([]);

    let product = useRef(null);
    let amount = useRef(null);
    let clientId = useRef(null);
    let clientName = useRef(null);

    function formatNumber(number) {
        return (
            new Intl.NumberFormat("ES-CO", {
                minimumSignificantDigits: 1,
                style: "currency",
                currency: "COP"
            }).format(number)
        );
    }

    const [sellValues, setSellValues] = React.useState({
        value: 0,
        amount: '',
        product: '0',
        date: '',
        clientId: '',
        clientName: '',
        sellerId: '',
        state: ''
    });

    const { enqueueSnackbar } = useSnackbar();

    const showAlert = (message, variant) => {
        enqueueSnackbar(message, { variant });
    };

    const handleChange = (prop) => (event) => {
        setSellValues({ ...sellValues, [prop]: event.target.value });
    };

    const changeProduct = (product) => {
        setSellValues({ ...sellValues, product: product });
    }


    const submit = async (e) => {
        e.preventDefault();
        await axios.post('https://mintic-ventas-backend.herokuapp.com/api/sells', {
            amount: sellValues.amount,
            product: sellValues.product,
            date: sellValues.date,
            clientId: sellValues.clientId,
            clientName: sellValues.clientName,
            sellerId: user.user._id,
        }).then(() => {
            setSellValues({
                value: 0,
                amount: '',
                product: '0',
                date: '',
                clientId: '',
                clientName: '',
                sellerId: '',
                state: ''
            });
            product.current.value = "";
            amount.current.value = "";
            clientId.current.value = "";
            clientName.current.value = "";
            showAlert('Nueva venta agregada', 'success');

        });
    }

    const getProducts = async () => {
        await axios.get('https://mintic-ventas-backend.herokuapp.com/api/products').then((res) => {
            setProducts(res.data);
        });
    };

    React.useEffect(() => {
        getProducts();
    }, []);

    return (
        <Page title="MinTIC2022">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Hola, ¡Bienvenido!</Typography>
                </Box>
                <Box sx={{
                    color: "white",
                    bgcolor: "#f03877",
                    borderRadius: 25,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "3vh",
                    height: "5vh"
                }}>
                    <Typography variant="h4">Gestion de ventas</Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={4}>
                            <Card sx={{ display: "flex", justifyContent: "center", }}>
                                <CardContent>
                                    <Typography variant="h2">👍 Sencillo</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Card sx={{ display: "flex", justifyContent: "center", }}>
                                <CardContent>
                                    <Typography variant="h2">😀 Fácil</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Card sx={{ display: "flex", justifyContent: "center", }}>
                                <CardContent>
                                    <Typography variant="h2">⚡ Rápido</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={5}>
                            <Card>
                                <CardContent>
                                    <Box component="form" Validate onSubmit={submit} sx={{ mt: 1 }} autoComplete="off">
                                        <Typography variant="body1">Agregar venta</Typography>
                                        <CardContent>
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
                                                            options={products}
                                                            getOptionLabel={(option) => option.description}
                                                            inputRef={product}
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
                                                        inputRef={amount}
                                                        onChange={handleChange('amount')}
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
                                                inputRef={clientId}
                                                required
                                                fullWidth
                                            />
                                            <br /><br />
                                            <TextField
                                                id="clientName"
                                                label="Nombre del cliente"
                                                variant="outlined"
                                                onChange={handleChange('clientName')}
                                                inputRef={clientName}
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
                                                required
                                                fullWidth
                                            />
                                        </CardContent>
                                        <CardActions>
                                            <Button type="submit">Agregar</Button>
                                        </CardActions>
                                    </Box>
                                    {/* <img src="/static/Captura.PNG" alt="Ventas" /> */}
                                    {/* <Link to="/ventas"><Typography variant="body">Ver o agrerar ventas</Typography></Link> */}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={7}>
                            <Card>
                                <CardContent>
                                    <img src="/static/illustrations/welcome.svg" alt="Bienvenido" />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                </Box>
            </Container>
        </Page>
    )
}
