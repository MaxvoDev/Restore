import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import { LoadingButton } from "@mui/lab";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStoreContext } from "../../app/context/StoreContext";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState<number>(0);
    const { basket, setBasket, removeBasketItem } = useStoreContext();

    function handleInputChange(event: any){
        if(+event.target.value > 0)
            setQuantity(event.target.value);
    }

    function handleUpdateItemQuantity(){
        if(!product) return;

        setLoading(true);
        const basketItem = basket?.items.find(item => item.productId == product?.id);
        const oldQuantity = basketItem?.quantity || 0;
        const action = quantity > oldQuantity ? "ADD" : "REMOVE";
        const diffQuantity = Math.abs(quantity - oldQuantity);
        if( action == "ADD" ){
            agent.Basket.addItem(product.id, diffQuantity)
            .then((basket) => setBasket(basket))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
        }
        else{
            agent.Basket.removeItem(product.id, diffQuantity)
            .then((basket) => setBasket(basket))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
        }
        
    }

    useEffect(() => {
        id && agent.Catalog.details(+id)
            .then(product => {
                setProduct(product);
                const basketItem = basket?.items.find(item => item.productId == product.id);
                if(!basketItem) 
                    setQuantity(0);
                else 
                    setQuantity(basketItem.quantity);
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [id])

    if (loading) return <LoadingComponent />

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
                        loading={loading}
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