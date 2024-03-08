import ProductList from "./ProductList"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductFiltersAsync, fetchProductsAsync, productSelectors, setProductParams } from "./CatalogSlice";
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Pagination, Paper, Radio, RadioGroup, Stack, TextField } from "@mui/material";

const sortTypes = [
    {
        value: 'name',
        label: 'Alphabetical'
    },

    {
        value: 'price',
        label: 'Price - Low to High'
    },

    {
        value: 'priceDesc',
        label: 'Price - High to Low'
    },
]
export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const { productParams, productLoaded, filterLoaded, types, brands, status, metaData } = useAppSelector(state => state.catalog);

    function onChangeParam(name: string, value: string, checked: boolean = true){
        let payload;

        if(name == "orderBy" || name == "searchTerm" || name == "pageNumber"){
            payload = { [name]: {} };
            payload[name] = value;
        }
        else if(name == "brands" || name == "types"){ 
            payload = { [name]: [...productParams[name]!] }
            if(checked)
                payload[name].push(value);
            else{
                const index = payload[name].indexOf(value);
                if(index > -1)  payload[name].splice(index, 1);
            }
        }

        dispatch(setProductParams(payload));
    }

    useEffect(() => {
        if (!productLoaded) {
            dispatch(fetchProductsAsync());
        }
    }, [productLoaded, fetchProductsAsync]);

    useEffect(() => {
        if (!filterLoaded) {
            dispatch(fetchProductFiltersAsync())
        }
    }, [filterLoaded, fetchProductFiltersAsync]);

    return (
        <Grid container>
            <Grid item xs={3}>
                <Paper elevation={3} sx={{ mb: 2 }}>
                    <TextField
                    label="Search Product..."
                        variant="outlined"
                        fullWidth>

                    </TextField>
                </Paper>
                <Paper elevation={3} sx={{ mb: 2, p: 2 }}>
                    <FormControl
                        component="fieldset">
                        <FormLabel component="legend">SORT TYPE</FormLabel>
                        <RadioGroup
                            aria-label="sort type"
                            defaultValue={productParams.orderBy}
                            name="radio-button-group">
                            {
                                sortTypes?.map(({ value, label }) => (
                                    <FormControlLabel key={value} value={value} 
                                    control={
                                    <Radio 
                                    checked={ productParams.orderBy == value }
                                    onChange={ () => onChangeParam("orderBy", value) } 
                                    />
                                } 
                                    label={label} />
                                ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>
                <Paper elevation={3} sx={{ mb: 2, p: 2 }}>
                    <FormGroup>
                        <FormLabel component="legend">BRANDS</FormLabel>
                        {
                            brands?.map((brand) => (
                                <FormControlLabel key={brand}
                                    control={
                                        <Checkbox
                                            onChange={(e) => onChangeParam("brands", brand, e.target.checked)}
                                            checked={productParams.brands!?.indexOf(brand) > -1} />
                                    }
                                    label={brand} />
                            ))
                        }
                    </FormGroup>
                </Paper>
                <Paper elevation={3} sx={{ mb: 2, p: 2 }}>
                    <FormGroup>
                        <FormLabel component="legend">TYPES</FormLabel> 
                        {
                            types?.map((type) => (
                                <FormControlLabel key={type}
                                    control={
                                        <Checkbox
                                            onChange={(e) => onChangeParam("types", type, e.target.checked)}
                                            checked={productParams.brands!?.indexOf(type) > -1} />
                                    }
                                    label={type} />
                            ))
                        }
                    </FormGroup>
                </Paper>
            </Grid>
            <Grid item xs={9} sx={{ p: 3 }}>
                <ProductList products={products} />
                {
                    metaData && (
                        <Stack spacing={2} sx={{ mt: 4 }} alignItems={"center"}>
                            <Pagination 
                            page={metaData?.currentPage}
                            count={metaData?.totalPages } 
                            onChange={(_, page) => onChangeParam("pageNumber", page.toString())}
                            color="primary" />
                        </Stack>
                    )
                }
            </Grid>
        </Grid>
    )
}