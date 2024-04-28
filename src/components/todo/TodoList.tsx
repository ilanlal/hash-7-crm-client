import { Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import RestoreIcon from '@mui/icons-material/Restore';
import { Task as TaskIcon } from '@mui/icons-material';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { TodoItem } from '../../types/app.crm.todo';
import { AppDataContext, AppViewContext, AppViewModel } from '../../context';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AppDataModel } from '../../types/app';
import dayjs from 'dayjs';
import { listAll } from '../../connections/crm.todo';


export default function TodoList({ onItemClick }: { onItemClick: (item: TodoItem) => void, }) {
    const { setLoading } = useContext<AppViewModel>(AppViewContext);
    const setLodingRef = useRef(setLoading);
    setLodingRef.current = setLoading;

    const { userIdentity } = useContext<AppDataModel>(AppDataContext);
    const [open, setOpen] = useState(false);

    const [rows, setRows] = React.useState<TodoItem[]>([]);
    const setRowsRef = useRef(setRows);
    setRowsRef.current = setRows;
    const itemCollectionContext = collection(db, `users`, userIdentity?.id || '', `todos`);

    const handelClick = (item: TodoItem) => {
        console.log('handelClick', item);
        onItemClick(item);
    };

    const newItem = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const createItem = (item: TodoItem) => {
        console.log('createItem', item);
        addDoc(itemCollectionContext, item);
        setRows([...rows, item]);
    };

    const setCompleted = (item: TodoItem) => {
        console.log('setCompleted', item);

        if (!item?.id) return;
        const docRef = doc(db, `users`, userIdentity?.id || '', `todos`, item?.id);
        const completed = !item.completed;

        updateDoc(docRef, { completed: completed })
            .then(() => {
                setRowsRef.current(rows.map((i) => {
                    if (i.id === item.id) {
                        return {
                            ...i,
                            completed: completed
                        };
                    }
                    return i;
                }));
            });
    };

    useMemo(() => {
        listAll(userIdentity?.id || '')
            .then((response) => {
                setRowsRef.current(response);
            });
    }
        , [userIdentity?.id]);
    return (
        <>
            <Card>
                <CardHeader title="To do" subheader="Tasks list">
                </CardHeader>
                <CardContent>
                    <List dense aria-label="to do list">
                        {rows.map((item, index) => {
                            const labelId = `todo-checkbox-list-label-${index}`;

                            return (
                                <ListItem
                                    key={index}
                                    secondaryAction={item.completed ?
                                        <IconButton edge="end" aria-label="close" onClick={setCompleted.bind('0', item)}>
                                            <RestoreIcon />
                                        </IconButton>
                                        :
                                        <>
                                            <IconButton edge="start" aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="close" onClick={setCompleted.bind('0', item)}>
                                                <VerifiedIcon />
                                            </IconButton>
                                        </>
                                    }
                                    disablePadding
                                >
                                    <ListItemButton role={undefined} onClick={handelClick.bind('{0}', item)}>
                                        <ListItemIcon>
                                            <TaskIcon />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={item.title}
                                            secondary={item.completed ? '✅ Completed' :
                                                '⏰ ' + dayjs(item.dueDate).format('DD-MMM-YYYY hh:mm A') 
                                            } />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </CardContent>
                <CardActions>
                    <Button variant="outlined" size="small" onClick={newItem}>New</Button>
                </CardActions>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());

                        console.log(formJson);
                        createItem({
                            title: formJson.title,
                            dueDate: formJson.dueDate ? new Date(formJson.dueDate) : undefined,
                            createdOn: new Date(),
                            completed: false
                        });
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a new task, please enter the title here.
                    </DialogContentText>
                    <TextField autoFocus required
                        margin="dense"
                        id="title"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <DateTimePicker
                        name="dueDate"
                        label="Due Date" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
