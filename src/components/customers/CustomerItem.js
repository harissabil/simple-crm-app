import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Divider,
    Tooltip,
    Chip,
    Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const CustomerItem = ({ customer, onDelete }) => {
    const navigate = useNavigate();
    const { id, name, email, phone_number, registration_date } = customer;

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                }
            }}
        >
            <CardContent sx={{ p: 0 }}>
                <Box
                    sx={{
                        p: 2,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" component="h2" fontWeight="bold">
                        {name}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit Pelanggan">
                            <IconButton
                                size="small"
                                sx={{ color: 'white' }}
                                onClick={() => navigate(`/edit/${id}`)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus Pelanggan">
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    '&:hover': { color: 'error.light' }
                                }}
                                onClick={() => onDelete(id, name)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                <Box sx={{ p: 2 }}>
                    <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{email}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{phone_number}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Terdaftar: {formatDate(registration_date)}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CustomerItem;