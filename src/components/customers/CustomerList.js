import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    TextField,
    InputAdornment,
    Divider,
    Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import apiService from '../../services/api';
import CustomerItem from './CustomerItem';
import AlertMessage from '../ui/AlertMessage';
import ConfirmDialog from '../ui/ConfirmDialog';
import Spinner from '../ui/Spinner';

const CustomerList = () => {
    const navigate = useNavigate();

    // State
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Alert state
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        id: null,
        name: ''
    });

    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Update filtered customers when customers or search query changes
    useEffect(() => {
        filterCustomers();
    }, [customers, searchQuery]);

    // Fetch customers from API
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAllCustomers();

            if (response.success) {
                setCustomers(response.data);
            } else {
                setError('Gagal mengambil data pelanggan');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Terjadi kesalahan saat mengambil data pelanggan');
        } finally {
            setLoading(false);
        }
    };

    // Filter customers based on search query
    const filterCustomers = () => {
        if (!searchQuery.trim()) {
            setFilteredCustomers(customers);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = customers.filter(
            customer =>
                customer.name.toLowerCase().includes(query) ||
                customer.email.toLowerCase().includes(query) ||
                customer.phone_number.includes(query)
        );

        setFilteredCustomers(filtered);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle delete button click
    const handleDeleteClick = (id, name) => {
        setConfirmDialog({
            open: true,
            id,
            name
        });
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        try {
            const response = await apiService.deleteCustomer(confirmDialog.id);

            if (response.success) {
                // Remove customer from state
                setCustomers(customers.filter(customer => customer.id !== confirmDialog.id));

                // Show success alert
                handleAlert('Pelanggan berhasil dihapus', 'success');
            } else {
                handleAlert('Gagal menghapus pelanggan', 'error');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            handleAlert('Terjadi kesalahan saat menghapus pelanggan', 'error');
        } finally {
            // Close confirm dialog
            setConfirmDialog({
                ...confirmDialog,
                open: false
            });
        }
    };

    // Handle close confirm dialog
    const handleCloseConfirmDialog = () => {
        setConfirmDialog({
            ...confirmDialog,
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

    // Handle refresh
    const handleRefresh = () => {
        setSearchQuery('');
        fetchCustomers();
    };

    if (loading) {
        return <Spinner message="Memuat data pelanggan..." />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleAltIcon fontSize="large" color="primary" />
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Daftar Pelanggan
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate('/add')}
                >
                    Tambah Pelanggan
                </Button>
            </Box>

            {/* Search & Action Bar */}
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <TextField
                    placeholder="Cari pelanggan..."
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ maxWidth: { sm: '60%', md: '40%' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleRefresh}
                        size="medium"
                    >
                        Refresh
                    </Button>
                </Box>
            </Paper>

            {/* Error message */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {/* Customer Grid */}
            {filteredCustomers.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredCustomers.map(customer => (
                        <Grid item xs={12} sm={6} md={4} key={customer.id}>
                            <CustomerItem
                                customer={customer}
                                onDelete={handleDeleteClick}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 2
                    }}
                >
                    {searchQuery ? (
                        <Typography>
                            Tidak ditemukan pelanggan dengan kata kunci "{searchQuery}"
                        </Typography>
                    ) : (
                        <Typography>
                            Belum ada data pelanggan. Silakan tambahkan pelanggan baru.
                        </Typography>
                    )}
                </Paper>
            )}

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
                message={`Apakah Anda yakin ingin menghapus pelanggan "${confirmDialog.name}"?`}
            />
        </Container>
    );
};

export default CustomerList;