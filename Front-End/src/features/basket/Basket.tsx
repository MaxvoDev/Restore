import {useEffect, useState} from "react"
import { Basket, BasketItem } from "../../app/models/basket";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

export default function BasketPage(){
    const [loading, setLoading] = useState(true);
    const [basket, setBasket] = useState<Basket | null>(null);

    useEffect(() => {
        agent.Basket.get()
        .then((basket) => setBasket(basket))
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }, []);
    
    if(loading) return <LoadingComponent />
    if(!basket) return <Typography>There is no Product in your Basket</Typography>

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { basket?.items.map((product: BasketItem) => 
                        <TableRow key={product.productId}>
                            <TableCell>
                                <img width="50" src={product.pictureUrl} alt={product.name} />
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{(product.price / 100).toFixed(2)}</TableCell>
                            <TableCell>{(product.price * product.quantity/ 100).toFixed(2)}</TableCell>
                            <TableCell>
                                <IconButton color="error">
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}