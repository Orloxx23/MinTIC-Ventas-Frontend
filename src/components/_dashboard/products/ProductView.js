import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

export default function ProductView(props) {
    const [openView, setOpenView] = React.useState(false);
    const formatDate = (date) => {
        const newDate = new Date(date);
        const dia = newDate.getDay();
        const mes = newDate.getMonth();
        const anio = newDate.getFullYear();
        return dia + "/" + (mes + 1) + "/" + anio;
    }

    const FormatNumber = (number) => {
        return (
            new Intl.NumberFormat("ES-CO", {
                minimumSignificantDigits: 1,
                style: "currency",
                currency: "COP"
            }).format(number)
        );
    }

    React.useEffect(() => {
        setOpenView(props.openView);
    }, [props.openView])

    const handleClose = () => {
        props.closeView();
        setOpenView(false);
    };

    const stateColor = (state) => {
        if (state === 'Disponible') {
            return 'success';
        }
        if (state === 'No disponible') {
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
                    {props.product.description}
                </DialogTitle>

                <DialogContent>
                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Chip label={props.product.state} color={stateColor(props.product.state)} variant="outlined" />
                        <Chip label={FormatNumber(props.product.price)} color="primary" variant="outlined" />
                        <Chip label={formatDate(props.product.createdAt)} color="primary" variant="outlined" />
                    </Stack>
                    {/* + ' - ' +  + ' - ' + */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
