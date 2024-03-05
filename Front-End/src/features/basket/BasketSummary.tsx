import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useStoreContext } from "../../app/context/StoreContext";

export default function BasketSummary(){
    const { basket } = useStoreContext();
    const subTotal = basket?.items.reduce((total, item) => {
        return total += item.price * item.quantity
    }, 0) || 0;

    let deliveryFee = 500;
    if(subTotal > 10000) deliveryFee = 0.00;

    const total = subTotal + deliveryFee;

    return (
        <TableContainer component={Paper}>
            <Table align="right">
                <TableBody>
                    <TableRow>
                        <TableCell>
                            Subtotal
                        </TableCell>
                        <TableCell>
                            ${(subTotal / 100).toFixed(2)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Delivery Fee *
                        </TableCell>
                        <TableCell> 
                            ${(deliveryFee / 100).toFixed(2)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Total
                        </TableCell>
                        <TableCell>
                            ${(total / 100).toFixed(2)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>*Order more than $100 to Qualify for FREE DELIVERY</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}