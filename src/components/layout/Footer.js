import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.grey[100]
            }}
        >
            <Divider />
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <Typography variant="body2" color="text.secondary" align="center">
                        SimpleCRM - Sistem Manajemen Data Pelanggan
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {currentYear} SimpleCRM
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;