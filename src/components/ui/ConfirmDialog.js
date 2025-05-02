import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

const ConfirmDialog = ({
                           open,
                           handleClose,
                           handleConfirm,
                           title,
                           message
                       }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title || "Konfirmasi"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message || "Apakah Anda yakin ingin melakukan tindakan ini?"}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Batal
                </Button>
                <Button
                    onClick={handleConfirm}
                    color="error"
                    variant="contained"
                    autoFocus
                >
                    Konfirmasi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;