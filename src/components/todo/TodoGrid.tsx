import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { TodoItem } from '../../types/app.crm.todo';
import { AppViewContext, AppViewModel } from '../../context';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModes, GridRowModesModel, GridSlots, GridToolbar } from '@mui/x-data-grid';
import { guidGenerator, parseToTimePeriod } from '../../utils';
import { listAll } from '../../connections/crm.todo';
import RowActionsMenu from './RowActionsMenu';
import dayjs from 'dayjs';
import { useAccessToken } from '../../providers/AccessTokenProvider';

export interface TodoGridProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export default function TodoGrid({ loading, setLoading }: TodoGridProps) {
    const columns: GridColDef<TodoItem>[] = [
        {
            field: 'id',
            type: 'string',
            headerName: '🔗',
            width: 45,
            editable: false,
            hideable: false,
            resizable: false,
            sortable: false,
            groupable: false,
            filterable: false,
            disableColumnMenu: true,
            valueFormatter: (params) => '📢',
        },
        {
            field: 'title',
            headerName: '💭 Tasks',
            width: 150,
            editable: true,
            description: 'Title of the task'
        },
        {
            field: 'dueDate',
            headerName: '🚥 Due date',
            description: 'Due date of the task',
            type: 'dateTime',
            width: 210,
            editable: true,
            valueGetter: (params) => params && new Date(dayjs(params).format('DD-MMM-YYYY hh:mm A') as string),
            //valueFormatter: (params) => params && params['value'] && dayjs(params['value']).format('DD-MMM-YYYY hh:mm A'),
            //valueSetter:(params) => params && params['value'] && dayjs(params['value']).format('DD-MMM-YYYY hh:mm A'),
        },
        {
            field: 'completed',
            headerName: '🏁',
            type: 'boolean',
            width: 90,
            editable: true,
            renderCell: (params) => {
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {params?.value ? '✅' : '⚫'}
                    </Box>
                );
            },

        },
        {
            field: 'description',
            headerName: '📑 Details',
            description: 'Details of the task',
            width: 250,
            editable: true,
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: '🟥 🟩 🟦',
            width: 120,
            align: 'center',
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            className="textPrimary"
                            onClick={handleSaveClick(id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelEditClick(id)}
                            color="inherit"
                        />
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"

                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <RowActionsMenu id={id as string}
                        handleDelete={(id) => {
                            console.log('handleDelete', id);
                            const docRef = doc(db, `users/${currentUser?.id}/todos/${id}`);
                            deleteDoc(docRef)
                                .then(() => {
                                    setRows(rows.filter((row) => row.id !== id));
                                });
                        }}
                        handleArchive={(id) => {
                            console.log('handleArchive', id);
                        }}
                        handleDuplicate={(id) => {
                            console.log('handleDuplicate', id);
                            const docRef = doc(db, `users/${currentUser?.id}/todos/${id}`);
                            // todo: duplicate the item
                            getDoc(docRef)
                                .then((response) => {
                                    const item = response.data();
                                    if (item) {
                                        const todoItem = {
                                            id: '',
                                            title: 'Copy of ' + item.title,
                                            description: item.description || null,
                                            dueDate: item.dueDate,
                                            completed: item.completed || false,
                                            createdOn: new Date(),
                                            modifiedOn: new Date()
                                        };
                                        const itemCollectionContext = collection(db, `users`, currentUser?.id || '', `todos`);

                                        addDoc(itemCollectionContext, todoItem)
                                            .then((response) => {
                                                console.log('createItem success', response);
                                                todoItem.id = response.id;
                                                setRows([...rows, todoItem]);
                                            });
                                    }
                                });
                        }}
                    />,

                ];
            },
        }
    ];
    const setLodingRef = useRef(setLoading);
    setLodingRef.current = setLoading;

    const { currentUser } = useAccessToken();

    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [rows, setRows] = React.useState<TodoItem[]>([]);
    const setRowsRef = useRef(setRows);
    setRowsRef.current = setRows;

    const handleAddClick = () => {
        const id = guidGenerator();
        // Add a new row to the grid
        setRows([...rows, { id, title: 'New Task', dueDate: null, completed: false, isNew: true }]);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleCancelEditClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: TodoItem): Promise<TodoItem> => {
        console.log('processRowUpdate', newRow);
        return new Promise((resolve, reject) => {
            if (newRow.isNew) {
                console.log('createItem', newRow);
                const todoItem = {
                    id: '',
                    title: newRow.title,
                    description: newRow.description || null,
                    dueDate: newRow.dueDate,
                    completed: newRow.completed || false,
                    timePeriod: parseToTimePeriod(newRow.dueDate),
                    createdOn: new Date(),
                    modifiedOn: new Date()
                };
                const itemCollectionContext = collection(db, `users`, currentUser?.id || '', `todos`);

                addDoc(itemCollectionContext, todoItem)
                    .then((response) => {
                        console.log('createItem success', response);
                        todoItem.id = response.id;
                        //setRows([...rows, newRow]);
                        resolve(newRow);
                    });
            }
            else if (newRow.id) {
                console.log('updateItem', newRow);
                const docRef = doc(db, `users/${currentUser?.id}/todos/${newRow.id}`);
                updateDoc(docRef, { ...newRow as any, modifiedOn: new Date() })
                    .then(() => {
                        setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
                        resolve(newRow);
                    });
            }
            else {
                reject('no action was made!')
            }
        });
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRefreshClick = () => {
        console.log('handleRefresh');
        setLoading(true);
        setRows([]);
        listAll(currentUser?.id || '').then((items) => {
            setRows(items);
        })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!currentUser?.id) {
            console.log('currentUser?.id is null');
            return;
        }
        setLodingRef.current(true);
        listAll(currentUser?.id || '').then((items) => {
            setRowsRef.current(items);
        })
            .finally(() => {
                setLodingRef.current(false);
            });
    }, [currentUser?.id]);

    return (
        <>
            <Box sx={{
                minHeight: 400,
                width: '100%',
                '& .actions': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 4,
                    '& .MuiSvgIcon-root': {
                        fontSize: 20
                    }
                },
                '& .textPrimary': {
                    color: 'warning.main',
                }
            }}>
                <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={handleAddClick}>
                        Add
                    </Button>
                    <Button size="small" onClick={handleRefreshClick}>
                        refresh
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography alignContent={'center'} variant="caption" component="span">
                        Tasks
                    </Typography>
                </Stack>
                <Box sx={{ m: '1' }}>
                    <DataGrid
                        autoHeight
                        rows={rows}
                        {...rows}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={(error) => console.error('processRowUpdate error', error)}
                        slots={
                            {
                                toolbar: GridToolbar as GridSlots['toolbar'],
                                //footer: GridFooter as GridSlots['footer'],
                                //detailPanels: GridDetailPanels as GridSlots['detailPanels'],
                            }
                        }
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true
                            }
                        }}

                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } }
                        }}
                        pageSizeOptions={[5, 15, 25]}
                    />
                </Box>
            </Box>
        </>
    )
}
