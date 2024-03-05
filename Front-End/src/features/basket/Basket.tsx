import { useState } from "react"
import { BasketItem } from "../../app/models/basket";
import agent from "../../app/api/agent";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";


export default function BasketPage() {
    const [status, setStatus] = useState<{ [key: string]: boolean }>({});
    const { basket, setBasket, removeBasketItem } = useStoreContext();

    function handleAdItem(productId: number) {
        setStatus(prevState => ({ ...prevState, ["rem" + productId]: true }));

        agent.Basket.addItem(productId)
            .then((basket) => setBasket(basket))
            .catch(err => console.log(err))
            .finally(() => setStatus(prevState => ({ ...prevState, ["rem" + productId]: false })));
    }
    function handleRemoveItem(productId: number, quantity: number) {
        setStatus(prevState => ({ ...prevState, ["rem" + productId]: true }));

        agent.Basket.removeItem(productId, quantity)
            .then(() => removeBasketItem(productId, quantity))
            .catch(err => console.log(err))
            .finally(() => setStatus(prevState => ({ ...prevState, ["rem" + productId]: false })))
    }

    function isLoading(productId: number): boolean {
        return status["rem" + productId] == true;
    }

    if (!basket) return <Typography>There is no Product in your Basket</Typography>

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket?.items.map((product: BasketItem) =>
                            <TableRow key={product.productId}>
                                <TableCell>
                                    <img width="50" src={product.pictureUrl} alt={product.name} />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>
                                    <LoadingButton loading={isLoading(product.productId)}
                                        onClick={() => handleRemoveItem(product.productId, 1)} color="error">
                                        <Remove />
                                    </LoadingButton>
                                    {product.quantity}
                                    <LoadingButton loading={isLoading(product.productId)}
                                        onClick={() => handleAdItem(product.productId)} color="primary">
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                                <TableCell>${(product.price * product.quantity / 100).toFixed(2)}</TableCell>
                                <TableCell>
                                    <LoadingButton loading={isLoading(product.productId)} onClick={() => handleRemoveItem(product.productId, product.quantity)} color="error">
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                <BasketSummary />
                    <Button
                        component={Link}
                        to="/checkout"
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        >
                            CHECK OUT
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}   