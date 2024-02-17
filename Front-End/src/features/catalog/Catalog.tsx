import { Button } from "@mui/material"
import { Product } from "../../app/models/product"
import ProductList from "./ProductList"
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";

interface Props {
}

export default function Catalog() {

    const [products, setProducts] = useState<Product[]>([])

    function addProduct() {
        setProducts(prevState => [...prevState, {
            id: prevState.length + 101,
            name: 'product' + prevState.length,
            price: 500.00,
            brand: 'some brand',
            description: 'some description',
            pictureUrl: 'http://picsum.photos/200'
        }]);
    }

    useEffect(() => {
        agent.Catalog.list()
        .then(products => setProducts(products));
    }, []);

    return (
        <>
            <ProductList products={products} />
            <Button variant="contained" onClick={addProduct}>Add Product</Button>
        </>
    )
}