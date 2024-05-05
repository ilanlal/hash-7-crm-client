import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardActions, CardContent, MenuItem, TextField } from '@mui/material';
import { useAccessToken } from '../providers/AccessTokenProvider';
import { PageProps } from './page.props';
import { CURRENCIES, LANGUAGES, UserSettings } from '../types/app.crm.setting';
import { updateUserSetting } from '../connections/crm.settings';

export default function Settings({ loading, setLoading }: PageProps) {
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAccessToken();
    const [currentUserSettings] = useState<UserSettings>({        
        currency: 'USD',
        language: 'en',
        id: currentUser?.id || '',
        family_name: currentUser?.family_name || '',
        given_name: currentUser?.given_name || '',
        email: currentUser?.email || '',
        picture: currentUser?.picture || '',
        locale: currentUser?.locale || '',
        name: currentUser?.name || ''
    } as UserSettings);


    useEffect(() => {
        if (!currentUser?.id) return;


        /*setLoading(true);
        getUserSetting(currentUser.id)
            .then((userSettings) => {
                setLoading(false);
                console.log('user settings', userSettings);
                if (!userSettings) return;
                currentUserSettings.currency = userSettings.currency || 'USD';
                currentUserSettings.language = userSettings.language || 'en';
            })*/

    }, [currentUser?.id]);

    return (
        <Box component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off">
            {error && <Alert severity="error">{error}</Alert>}
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Select"
                        defaultValue={currentUserSettings.currency}
                        variant='filled'
                        helperText="Please select your currency">
                        {CURRENCIES.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined-select-language"
                        select
                        label="Select"
                        defaultValue={currentUserSettings.language}
                        variant='filled'
                        helperText="Please select your language">
                        {LANGUAGES.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </CardContent>

                <CardActions>
                    <Button color="inherit" size="small" disabled={loading || false}
                        onClick={async () => {
                            try {
                                setLoading?.(true);
                                // Save settings
                                if (!currentUserSettings) return;
                                console.log('Saving settings...', currentUserSettings);
                                await updateUserSetting(currentUserSettings)
                                setLoading?.(false);
                            } catch (error) {
                                setError('Failed to save settings. Please try again.');
                                setLoading?.(false);
                            }
                        }} >
                        Save
                    </Button>
                </CardActions>
            </Card>
        </Box >
    )
}
