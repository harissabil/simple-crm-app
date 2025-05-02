import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Grid,
    Paper,
    Typography,
    IconButton,
    Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';

import apiService from '../../services/api';
import AlertMessage from '../ui/AlertMessage';
import ConfirmDialog from '../ui/ConfirmDialog';
import Spinner from '../ui/Spinner';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Alert state
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        open: false
    });

    // Fetch customer data
    useEffect(() => {
        fetchCustomerData();
    }, [id]);

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            const response = await apiService.getCustomerById(id);

            if (response.success) {
                setCustomer(response.data);
            } else {
                handleAlert('Customer tidak ditemukan', 'error');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            handleAlert('Gagal mengambil data customer', 'error');
            setTimeout(() => navigate('/'), 2000);
        } finally {
            setLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    // Handle delete button click
    const handleDeleteClick = () => {
        setConfirmDialog({
            open: true
        });
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        try {
            const response = await apiService.deleteCustomer(id);

            if (response.success) {
                handleAlert('Pelanggan berhasil dihapus', 'success');
                setTimeout(() => navigate('/'), 1500);
            } else {
                handleAlert('Gagal menghapus pelanggan', 'error');
            }
        } catch (error) {
            handleAlert('Terjadi kesalahan saat menghapus pelanggan', 'error');
        } finally {
            setConfirmDialog({
                open: false
            });
        }
    };

    // Handle close confirm dialog
    const handleCloseConfirmDialog = () => {
        setConfirmDialog({
            open: false
        });
    };

    // Handle alert
    const handleAlert = (message, severity) => {
        setAlert({
            open: true,
            message,
            severity
        });
    };

    // Handle close alert
    const handleCloseAlert = () => {
        setAlert({
            ...alert,
            open: false
        });
    };

    if (loading) {
        return <Spinner message="Memuat data pelanggan..." />;
    }

    if (!customer) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Data pelanggan tidak ditemukan
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        Kembali ke Daftar Pelanggan
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 2 }}
            >
                Kembali ke Daftar Pelanggan
            </Button>

            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        py: 2,
                        px: 3,
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h5" component="h1">
                        Detail Pelanggan
                    </Typography>

                    <Box>
                        <IconButton
                            sx={{ color: 'white', mr: 1 }}
                            onClick={() => navigate(`/edit/${id}`)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            sx={{ color: 'white' }}
                            onClick={handleDeleteClick}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom>
                                {customer.name}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        Kontak
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailIcon color="primary" />
                                            <Typography>{customer.email}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon color="primary" />
                                            <Typography>{customer.phone_number}</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        Informasi Registrasi
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarTodayIcon color="primary" />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Tanggal Registrasi
                                                </Typography>
                                                <Typography>
                                                    {formatDate(customer.registration_date)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <UpdateIcon color="primary" />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Terakhir Diupdate
                                                </Typography>
                                                <Typography>
                                                    {formatDate(customer.updated_at)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Alert */}
            <AlertMessage
                open={alert.open}
                handleClose={handleCloseAlert}
                severity={alert.severity}
                message={alert.message}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={confirmDialog.open}
                handleClose={handleCloseConfirmDialog}
                handleConfirm={handleConfirmDelete}
                title="Konfirmasi Hapus"
                message={`Apakah Anda yakin ingin menghapus pelanggan "${customer.name}"?`}
            />
        </Container>
    );
};

export default CustomerDetail;