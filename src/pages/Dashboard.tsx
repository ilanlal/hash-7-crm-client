import React, { useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import TodoGrid from "../components/todo/TodoGrid";
import ContactGrid from "../components/contacts/ContactGrid";
import { useAccessToken } from "../providers/AccessTokenProvider";
import { useNavigate } from "react-router-dom";
import { PageProps } from "./page.props";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary
}));

export default function Dashboard({ loading, setLoading }: PageProps) {
    const { currentUser } = useAccessToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser]);

    return (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} columns={{ xs: 12, sm: 12 }}>
            <Grid item xs={12} sm={12}>
                <Item>
                    {currentUser?.id &&
                        <TodoGrid loading={loading} setLoading={setLoading} />
                    }
                </Item>

            </Grid>
            <Grid item xs={12} sm={12}>
                <Item>
                    {currentUser?.id &&
                        <ContactGrid loading={loading} setLoading={setLoading} />
                    }
                </Item>
            </Grid>
        </Grid>
    )
}
