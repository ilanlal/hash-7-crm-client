import React, { useContext, useRef } from 'react'
import { AppSettingContext, AppViewContext, AppViewModel } from '../../context';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { Person } from '../../types/gapis.contacts';

export default function Person360({ person }: { person: Person }) {
  const { config } = useContext(AppSettingContext);
  const { loading, setLoading } = useContext<AppViewModel>(AppViewContext);
  const setLoadingRef = useRef(setLoading);
  setLoadingRef.current = setLoading;

  return (
    <>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        360 View
      </Typography>
      <Box sx={{ m: 1 }} />
      <Card sx={{ minWidth: 275 }}>
        <CardHeader title={person?.resourceName} subheader={"Names"} 
          action={
            <></>
          }
        />
        <CardContent>
          {person?.names?.map((name, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {name.displayName} ({name.displayNameLastFirst})
            </Typography>
          ))}
        </CardContent>

        <CardContent>
          {person?.emailAddresses?.map((email, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {email.value}
            </Typography>
          ))}
        </CardContent>
        <CardContent>
          {person?.phoneNumbers?.map((phone, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {phone.value}
            </Typography>
          ))}
        </CardContent>
      </Card>

      <Box sx={{ m: 1 }} />
    </>
  )
};