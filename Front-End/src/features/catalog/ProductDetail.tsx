import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Box } from "@mui/material";
import NotFound from "../../app/errors/NotFound";
import { LoadingButton } from "@mui/lab";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/BasketSlice";
import { fetchProductDetailAsync, productSelectors } from "./CatalogSlice";

export default function ProductDetail() {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const product = useAppSelector(state => productSelectors.selectById(state, +id!));
    const { basket, status: basketStatus } = useAppSelector(state => state.basket);
    const { status: productStatus } = useAppSelector(state => state.catalog);
    const item = basket?.items.find(i => i.productId === product?.id);
    const [quantity, setQuantity] = useState<number>(0);
    useEffect(() => {
        if(item)
            setQuantity(item.quantity);
        if (!product && id) 
            dispatch(fetchProductDetailAsync(parseInt(id)))
    }, [item, product, dispatch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 0) {
            setQuantity(value);
        }
    };

    const handleUpdateItemQuantity = () => {
        if (!product) return;

        const basketItem = basket?.items.find(item => item.productId === product.id);
        const oldQuantity = basketItem?.quantity || 0;
        const diffQuantity = Math.abs(quantity - oldQuantity);

        if (quantity > oldQuantity) {
            dispatch(addBasketItemAsync({ productId: product.id, quantity: diffQuantity }));
        } else {
            dispatch(removeBasketItemAsync({ productId: product.id, quantity: diffQuantity }));
        }
    };

    if (productStatus.includes("pending")) return <LoadingComponent />;
    if (!product) return <NotFound />;

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <img src={product.pictureUrl} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{ padding: 3 }}>
                    <Typography variant="h4" gutterBottom>{product.name}</Typography>
                    <Typography variant="h5" gutterBottom>${(product.price / 100).toFixed(2)}</Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Product Details</Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ marginBottom: 3 }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row">Name</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Description</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Brand</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box>
                        <TextField
                            value={quantity}
                            onChange={handleInputChange}
                            fullWidth
                            type="number"
                            label="Quantity in Cart"
                            variant="outlined"
                            InputProps={{ inputProps: { min: 0 } }}
                            sx={{ marginRight: 1 }}
                        />
                        <LoadingButton
                            onClick={handleUpdateItemQuantity}
                            loading={basketStatus.includes("pending")}
                            color="primary"
                            variant="contained"
                            size="large"
                        >
                            Update Item Quantity
                        </LoadingButton>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}
