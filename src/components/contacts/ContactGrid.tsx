import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { AppViewContext, AppViewModel } from '../../context';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModes, GridRowModesModel, GridSlots, GridToolbar } from '@mui/x-data-grid';
import { guidGenerator } from '../../utils';
import RowActionsMenu from './RowActionsMenu';
import { useUserIdentity } from '../../providers/UserIdentityProvider';
import { ContactItem } from '../../types/app.crm.contact';
import { listAllContact } from '../../connections/crm.contacts';


export default function ContactGrid({ title, onItemClick }: { title?: string, onItemClick: (item: ContactItem) => void }) {
    const COLLECTION_NAME = 'contacts';
    const columns: GridColDef<ContactItem>[] = [
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
            valueFormatter: (params) => '🤴',
        },
        {
            field: 'displayName',
            headerName: 'Name',
            width: 150,
            editable: true,
            description: 'Name of the contact'
        },
        {
            field: 'email',
            headerName: 'Email',
            description: 'Email address of the contact',
            type: 'string',
            width: 210,
            editable: true
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 250,
            flex: 1,
            editable: true
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
                            const docRef = doc(db, `users/${userIdentity?.id}/${COLLECTION_NAME}/${id}`);
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
                            const docRef = doc(db, `users/${userIdentity?.id}/${COLLECTION_NAME}/${id}`);
                            // todo: duplicate the item
                            getDoc(docRef)
                                .then((response) => {
                                    const item = response.data();
                                    if (item) {
                                        const _item = {
                                            id: '',
                                            displayName: 'Copy of ' + item.displayName,
                                            email: item.email || null,
                                            phone: item.phone,
                                            createdOn: new Date(),
                                            modifiedOn: new Date()
                                        };
                                        const itemCollectionContext = collection(db, `users`, userIdentity?.id || '', COLLECTION_NAME);

                                        addDoc(itemCollectionContext, _item)
                                            .then((response) => {
                                                console.log('createItem success', response);
                                                _item.id = response.id;
                                                setRows([...rows, _item]);
                                            });
                                    }
                                });
                        }}
                    />,

                ];
            },
        }
    ];

    const { setLoading } = useContext<AppViewModel>(AppViewContext);
    const setLodingRef = useRef(setLoading);
    setLodingRef.current = setLoading;

    const { userIdentity } = useUserIdentity();

    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [rows, setRows] = React.useState<ContactItem[]>([]);
    const setRowsRef = useRef(setRows);
    setRowsRef.current = setRows;

    const handelClick = (item: ContactItem) => {
        console.log('handelClick', item);
    };

    const handleAddClick = () => {
        const id = guidGenerator();
        // Add a new row to the grid
        setRows([...rows, { id, displayName: 'New Contact', isNew: true}]);
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

    const processRowUpdate = (newRow: ContactItem): Promise<ContactItem> => {
        console.log('processRowUpdate', newRow);
        return new Promise((resolve, reject) => {
            if (newRow.isNew) {
                console.log('createItem', newRow);
                const _item = {
                    id: '',
                    displayName: newRow.displayName,
                    email: newRow.email || null,
                    phone: newRow.phone || null,
                    createdOn: new Date(),
                    modifiedOn: new Date()
                };
                const itemCollectionContext = collection(db, `users`, userIdentity?.id || '', COLLECTION_NAME);

                addDoc(itemCollectionContext, _item)
                    .then((response) => {
                        console.log('createItem success', response);
                        _item.id = response.id;
                        //setRows([...rows, newRow]);
                        resolve(newRow);
                    });
            }
            else if (newRow.id) {
                console.log('updateItem', newRow);
                const docRef = doc(db, `users/${userIdentity?.id}/${COLLECTION_NAME}/${newRow.id}`);
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
        listAllContact(userIdentity?.id || '').then((items) => {
            setRows(items);
        })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        setLodingRef.current(true);
        listAllContact(userIdentity?.id || '').then((items) => {
            setRowsRef.current(items);
        })
            .finally(() => {
                setLodingRef.current(false);
            });
    }, [userIdentity?.id]);

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
                        {COLLECTION_NAME}
                    </Typography>
                </Stack>
                <Box sx={{ m: '1' }}>
                    <DataGrid
                        autoHeight
                        rows={rows}
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
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            }
                        }}
                        onRowClick={(params) => handelClick(params.row as ContactItem)}
                        pageSizeOptions={[5, 15, 25]}
                    />
                </Box>
            </Box>
        </>
    )
}
