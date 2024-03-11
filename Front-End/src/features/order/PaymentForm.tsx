import { Typography, Grid } from "@mui/material";
import AppTextInput from "../../app/components/AppTextInput";
import { useFormContext } from "react-hook-form";

export default function PaymentForm() {
  const { control } = useFormContext();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AppTextInput control={control} label="Name on Card" name="cardName" />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextInput control={control} label="Card Number" name="cardNumber" />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextInput control={control} label="Expiry Date" name="expDate" />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextInput control={control} label="CVV" name="cvv" />
        </Grid>
      </Grid>
    </>
  );
}