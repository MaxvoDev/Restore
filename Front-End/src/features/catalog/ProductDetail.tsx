import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    
    const [quantity, setQuantity] = useState<number>(0);
    const { basket, status } = useAppSelector(state => state.basket);

    const { status: productStatus } = useAppSelector(state => state.catalog);

    const basketItem = basket?.items.find(i => i.productId == product.id);
    
    function handleInputChange(event: any){
        if(+event.target.value > 0)
            setQuantity(event.target.value);
    }

    function handleUpdateItemQuantity(){
        if(!product) return;

        const basketItem = basket?.items.find(item => item.productId == product?.id);
        const oldQuantity = basketItem?.quantity || 0;
        const action = quantity > oldQuantity ? "ADD" : "REMOVE";
        const diffQuantity = Math.abs(quantity - oldQuantity);
        if( action == "ADD" ){
            dispatch(addBasketItemAsync({
                productId: product.id,
                quantity: diffQuantity
            }));
        }
        else{
            dispatch(removeBasketItemAsync({
                productId: product.id,
                quantity: diffQuantity
            }));
        }
        
    }

    useEffect(() => {
        if(basketItem) setQuantity(basketItem.quantity);
        if(!product){
            dispatch(fetchProductDetailAsync(+id!));
        }   
    }, [id, basketItem, dispatch, product]);

    if (productStatus.includes("pending")) return <LoadingComponent />

    if (!product) return <NotFound/>

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{ mb: 3 }}/>
                <Typography variant="h4">{`$${(product.price / 100).toFixed(2)}`}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">NAME</TableCell>
                                <TableCell align="left">{ product.name }</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">DESCRIPTION</TableCell>
                                <TableCell align="left">{ product.description }</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">BRAND</TableCell>
                                <TableCell align="left">{ product.brand }</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container mt={2} spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                        value={quantity}
                        onChange={handleInputChange}
                        fullWidth
                        type="number"
                        label="Quantity in Cart"
                        variant="outlined">
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                        onClick={handleUpdateItemQuantity}
                        loading={ status.includes("pending") }
                        sx={{ height: "55px" }}
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth>
                            UPDATE ITEM QUANTITY
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}