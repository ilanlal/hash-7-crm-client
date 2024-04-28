import { useContext, useRef, useState } from "react";
import { AppViewContext, AppViewModel } from "../../context";
import { Box, Paper, Typography } from "@mui/material";
import Person360 from "./Person360";
import { OtherContactsListResponse, Person } from "../../types/gapis.contacts";
import ContactsPage from "./ContactsPage";

export default function ContactHome() {
    const { setLoading } = useContext<AppViewModel>(AppViewContext);
    const setLoadingRef = useRef(setLoading);
    setLoadingRef.current = setLoading;
    const [totalItems] = useState(0);
    const [pages] = useState<[OtherContactsListResponse]>();
    const [selectedPage] = useState<OtherContactsListResponse | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const [selectedItem, setSelectedItem] = useState<Person | null>(null);

    const onItemClick = (item: Person) => {
        console.log('onSelectedClick', item);
        setSelectedItem(prev => prev?.resourceName === item.resourceName ? null : item)
    };
    return (
        <>
            <Box sx={{ display: 'flex', flexGrow: 0 }} ref={ref}>
                <Paper elevation={2}>
                    <Typography variant="caption" component="span">
                        pages: {pages && `(${pages.length})`}, contact: {`(${totalItems})`}
                    </Typography>
                    {selectedPage &&
                        <ContactsPage page={selectedPage} index={0} onItemClick={onItemClick} />
                    }
                    
                </Paper>

                <Paper elevation={2} sx={{ p: 1, m: 'auto', flexGrow: 0, position: 'fixed', top: '55px', right: '8px' }}>
                    {selectedItem && <Person360 person={selectedItem} />}
                </Paper>

                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    <Typography variant="caption" component="span">
                        Total: {`${totalItems}`}
                    </Typography>
                </Paper>
            </Box>

        </>)
}