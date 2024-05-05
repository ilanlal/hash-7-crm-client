import React, { useEffect } from 'react';
import { Alert, Box, Button, Card,  CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { useAccessToken } from '../providers/AccessTokenProvider';
import { useNavigate } from 'react-router-dom';
import { PageProps } from './page.props';

export default function Login({ loading, setLoading }: PageProps) {
    const [error, setError] = React.useState<string | null>(null);
    const { currentUser, signIn } = useAccessToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser?.id) {
            setLoading?.(false);
            navigate('/dashboard');
        }
        else {
            setLoading?.(true);
        }
    }, []);

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
                    <Button color="inherit" size="small" disabled={loading && false}
                        onClick={() => {
                            setLoading?.(true);
                            return signIn?.()
                        }} >
                        Sign In with Google
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}
