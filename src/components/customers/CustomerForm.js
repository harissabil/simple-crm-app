import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    TextField,
    Typography,
    Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import apiService from '../../services/api';
import validator from '../../utils/validator';
import AlertMessage from '../ui/AlertMessage';
import Spinner from '../ui/Spinner';

const CustomerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: ''
    });

    // Validation errors state
    const [errors, setErrors] = useState({});

    // Alert state
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Loading state
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    // Fetch customer data for edit mode
    useEffect(() => {
        if (isEditMode) {
            fetchCustomerData();
        }
    }, [id]);

    const fetchCustomerData = async () => {
        try {
            setInitialLoading(true);
            const response = await apiService.getCustomerById(id);

            if (response.success) {
                const { name, email, phone_number } = response.data;
                setFormData({ name, email, phone_number });
            } else {
                handleAlert('Customer tidak ditemukan', 'error');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            handleAlert('Gagal mengambil data customer', 'error');
        } finally {
            setInitialLoading(false);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Handle field blur for validation
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMessage = null;

        switch (name) {
            case 'name':
                errorMessage = validator.validateName(value);
                break;
            case 'email':
                errorMessage = validator.validateEmail(value);
                break;
            case 'phone_number':
                errorMessage = validator.validatePhone(value);
                break;
            default:
                break;
        }

        setErrors({
            ...errors,
            [name]: errorMessage
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const validation = validator.validateCustomerForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        try {
            setLoading(true);
            let response;

            if (isEditMode) {
                response = await apiService.updateCustomer(id, formData);
                if (response.success) {
                    handleAlert('Data pelanggan berhasil diperbarui', 'success');
                    setTimeout(() => navigate(`/`), 1500);
                }
            } else {
                response = await apiService.createCustomer(formData);
                if (response.success) {
                    handleAlert('Pelanggan baru berhasil ditambahkan', 'success');
                    setTimeout(() => navigate('/'), 1500);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            handleAlert(
                `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} data pelanggan`,
                'error'
            );
        } finally {
            setLoading(false);
        }
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

    if (initialLoading) {
        return <Spinner message="Memuat data pelanggan..." />;
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        py: 2,
                        px: 3,
                        color: 'white'
                    }}
                >
                    <Typography variant="h5" component="h1">
                        {isEditMode ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nama Pelanggan"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                required
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                required
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nomor Telepon"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(errors.phone_number)}
                                helperText={errors.phone_number}
                                placeholder="+628123456789"
                                required
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => navigate('/')}
                                    startIcon={<CancelIcon />}
                                    disabled={loading}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                >
                                    {loading
                                        ? (isEditMode ? 'Menyimpan...' : 'Menambahkan...')
                                        : (isEditMode ? 'Simpan Perubahan' : 'Tambah Pelanggan')
                                    }
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <AlertMessage
                open={alert.open}
                handleClose={handleCloseAlert}
                severity={alert.severity}
                message={alert.message}
            />
        </Container>
    );
};

export default CustomerForm;