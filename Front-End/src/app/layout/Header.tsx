import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import UserMenu from "./UserMenu";

interface Props{
    darkMode: boolean,
    handleThemeChange: () => void
}

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

const midLinks = [
    { title: 'catalog', path: '/catalog'},
    { title: 'about', path: '/about'},
    { title: 'contact', path: '/contact'},
]

export default function Header({darkMode, handleThemeChange}: Props) {
    const { basket } = useAppSelector(state => state.basket);
    const itemCount = basket?.items.length;

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" component={NavLink} to="/" sx={{textDecoration: 'none', ...navStyles}}>
                        RE-STORE
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} color="default" />
                </Box>

                <List sx={{ display: 'flex' }}>
                    {midLinks.map(({title, path}) => (
                        <ListItem key={path}
                        component={NavLink}
                        to={path}
                        sx={navStyles}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton component={Link} to="/basket" size="large" edge="start" color="inherit" 
                   >
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    
                    <UserMenu navStyles={navStyles}/>
                </Box>
            </Toolbar>
        </AppBar>
    )
}