import { Avatar, Divider, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { Person } from '../../types/gapis.contacts';

export default function PersonListItem({ person, index, onClick }: { person: Person, index: number, onClick: (person: Person) => void }) {
    const handelClick = (item: Person) => {
        onClick(item);
    }

    return (
        <>
            <ListItemButton sx={{ display: 'flex', flexGrow: 1,maxHeight:30 }}
            onClick={handelClick.bind('{0}', person)}>
                <ListItemAvatar>
                    <Avatar sx={{ width: 30, height: 30 }}
                        title={person?.resourceName}
                        alt={person?.resourceName}
                        src={person?.photos?.[0]?.url}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography
                            title={person?.names?.[0]?.displayName}
                            component="span" variant="caption" color="text.primary">
                            {person?.names?.[0]?.displayName} {person?.phoneNumbers?.[0]?.value}
                        </Typography>
                    }
                    secondary={
                        <Typography
                            sx={{ display: 'inline' }}
                            component="div"
                            variant="caption"
                            color="text.secondary">
                        </Typography>
                    }
                />
            </ListItemButton>
            <Divider variant="fullWidth" component="li" />
        </>
    )
}
