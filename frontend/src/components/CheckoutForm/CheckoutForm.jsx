import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import "./styles.css"; // Import your CSS file
import axios from "axios";
import Alert from '@mui/material/Alert';
import { Button, Card, CardContent, CircularProgress, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { keys } from "../../api";
import { useParams } from "react-router-dom";

const stripe_key = import.meta.env.VITE_STRIPE_KEY;
const stripePromise = loadStripe(
  stripe_key
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [Amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMsg,setErrorMsg]=useState('');

  let { amount,coins,email } = useParams();

  useEffect(() => {
    setAmount(amount);
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    if (!stripe || !elements) {
      return;
    }
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    axios
      .post(
        `${keys.api}payment`,
        {
          amount: Amount, // Example amount (in cents)
          currency: "USD",
        },
        config
      )
      .then(async (response) => {
        let client_secret = response.data.clientSecret;

        // Check if the user has entered their payment method

        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });
        result?.error && setErrorMessage(result?.error?.message);
        // alert(result?.paymentIntent?.status)
        if (result?.paymentIntent?.status === "succeeded") {
          axios
            .post(
              `${keys.api}store`,
              {
                email: email && email,
                coins: coins && coins,
                amount: Amount, // Example amount (in cents)
                currency: "USD",
              },
              config
            )
            .then((response) => {
              if(response.status === 200) {
                setAmount("");
                setOpen(true);
                setLoader(false);
              }
            
            })
            .catch((error) => {
              let {data}=error.response 
              setErrorMsg(data?.error);
              setOpen(true);
              setLoader(false);
            });
        } else {
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Payment Details
            </Typography>
            <form onSubmit={handleSubmit}>
              <CardElement className="CardElement" options={{hidePostalCode: true}}/>
              <TextField
                label="Amount"
                type="number"
                value={Amount}
                onChange={handleAmountChange}
                disabled
                fullWidth
                style={{ marginBottom: "1rem" }}
              />
              <Button
                type="submit"
                disabled={!stripe || !elements || !Amount}
                variant="contained"
                color="primary"
              >
                {loader ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Pay"
                )}
              </Button>
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity= {errorMsg? "error" :"success"}
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  {errorMsg? errorMsg : "Payment Successful!"}
                </Alert>
              </Snackbar>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

const StripePaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripePaymentForm;
