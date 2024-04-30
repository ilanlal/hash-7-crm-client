import React, { } from "react";
import { Grid, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import { TodoItem } from "../../types/app.crm.todo";
import TodoGrid from "../todo/TodoGrid";
import { useUserIdentity } from "../../providers/UserIdentityProvider";
import ContactGrid from "../contacts/ContactGrid";
import { ContactItem } from "../../types/app.crm.contact";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary
}));

export default function Dashboard() {
    const { userIdentity } = useUserIdentity();
    return (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} columns={{ xs: 12, sm: 12 }}>
            <Grid item xs={12} sm={12}>
                <Item>
                    {userIdentity && userIdentity.id &&
                        <TodoGrid onItemClick={(item: TodoItem) => { }} />
                    }
                </Item>

            </Grid>
            <Grid item xs={12} sm={12}>
                <Item>
                    {userIdentity && userIdentity.id &&
                        <ContactGrid onItemClick={(item: ContactItem) => { }} />
                    }
                </Item>

            </Grid>
        </Grid>
    )
}
