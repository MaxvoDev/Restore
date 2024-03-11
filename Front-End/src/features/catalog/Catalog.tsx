import ProductList from "./ProductList"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors, setProductParams } from "./CatalogSlice";
import { Grid, Pagination, Stack } from "@mui/material";
import ProductSearch from "./ProductSearch";
import ProductFilter from "./ProductFilter";


export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const { productParams, productLoaded, metaData} = useAppSelector(state => state.catalog);

    useEffect(() => {
        if (!productLoaded)
            dispatch(fetchProductsAsync());
    }, [productLoaded, fetchProductsAsync]);

    function handleChangeParam(param: { name: string, value: string, checked: boolean }) {
        const {name, value, checked} = param;
        let payload;

        if (name == "orderBy" || name == "searchTerm") {
            payload = {
                [name]: value,
                pageNumber: 1
            };
        }
        else if (name == "brands" || name == "types") {
            payload = {
                [name]: [...productParams[name]!],
                pageNumber: 1
            }
            const items = payload[name] as string[];
            if (checked)
                items.push(value);
            else {
                const index = items.indexOf(value);
                if (index > -1) items.splice(index, 1);
            }
        }
        else
            payload = { pageNumber: +value }

        dispatch(setProductParams(payload));
    }
    
    return (
        <Grid container>
            <Grid item xs={3}>
                <ProductSearch />
                <ProductFilter onChangeParam={(param) => handleChangeParam(param)} />
            </Grid>
            <Grid item xs={9} sx={{ p: 3 }}>
                <ProductList products={products} />
                {
                    metaData && (
                        <Stack spacing={2} sx={{ mt: 4 }} alignItems={"center"}>
                            <Pagination 
                            page={metaData?.currentPage}
                            count={metaData?.totalPages } 
                            onChange={(_, page) => handleChangeParam({
                                name: "pageNumber", 
                                value: page.toString(),
                                checked: false
                            })}
                            color="primary" />
                        </Stack>
                    )
                }
            </Grid>
        </Grid>
    )
}