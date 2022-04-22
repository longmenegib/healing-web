import React, { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./css/payment.css";
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage';
import { useNavigate, useLocation } from 'react-router-dom';

const Payment = () => {
  const stripe = loadStripe(
    "pk_live_51IMgMoD0JaUAVNhkluLE0zZhay0VbtxQ0NKoRjoas5CEyYrbX8DTKI2xPH7GYiYbsljAiy8sxEkKQWVktYa3KU6R001wbzfLnc"
  );

  const location = useLocation();
  const { order } = location.state || {};
  const [clientSecret, setClientSecret] = useState("");

  return (
    <Elements stripe={stripe}>
      <CheckoutForm order={order}/>
    </Elements>
  );
};
function CheckoutForm({order}) {
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  

  const payMoney = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setPaymentLoading(true);
    const  { paymentMethod, error } = await stripe.createPaymentMethod({
      type:'card',
      card: elements.getElement(CardElement),
    });

    
    if (error) {
        alert(`Error code: ${error.code}`, error.message);
        setPaymentLoading(false);
        return;
      }
      if (!paymentMethod) {
        setPaymentLoading(false);
        return;
      }

      if(paymentMethod){
        const userToken = getFromStorage('userToken');
        const token = JSON.parse(userToken).key;
        let id = JSON.parse(userToken).id;
        console.log(userToken)
        let ord = {
            therapist: order.therapist,
            status: 0,
            start_date: order.start_date,
            start_time: order.start_time,
            booker: id,
            offer: order.offer
          }
        console.log("this is the payment method: ", paymentMethod);
       
        await axios.post(`/booking-api/bookings/`, ord, { timeout: 30000, headers: {"Authorization": `Token ${token}`} })
        .then( async(response) => {
            console.log(response);
            
            // setPaymentLoading(false);
            await axios.post(`/booking-api/bookings/${response.data.id}/pay`, {paymentMethodId: paymentMethod.id}, { headers: {"Authorization": `Token ${token}`}  })
            .then(async(res) => {
                console.log('this is the response ', res);

                const payload = await stripe.confirmCardPayment(res.data.client_secret, {
                  payment_method: {
                    card: elements.getElement(CardElement),
                  },
                });
                console.log('this is the payload: ', payload);
                if(payload.paymentIntent){
                  await axios.post(`/booking-api/bookings/charge-confirm`, {booking_id: response.data.id, status: payload.paymentIntent.status}, { headers: {"Authorization": `Token ${token}`}  })
                  .then((respo)=>{
                    alert(
                      'Appointment Booked Successfully'
                  );
                   navigate(`/dashboard`);
                  }).catch(err=>{
                    console.log(err);
                    alert(
                      'Payment not Completed'
                  )
                  })
                }
            })
            .catch(err => {
                console.log(err);
                setPaymentLoading(false);
                alert(
                  'Appointment not booked'
              )
            });
        })
        .catch(err => {
            console.log("Not booked ", err);
            setPaymentLoading(false);
            alert(
              'Appointment not booked'
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

export default Payment;