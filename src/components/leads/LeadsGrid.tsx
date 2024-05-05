import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModes, GridRowModesModel, GridSlots, GridToolbar } from '@mui/x-data-grid';
import { guidGenerator } from '../../utils';
import RowActionsMenu from './RowActionsMenu';
import { useAccessToken } from '../../providers/AccessTokenProvider';
import { PageProps } from '../../pages/page.props';
import { LeadItem } from '../../types/app.crm.leads';
import { listAllLeads } from '../../connections/crm.leads';

export default function LeadsGrid({ loading, setLoading }: PageProps) {
    const COLLECTION_NAME = 'leads';
    const columns: GridColDef<LeadItem>[] = [
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
            valueFormatter: (params) => '👂',
        },
        {
            field: 'title',
            headerName: '💭 Tasks',
            width: 150,
            editable: true,
            description: 'Title of the task'
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
                            const docRef = doc(db, `users/${currentUser?.id}/${COLLECTION_NAME}/${id}`);
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
                            const docRef = doc(db, `users/${currentUser?.id}/${COLLECTION_NAME}/${id}`);
                            // todo: duplicate the item
                            getDoc(docRef)
                                .then((response) => {
                                    const item = response.data();
                                    if (item) {
                                        const todoItem = {
                                            id: '',
                                            title: 'Copy of ' + item.title,
                                            description: item.description || null,
                                            createdOn: new Date(),
                                            modifiedOn: new Date()
                                        };
                                        const itemCollectionContext = collection(db, `users`, currentUser?.id || '', COLLECTION_NAME);

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
    const [rows, setRows] = useState<LeadItem[]>([]);
    const setRowsRef = useRef(setRows);
    setRowsRef.current = setRows;

    const handleAddClick = () => {
        const id = guidGenerator();
        // Add a new row to the grid
        setRows([...rows, { id, title: 'New Lead', isNew: true }]);
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

    const processRowUpdate = (newRow: LeadItem): Promise<LeadItem> => {
        console.log('processRowUpdate', newRow);
        return new Promise((resolve, reject) => {
            if (newRow.isNew) {
                console.log('createItem', newRow);
                const todoItem = {
                    id: '',
                    title: newRow.title,
                    description: newRow.description || null,
                    createdOn: new Date(),
                    modifiedOn: new Date()
                };
                const itemCollectionContext = collection(db, `users`, currentUser?.id || '', COLLECTION_NAME);

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
                const docRef = doc(db, `users/${currentUser?.id}/${COLLECTION_NAME}/${newRow.id}`);
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
        listAllLeads(currentUser?.id || '').then((items) => {
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
        listAllLeads(currentUser?.id || '').then((items) => {
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
