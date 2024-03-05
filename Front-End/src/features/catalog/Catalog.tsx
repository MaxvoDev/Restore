import ProductList from "./ProductList"
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchAllProductsAsync, productSelectors } from "./CatalogSlice";

export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const { productLoaded, status } = useAppSelector(state => state.catalog);

    useEffect(() => {
        if(!productLoaded){
            dispatch(fetchAllProductsAsync());
        }
    }, [productLoaded]);

    if(status.includes("pending")) return <LoadingComponent />

    return (
        <>
            <ProductList products={products} />
        </>
    )
}