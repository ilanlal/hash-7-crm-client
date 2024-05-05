import React, { } from "react";
import { Grid, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useAccessToken } from "../providers/AccessTokenProvider";
import { PageProps } from "./page.props";
import CustomersGrid from "../components/customers/CustomersGrid";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary
}));

export default function Customers({ loading, setLoading}: PageProps) {
    const { currentUser } = useAccessToken();

    return (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} columns={{ xs: 12, sm: 12 }}>
            <Grid item xs={12} sm={12}>
                <Item>
                    {currentUser?.id && 
                        <CustomersGrid loading={loading} setLoading={setLoading} />
                    }
                </Item>

            </Grid>
        </Grid>
    )
}
