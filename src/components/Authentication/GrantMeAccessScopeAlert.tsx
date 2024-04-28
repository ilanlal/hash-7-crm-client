import React, { useRef } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'

export interface GrantMeAccessScopeAlertProps {
    scope: string;
    resion: string;
    severity: 'info' | 'warning' | 'error' | 'success';
    variant: 'standard' | 'filled' | 'outlined';
    onRefreshClick: () => void;
    onSigninClick: () => void;
}

export default function GrantMeAccessScopeAlert({
    scope,
    resion,
    severity,
    variant,
    onRefreshClick,
    onSigninClick
}: GrantMeAccessScopeAlertProps) {
    //const { scriptLoadedSuccessfully } = useGoogleOAuth();
    const severityRef = useRef(severity);
    severityRef.current = severity;

    const variantRef = useRef(variant);
    variantRef.current = variant;

    const [message, setMessage] = React.useState<string>(resion);
    const setMessageRef = React.useRef(setMessage);
    setMessageRef.current = setMessage;

    const scopeRef = useRef(scope);
    scopeRef.current = scope;

    return (
        <Alert
            severity={severity}
            variant={variant}
            action={
                <Button color="inherit" size="small" disabled={false}
                    onClick={onSigninClick}>
                    Grant Access
                </Button>}
            sx={{ display: (severity !== 'success' ? 'block' : 'none') }} >
            <Box sx={{ display: 'block', wordBreak: 'break-word' }}>
                <Typography variant="caption" component="span" fontSize={'12px'}>
                    {message}
                </Typography>
                <br />
                <Typography variant="caption" component="span" fontSize={'11px'}>
                    {scope}
                </Typography>
            </Box>
        </Alert>
    )
}