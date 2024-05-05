import React, { } from 'react';
import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteItemAction({
    onConfirm,
    ...props
}: ButtonProps & { onConfirm: () => void }) {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <Button  {...props} startIcon={<DeleteIcon />} onClick={() => setOpen(true)}>
                Delete
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete this item?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            onConfirm();
                        }}
                        color="warning"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}