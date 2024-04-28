import { Box, List, Skeleton } from '@mui/material';
import { OtherContactsListResponse, Person } from '../../types/gapis.contacts';
import PersonListItem from './PersonListItem';


export default function ContactsPage({ page, index, onItemClick }: { page: OtherContactsListResponse, index: number, onItemClick: (person: Person) => void, }) {
    const skeleton = (
        <Box sx={{ m: 0, p: 1, display: 'flex', flexGrow: 1 }} >
            <Skeleton variant="circular" width={30} height={30} animation="pulse" sx={{ m: "0 4px" }} />
            <Skeleton variant="text" width={"100%"} height={30} animation="wave" />
        </Box>);

    return (
        <>
            <Box sx={{ m: 0, p: 1 }}>
                {page &&
                    <List component="nav" dense={true}>
                        {page?.otherContacts && page?.otherContacts?.map((person, index) => (
                            <PersonListItem person={person} index={index} onClick={onItemClick} key={"ulst_" + index} />
                        ))}
                    </List>
                }
                {!page &&
                    <>
                        {skeleton}
                        {skeleton}
                        {skeleton}
                    </>
                }
            </Box>
        </>

    )
}
