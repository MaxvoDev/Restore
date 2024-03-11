import ProductList from "./ProductList"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors, setProductParams } from "./CatalogSlice";
import { Grid } from "@mui/material";
import ProductSearch from "./ProductSearch";
import ProductFilter from "./ProductFilter";
import AppPagination from "../../app/components/AppPagination";
import LoadingComponent from "../../app/layout/LoadingComponent";


export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const { productLoaded, metaData, filterLoaded } = useAppSelector(state => state.catalog);

    useEffect(() => {
        if (!productLoaded)
            dispatch(fetchProductsAsync());
    }, [productLoaded, fetchProductsAsync]);

    if(!productLoaded && !filterLoaded) return <LoadingComponent message="Loading Products..."/>

    return (
        <Grid container>
            <Grid item xs={3}>
                <ProductSearch />
                <ProductFilter />
            </Grid>
            <Grid item xs={9} sx={{ p: 3 }}>
                <ProductList products={products} />
                {
                    metaData && (
                        <AppPagination
                            name="pageNumber"
                            metaData={metaData}
                            onChange={(e) => dispatch(setProductParams(e))}
                        />
                    )
                }
            </Grid>
        </Grid>
    )
}