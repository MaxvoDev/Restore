import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCardSkeleton from "./ProductSkeleton";

interface Props{
    products: Product[]
}

export default function ProductList({products}: Props) {
    const { productLoaded } = useAppSelector(state => state.catalog);

    return (
        <Grid container spacing={4}>
            {products.map((product) => (
                <Grid item xs={4}>
                    { !productLoaded ? (
                        <ProductCardSkeleton/>
                    ) : (
                        <ProductCard key={product.id} product={product} />
                    )}
                </Grid>
            ))}
        </Grid>
    )
}