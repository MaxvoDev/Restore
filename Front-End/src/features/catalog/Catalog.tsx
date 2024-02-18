import { Product } from "../../app/models/product"
import ProductList from "./ProductList"
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function Catalog() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        agent.Catalog.list()
        .then(products => setProducts(products))
        .finally(() => setLoading(false))
    }, []);

    if(loading) return <LoadingComponent />

    return (
        <>
            <ProductList products={products} />
        </>
    )
}