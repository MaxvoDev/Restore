import { List, ListItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/basket/AccountSlice";
import { NavLink } from "react-router-dom";

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

const userMenu = [
    {
        title: 'Sign In',
        path: '/signin'
    }
]

export default function UserMenu() {
    const { user } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    async function handleSignout() {
        await dispatch(signOut({}));
    }

    return (
        <>
            {user ? (
                <List sx={{ display: 'flex' }}>
                    <ListItem
                        sx={navStyles}
                    >
                        {user?.email}
                    </ListItem>

                    <ListItem
                        sx={navStyles}
                        onClick={() => handleSignout()}
                    >
                        Sign Out
                    </ListItem>
                </List>
            ) : (
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
            )}
        </>
    )
}