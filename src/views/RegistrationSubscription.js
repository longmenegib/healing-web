import React, { useState, useContext, useEffect } from "react";
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
import { AuthContext } from '../App';

const RegistrationSubscription = () => {
  const stripe = loadStripe(
    "pk_live_51IMgMoD0JaUAVNhkluLE0zZhay0VbtxQ0NKoRjoas5CEyYrbX8DTKI2xPH7GYiYbsljAiy8sxEkKQWVktYa3KU6R001wbzfLnc"
  );

  const location = useLocation();
  const loadData = location.state || {};

  return (
    <Elements stripe={stripe}>
      <CheckoutForm  loadData={loadData}/>
    </Elements>
  );
};
function CheckoutForm({loadData}) {

   const { userinfos, therapistinfo,
        logo, image, fileResponse, tags } = loadData;
       

  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const {signIn} = useContext(AuthContext);

  
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState({});
  const [methodid, setmethodid] = useState('');
  

//   useEffect(()=>{
//       loadPlan();
//       return ()=>{

//       }
//   }, [])

  const loadPlan = async(userid, token, payee, tokee)=>{
    let idd = payee;
    let tk = tokee
    console.log("load plan swhowing payment d", idd);
      await axios.get('/membership-api/plans/', { headers: {"Authorization": `Token ${token}`}  })
      .then(async res => {
          console.log("plans: ", res.data.results);
          if(res.data.results.length > 0){
              setPlans(res.data.results);
              setSelected(res.data.results[0]);
             paymentNow(userid, token, res.data.results[0], idd, tk);
                   
          }
      })
      .catch(err => {
          console.log("logo image not not saveddd: ", err);
      });
  }


  const payMoney = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setPaymentLoading(true);

    const tokenResult = await stripe.createToken(elements.getElement(CardElement),{
      currency: 'usd'
    });

    if(tokenResult.error){
      console.log(tokenResult.error)
      alert(tokenResult.error.message);
      setPaymentLoading(false);
      return;
    }

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
      console.log("payment id", paymentMethod);
      console.log("token id", tokenResult.token);
      setPaymentLoading(false);
        // setmethodid(paymentMethod.id)
        register(paymentMethod.id, tokenResult.token.id);
    }
  };

  const paymentNow = async(userid, token, items, payid, tokid)=>{
        
        console.log("this is the payment id: ", tokid);
        await axios.post('/membership-api/subscriptions/create', {paymentMethodId: payid, token: tokid}, { headers: {"Authorization": `Token ${token}`}  })
        .then(async response => {

          console.log('getting the link',response.data.detail);
          alert(
            'You will be redirected to Stripe Website to configure your account for future payment',
        )
          window.location.href = response.data.detail.url;
            return true;
        })
        .catch(err => {
            console.log("Could not subscribe ", err);
            alert("Could not subscribe. Make subscriptionr");
            return false;
        });    
  }

  const register = async(payy, tokk)=>{
    console.log("passssssssss", payy);
    console.log("tokkkk", tokk)
    // return ;
      await axios.post('/registration/', userinfos, { withCredentials: false })
            .then(async res => {
                console.log(res.data);
                // let therapist_token = '1fc895055c2af658300153babd43f0738fbb9a7b';
                let therapist_token = res.data.key;
                console.log(therapistinfo);

                await axios.post('/user-api/therapists/', therapistinfo, { headers: {"Authorization": `Token ${therapist_token}`}  })
                .then(async respo => {
                    const response = await axios.post('/user-api/custom/login', 
                    {username: userinfos.username, password: userinfos.password1}, { withCredentials: false });
                    if(response.data){
                        
                        if(image.length > 0){
                          saveImage(response.data.key);

                            if(logo.length > 0){
                                console.log('helllllll');
                                saveLogo(response.data.user_id, response.data.key);

                                if(fileResponse.length > 0){
                                    saveFile(response.data.user_id, response.data.key);
                                }
                                
                            }
                        }
                        // if(!saveFee(response.data.therapist_id, response.data.key)){
                        //     alert('Message',
                        //     "Could not save booking fee");
                        // } 
                        
                        if(tags){
                            saveTags(response.data.therapist_id, response.data.key);
                        }

                        let usertherapist = response.data;
                          usertherapist.id = response.data.therapist_id;

                        if( loadPlan(response.data.therapist_id, response.data.key, payy, tokk)){
                          
                          setInstorage('userToken', JSON.stringify(usertherapist));
                          signIn();
                          navigate('/dashboard');
                        }else{
                         
                          setInstorage('userToken', JSON.stringify(usertherapist));
                          signIn();
                          navigate('/dashboard');
                        }
                       
                        //login now
                    }else{
                        alert('Message',
                        "Check your connection and try again");
    
                    }
                })
                .catch(err => {
                    console.log('ror from therapist crteation', err);
                    setPaymentLoading(false)
                });
            })
            .catch(err => {
                console.log(err);
                // alert(
            
                //   "A user with that username or email exist already",
                //   )
                if(err.response){
                    console.log("this is response error", err.response.data);
                    if(err.response.data.email){
                    // setEmailErr(err.response.data.email[0]);
                    alert(
                        `${err.response.data.email[0]}`,
                        )
                    }
                    if(err.response.data.username){
                    // setnameErr(err.response.data.username[0]);
                    alert(
    
                        `${err.response.data.username[0]}`,
                        )
                    }
                    if(err.response.data.password1){
                      // setpassErr(err.response.data.password1[0]);
                      alert(
    
                        `${err.response.data.password1[0]}`,
                        )
                    }
                }else if(err.request){
                    alert(

                    "Check your connection and try again",
                    )
                }else if(err.message){
                    console.log("this is the message error");
                }
        });
    
  }

  const saveTags = async(userid, token) =>{
    var tagItems = tags.split(',');
    for (let i = 0; i < tagItems.length; i++){
        await axios.post('/market-api/tag-providers/', {tag: tagItems[i], therapist: userid}, { headers: {"Authorization": `Token ${token}`}  })
        .then(async resp => {
    
            console.log('Saved Tag');
        })
        .catch(err => {
            console.log('Could not save tag ',err);
        });
    }
}

const saveFile = async(userid, token)=>{
   
  let filedata = new FormData();
  filedata.append('certificate', fileResponse);
  
  await axios.post(`/user-api/users/${userid}/certificate`, filedata, { headers: {"Authorization": `Token ${token}`,
  "Content-Type": "multipart/form-data"}  })
  .then(async res => {
      console.log("certificate saved");
      return true;
  })
  .catch(err => {
      console.log("certificcate not save", err)
      return false;
  });
}

const saveImage = async(token)=>{
    for (let i = 0; i < image.length; i++) {
        const logodata = new FormData();
        logodata.append('image', image[i]);
        await axios.post(`/user-api/photos/`, logodata, { headers: {"Authorization": `Token ${token}`,
        "Content-Type": "multipart/form-data"}  })
        .then(async res => {
            console.log("company images saved");
            return true;
        })
        .catch(err => {
            console.log("company images not saveddd", err)
            return false;
        });
    }
}

const saveLogo = async(userid, token)=>{
    let logoda = new FormData();
    logoda.append('logo', logo);

    await axios.post(`/user-api/users/${userid}/logo`, logoda, { headers: {"Authorization": `Token ${token}`, "Content-Type": "multipart/form-data"}  })
    .then(async res => {
        console.log("logo image saved");

        return true;
    })
    .catch(err => {
        console.log("logo image not saved", err);
        return false;
    });
}

// const saveFee = async(userid, token)=>{
//     let data = {
//         therapist: userid,
//         booking_fee: parseInt(booking_fee)
//       }
      
//       console.log(data);
//       await axios.post(`/booking-api/booking-fees/`, data, { headers: {"Authorization": `Token ${token}`} })
//       .then(res => {
//         console.log("fee added successfully")
//         return true;
//       })
//       .catch(err =>{
//            console.log(err)
//            return false;
//         }
//       )
// }


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

export default RegistrationSubscription;