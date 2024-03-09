import { List, ListItem } from "@mui/material";
import { NavLink } from "react-router-dom";

const userMenu = [
    {
        title: 'Sign In',
        path: '/signin'
    },
    {
        title: 'Sign Up',
        path: '/signup'
    }
]

const navStyles = {
    color: 'inherit',
    typography: 'h6',
    '&:hover': {
        color: 'grey.500'
    },
    '&:active': {
        color: 'text.secondary'
    }
}

export default function UserMenu() {
    return (
        <List sx={{ display: 'flex' }}>
            {userMenu.map(({ title, path }) => (
                <ListItem key={path}
                    component={NavLink}
                    to={path}
                    sx={navStyles}
                >
                    {title.toUpperCase()}
                </ListItem>
            ))}
        </List>
    )
}