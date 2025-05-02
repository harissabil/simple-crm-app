import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Spinner = ({ message }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
            gap={2}
        >
            <CircularProgress color="primary" />
            {message && (
                <Typography variant="body1" color="textSecondary">
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Spinner;