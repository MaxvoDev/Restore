import { useEffect } from "react";
import { Paper } from "@mui/material";
import { fetchProductFiltersAsync, setProductParams } from "./CatalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtonGroup from "../../app/components/CheckboxButtonGroup";
import LoadingComponent from "../../app/layout/LoadingComponent";

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
    }
];

export default function ProductFilter() {
    const dispatch = useAppDispatch();
    const { productParams, filterLoaded, types, brands } = useAppSelector(state => state.catalog);

    useEffect(() => {
        if (!filterLoaded)
            dispatch(fetchProductFiltersAsync());
    }, [filterLoaded, dispatch]);

    if(!filterLoaded) return <LoadingComponent />

    return (
        <Paper elevation={3} sx={{ padding: 2 }}>
            <RadioButtonGroup
                label="SORT TYPE"
                name="orderBy"
                options={sortTypes}
                selectedValue={productParams.orderBy}
                onChange={(e) => dispatch(setProductParams(e))}
            />
            <CheckboxButtonGroup
                label="BRANDS"
                name="brands"
                items={brands!}
                checked={productParams.brands!}
                onChange={(e) => dispatch(setProductParams(e))}
            />
            <CheckboxButtonGroup
                label="TYPES"
                name="types"
                items={types!}
                checked={productParams.types!}
                onChange={(e) => dispatch(setProductParams(e))}
            />
        </Paper>
    )
}
