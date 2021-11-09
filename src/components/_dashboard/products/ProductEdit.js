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
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@mui/material'

export default function ProductEdit(props) {
    const [openEdit, setOpenEdit] = React.useState(false);
    const [productValues, setProductValues] = React.useState({
        description: '',
        price: 0,
        state: ''
    });

    React.useEffect(() => {
        setOpenEdit(props.openEdit);
        setProductValues(
            {
                description: props.product.description,
                price: props.product.price,
                state: props.product.state
            }
        )
    }, [props.openEdit, props.product])

    const handleClose = () => {
        props.closeEdit();
        setOpenEdit(false);
    };

    const handleChange = (prop) => (event) => {
        setProductValues({ ...productValues, [prop]: event.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        await axios.put(`products/${props.id}`, {
            description: productValues.description,
            price: productValues.price,
            state: productValues.state
        }).then(() => {
            props.showAlert('Producto editado', 'success');
            props.update();
            props.closeEdit();
        });
    };

    return (
        <div>
            <Dialog
                open={openEdit}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <Box component="form" Validate onSubmit={submit} sx={{ mt: 1 }}>
                    <DialogTitle id="alert-dialog-title">
                        Editar producto
                    </DialogTitle>
                    <DialogContent>
                        <br />
                        <TextField
                            id="description"
                            label="Descripción"
                            variant="outlined"
                            onChange={handleChange('description')}
                            multiline
                            maxRows={2}
                            defaultValue={props.product.description}
                            fullWidth
                            autoComplete="off"
                        />
                        <br /><br />
                        <TextField
                            id="price"
                            label="Precio"
                            variant="outlined"
                            onChange={handleChange('price')}
                            multiline
                            maxRows={2}
                            defaultValue={props.product.price}
                            fullWidth
                            autoComplete="off"
                            type="number"
                        />
                        <br /><br />
                        <FormControl fullWidth>
                            <InputLabel id="simple-label" required={true}>Estado</InputLabel>
                            <Select
                                labelId="simple-label"
                                id="simple-label"
                                required
                                label="Estado"
                                onChange={handleChange('state')}
                                defaultValue={props.product.state}
                            >
                                <MenuItem value="Disponible">Disponible</MenuItem>
                                <MenuItem value="No disponible">No disponible</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>Cancelar</Button>
                        <Button type="submit" autoFocus>Editar</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    )
}
