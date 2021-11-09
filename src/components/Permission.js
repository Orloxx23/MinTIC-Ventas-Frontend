import * as React from 'react';
import { Alert, Container, Box, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

export default function Permission() {
    const { user } = React.useContext(AuthContext);
    return (
        <div>
            <Container>
                {user.user.state === 'No autorizado' ? (
                    <Alert severity="error">Tu cuenta no esta autorizada</Alert>
                ) : (
                    <Alert severity="info">Tu cuenta esta en estado pendiente</Alert>
                )}
                <br />
                <Typography variant="h2" component="div" sx={{ mx: "auto" }}>
                    Espera a que un administrador autorice tu acceso.
                </Typography>
                <Typography variant="body" component="div" sx={{ mx: "auto" }}>
                    Reinicia sesion para comprobar el estado de tu cuenta
                </Typography>
                <br />
                <Box
                    component="img"
                    src="/static/illustrations/wait.svg"
                    sx={{ width: 800, mx: "auto", my: "auto" }}
                />
            </Container>
        </div>
    )
}
