import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "../css/payment.css";
import axios from '../../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSubscription = () => {
  const stripe = loadStripe(
    "pk_live_51IMgMoD0JaUAVNhkluLE0zZhay0VbtxQ0NKoRjoas5CEyYrbX8DTKI2xPH7GYiYbsljAiy8sxEkKQWVktYa3KU6R001wbzfLnc"
  );

  const location = useLocation();
  const { data } = location.state || {};

  return (
    <Elements stripe={stripe}>
      <CheckoutForm planData={data}/>
    </Elements>
  );
};
function CheckoutForm({planData}) {
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const payMoney = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const tokenResult = await stripe.createToken(elements.getElement(CardElement),{
      currency: 'usd'
    });
    setPaymentLoading(true);
    const  { paymentMethod, error } = await stripe.createPaymentMethod({
      type:'card',
      card: elements.getElement(CardElement),
    });
    
    if (tokenResult.error) {
        alert(`Error code: ${error.code}`, error.message);
        setPaymentLoading(false);
        return;
    }
    if (!paymentMethod) {
      setPaymentLoading(false);
      return;
    }

    if(tokenResult.token){
      const userToken = getFromStorage('userToken');
      const token = JSON.parse(userToken).key;
      console.log("this is the payment method: ", tokenResult.token);
      
        await axios.post('/membership-api/subscriptions/create', {paymentMethodId: paymentMethod.id, token: tokenResult.token.id}, { headers: {"Authorization": `Token ${token}`}  })
        .then(async response => {
          console.log('getting the link',response.data.detail);
               alert(
                    'You will be redirected to Stripe Website to configure your account for future payment',
                )
               
          window.location.href = response.data.detail.url;
          navigate('/dashboard');
            //  await axios.post('/membership-api/subscriptions/', planData, { timeout:30000, headers: {"Authorization": `Token ${token}`}  })
            // .then(async res => {
            //     console.log("subscription renewed: ", res.data);
            //     alert(
            //         'Subscription renewed'
            //     )
            //     navigate('/dashboard');
            // })
            // .catch(err => {
            //     console.log("not saveddd: ", err);
            //     setPaymentLoading(false);
            //     alert(
            //         'Could not renewed the subscription. Please try again'
            //     )
            // });
        })
        .catch(err => {
            console.log("not subscribed: ", err);
            setPaymentLoading(false);
                alert(
                    'Could not renewed the subscription. Please try again later'
                )
        });    
  
    }
  };

  return (
    <div
      style={{
        padding: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <form
          style={{
            display: "block",
            width: "100%",
          }}
          onSubmit = {payMoney}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CardElement
              className="card"
              options={{
                style: {
                  base: {
                    backgroundColor: "white"
                  } 
                },
              }}
            />
            <button
              className="pay-button"
              disabled={isPaymentLoading}
            >
              {isPaymentLoading ? "Loading..." : "Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentSubscription;