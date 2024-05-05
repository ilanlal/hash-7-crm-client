import React, { useEffect } from 'react';
import { Alert, Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { useAccessToken } from '../providers/AccessTokenProvider';
import { PageProps } from './page.props';

export default function Login({ loading, setLoading }: PageProps) {
    const [error, setError] = React.useState<string | null>(null);
    const { currentUser, signIn } = useAccessToken();

    useEffect(() => {
        if (currentUser?.id) {
            console.log('User is already signed in.');
        }
    }, [currentUser?.id]);

    return (
        <Box sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Sign in to continue
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button color="inherit" size="small" disabled={loading || false}
                        onClick={() => {
                            try {
                                setLoading?.(true);
                                return signIn?.()
                            } catch (error) {
                                setError('Failed to sign in with Google. Please try again.');
                                setLoading?.(false);
                                return null;
                            } 
                        }} >
                        Sign In with Google
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}
