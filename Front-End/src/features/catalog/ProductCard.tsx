import React from "react";
import { Avatar, CardMedia, CardActions, Typography, Button, Card, CardContent, CardHeader } from "@mui/material";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/BasketSlice";
import { Product } from "../../app/models/product";

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const dispatch = useAppDispatch();
    const { status } = useAppSelector(state => state.basket);

    const handleAddToCart = () => {
        dispatch(addBasketItemAsync({ productId: product.id, quantity: 1 }));
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}
            />
            <CardMedia
                sx={{ height: 0, paddingTop: '56.25%', backgroundSize: 'contain', bgcolor: 'primary.light' }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                    ${(product.price / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', marginTop: 'auto', bgcolor: 'background.paper' }}>
                <LoadingButton
                    loading={status.includes("pendingAddItem" + product.id)}
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleAddToCart}
                >
                    Add To Cart
                </LoadingButton>
                <Button
                    component={Link}
                    to={`/catalog/${product.id}`}
                    variant="outlined"
                    size="small"
                    color="primary"
                >
                    View
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
