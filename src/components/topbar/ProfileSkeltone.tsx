import React from 'react'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function IdentitySkeltone() {
    return (
        <Box sx={{
            flexGrow: 0,
            m: 0, p: '0 4px',
            borderRadius: '5px',
            border: '1px dotted #999',
            borderWidth: '1px',
            display: 'flex'
        }} >
            <Skeleton variant="circular" width={40} height={40} animation="pulse" />
            <Skeleton variant="text" width={200} height={40} animation="wave" />
        </Box>
    )
}
