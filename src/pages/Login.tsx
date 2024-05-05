import React, { useEffect } from 'react';
import { Alert, Box, Button, Card, CardActionArea, CardActions, CardHeader } from '@mui/material';
import { useAccessToken } from '../providers/AccessTokenProvider';
import { useNavigate } from 'react-router-dom';
import { PageProps } from './page.props';

export default function Login({ loading, setLoading }: PageProps) {
    const [error, setError] = React.useState<string | null>(null);
    const { currentUser, signIn } = useAccessToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1>Login</h1>
            {error && <Alert severity="error">{error}</Alert>}
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader title="Sign In" />
                <CardActionArea>

                </CardActionArea>
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button color="inherit" size="small" disabled={false}
                        onClick={() => signIn?.()} >
                        Sign In with Google
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}
