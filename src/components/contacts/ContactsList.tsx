import React, { } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Person } from '../../types/gapis.contacts';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import AddTaskIcon from '@mui/icons-material/AddTask';

export default function ContactsList({ onItemClick }: { onItemClick: (item: Person) => void, }) {
    const [items] = React.useState<Person[]>([]);

    const handelClick = (item: Person) => {
        console.log('handelClick', item);
        onItemClick(item);
    };

    return (
        <Card>
            <CardHeader title="Contacts" subheader="Contact list">
            </CardHeader>
            <CardContent>
                <List aria-label="contact list">
                    <List dense aria-label="main starred folders">
                        {items.map((person, index) => {
                            const labelId = `todo-checkbox-list-label-${index}`;

                            return (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <>
                                            <IconButton edge="start" aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="close">
                                                <AddTaskIcon />
                                            </IconButton>
                                        </>
                                    }
                                    disablePadding
                                >
                                    <ListItemButton role={undefined} onClick={handelClick.bind('{0}', person)}>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={person?.names[0]?.displayName} secondary={'📞 ' + person?.phoneNumbers?.[0]?.value} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </List>
            </CardContent>
            <CardActions>
                <Button size="small">Add</Button>
                <Button size="small">Sync</Button>

            </CardActions>
        </Card>

    )
}
