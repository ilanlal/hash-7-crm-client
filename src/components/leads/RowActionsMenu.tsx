import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface RowActionsMenuProps {
    id: string;
    handleDelete?: (id: string) => void;
    handleDuplicate?: (id: string) => void;
    handleArchive?: (id: string) => void;
}
export default function RowActionsMenu(props: RowActionsMenuProps) {
    const { id, handleDelete, handleDuplicate, handleArchive } = props;

    const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = React.useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openAnc = Boolean(anchorEl);

    const handleMenuOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        console.log('handleClose');
        setAnchorEl(null);
    };

    const handleDuplicateClick = (id:string) => {
        console.log('handleDuplicateClick', id);
        handleDuplicate && handleDuplicate(id)
        handleClose();
    };

    return (<div>
        <IconButton
            aria-label="more"
            id="row-menu-action-button"
            aria-controls={openAnc ? 'row-menu' : undefined}
            aria-expanded={openAnc ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleMenuOpenClick}
        >
            <MoreVertIcon />
        </IconButton>
        <Menu
            id="row-menu"
            MenuListProps={{
                'aria-labelledby': 'row-menu-action-button',
            }}
            anchorEl={anchorEl}
            open={openAnc}
            onClose={handleClose}
        >
            <MenuItem onClick={() => setOpenConfirmDeleteDialog(true)} disableRipple>
                <DeleteIcon sx={{m:1}}/>
                Delete
            </MenuItem>
            <MenuItem onClick={() => handleDuplicateClick(id)} disableRipple divider>
                <FileCopyIcon sx={{m:1}}/>
                Duplicate
            </MenuItem>
            <MenuItem onClick={() => handleArchive && handleArchive(id)} disableRipple>
                <ArchiveIcon sx={{m:1}}/>
                Archive
            </MenuItem>
        </Menu>
        <Dialog
            open={openConfirmDeleteDialog}
            onClose={() => {
                console.log('Close delete dialog');
                setOpenConfirmDeleteDialog(false);
            }}
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
                <Button onClick={() => {
                    console.log('Cancel delete');
                    setOpenConfirmDeleteDialog(false);
                    handleClose();
                }}>Cancel</Button>
                <Button
                    onClick={() => {
                        console.log('Confirm delete', id);
                        setOpenConfirmDeleteDialog(false);
                        handleDelete && handleDelete(id);
                    }}
                    color="warning"
                    autoFocus
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    </div>);
}