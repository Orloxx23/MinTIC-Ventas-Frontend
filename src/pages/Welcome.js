import React from 'react'
import Page from '../components/Page';

import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
} from '@mui/material';

import { Link } from "react-router-dom";

export default function Welcome() {
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
                        <Grid item xs={12} sm={7} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h2">👍 Sencillo</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={7} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h2">😀 Facil</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={7} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h2">⚡ Rapido</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={15} sm={9} md={5}>
                            <Link to="/ventas">
                                <Card component="div" sx={{ display: "flex", justifyContent: "center", }}>
                                    <CardContent>
                                        <img src="/static/captura.PNG" alt="Ventas" />
                                        {/* <Link to="/ventas"><Typography variant="body">Ver o agrerar ventas</Typography></Link> */}
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                        <Grid item xs={15} sm={9} md={7}>
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
