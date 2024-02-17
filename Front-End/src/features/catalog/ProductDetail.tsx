import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        id && agent.Catalog.details(+id)
            .then(product => setProduct(product))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [])

    if (loading) return <h3>Loading....</h3>

    if (!product) return <h3>Product Not Found</h3>

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{ mb: 3 }}/>
                <Typography variant="h4">{`$${product.price.toFixed(2)}`}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {Object.keys(product).map(prop => (
                                <TableRow key={prop}>
                                    <TableCell align="left">{prop}</TableCell>
                                    <TableCell align="left">{(product as any)[prop]}</TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}