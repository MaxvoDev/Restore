import { Avatar, CardMedia, CardActions, Typography, Button, Card, CardContent, CardHeader } from "@mui/material"
import { Product } from "../../app/models/product"
import { Link } from "react-router-dom"
import agent from "../../app/api/agent"
import { useState } from "react"
import { LoadingButton } from "@mui/lab"

interface Props {
    product: Product
}

export default function ProductCard({ product }: Props) {
    const [loading, setLoading] = useState(false);

    function handleAddItem(productId: number){
        setLoading(true);
        agent.Basket.addItem(productId)
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    }

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: {fontWeight: 'bold', color: 'primary.main'}
                }}
            />
            <CardMedia
                sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5">{(product.price / 100).toFixed(2)}</Typography>
                <Typography color='text.secondary'>{product.brand} / {product.type}</Typography>
            </CardContent>
            <CardActions>
                <LoadingButton loading={loading} size="small" onClick={() => handleAddItem(product.id)}>Add To Cart</LoadingButton>
                <Button size="small" component={Link} to={`/catalog/${product.id}`}>View</Button>
            </CardActions>
        </Card>
    )
}