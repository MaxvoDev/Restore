import React, { useEffect } from "react";
import { Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, Typography, Grid } from "@mui/material";
import { fetchProductFiltersAsync } from "./CatalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

interface Props {
    onChangeParam: (param: { name: string, value: string, checked: boolean }) => void;
}

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

export default function ProductFilter({ onChangeParam }: Props) {
    const dispatch = useAppDispatch();
    const { productParams, filterLoaded, types, brands } = useAppSelector(state => state.catalog);

    useEffect(() => {
        if (!filterLoaded)
            dispatch(fetchProductFiltersAsync());
    }, [filterLoaded, dispatch]);

    return (
        <Paper elevation={3} sx={{ padding: 2 }}>
            <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ marginBottom: 1 }}>SORT TYPE</FormLabel>
                <RadioGroup aria-label="sort type" value={productParams.orderBy} onChange={(e) =>
                    onChangeParam({ name: "orderBy", value: e.target.value, checked: false })}>
                    {sortTypes.map(({ value, label }) => (
                        <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                    ))}
                </RadioGroup>
            </FormControl>
            <FormGroup sx={{ marginTop: 2 }}>
                <FormLabel component="legend" sx={{ marginBottom: 1 }}>BRANDS</FormLabel>
                {brands?.map((brand) => (
                    <FormControlLabel key={brand} control={<Checkbox checked={productParams.brands?.indexOf(brand) > -1} onChange={(e) =>
                        onChangeParam({ name: "brands", value: brand, checked: e.target.checked })} />} label={brand} />
                ))}
            </FormGroup>
            <FormGroup sx={{ marginTop: 2 }}>
                <FormLabel component="legend" sx={{ marginBottom: 1 }}>TYPES</FormLabel>
                {types?.map((type) => (
                    <FormControlLabel key={type} control={<Checkbox checked={productParams.types?.indexOf(type) > -1} onChange={(e) =>
                        onChangeParam({ name: "types", value: type, checked: e.target.checked })} />} label={type} />
                ))}
            </FormGroup>
        </Paper>
    );
}
