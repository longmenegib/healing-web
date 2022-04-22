import React, { useState, useEffect, useMemo }  from 'react'
import { Modal, ModalHeader, FormGroup, Input, Button, Alert, Toast } from 'reactstrap'
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import axios from '../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'

const styles = {
    contain:{
        // backgroundColor: 'white',
        // height: Dimensions.get("screen").height - 150,
        width: '100%',
        alignItems:'center',
        flexDirection:'column',
        justifyContent: 'center',
        position: 'relative',
        marginTop: '30px'
    },
    cancelbtn:{
        width: '200px',
        backgroundColor: 'red',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: '50px',
        height: '40px',
        marginTop: '10px',
        color: 'white',
        marginBottom: '5px'
    },
}


const SetFee = ({setopenFee, openFee, getDetails})=>{

    const [booking_fee, setBooking_fee]=useState('');
    const [stripe_id, setStripeId]=useState('');

    const putPrices = async() => {
        let userToken = getFromStorage('userToken');
        // setUser(JSON.parse(userToken));
        let token = JSON.parse(userToken).key
        let id = JSON.parse(userToken).id
        const data = {
          booking_fee: parseInt(booking_fee)
        }
        
        console.log(data);
        await axios.put(`/user-api/therapists/${id}/`, data, { headers: {"Authorization": `Token ${token}`} })
        .then(res => {
          console.log(res);
          alert(
            "Price changed successfully"
          )
        })
        .catch(err => console.log(err)
    )}

    const updateId = async()=>{
        // return (
        //     <Alert
        //     color="primary"
            
        //   >
        //     Hey! Pay attention.
        //   </Alert>
        //   )
        console.log("this is the id");
        let userToken = getFromStorage('userToken');
        // setUser(JSON.parse(userToken));
        let token = JSON.parse(userToken).key
        if(!stripe_id){
            alert("Enter your stripe account id");
            return;
        }
        await axios.post(`/membership-api/subscriptions/payment-linking`, {account_id: stripe_id}, { headers: {"Authorization": `Token ${token}`} })
        .then(res => {
          console.log(res);
          getDetails();
        //   alert(
        //     "Stripe Account Linked. You can received payment now"
        //   )
         
        })
        .catch(err => console.log(err)
        )
    }

    return(
      <Modal
      // toggle={function noRefCheck(){}}
      isOpen={openFee}
      onClosed={()=> setopenFee(false)}
       >
           <ModalHeader>
               Update booking fee
               <div className="" style={{position: 'absolute', right: '10px', top:'0'}} onClick={()=> setopenFee(false)}>
                    <FontAwesomeIcon className="iconss" icon={faClose} size="1x"/>
                </div>
            </ModalHeader>
          
           <div>
               
                <FormGroup>
                    <label
                        className="form-control-label ml-5"
                        htmlFor="input-first-name"

                    >
                        Booking Fee
                    </label>
                    <Input
                        className="form-control-alternative"
                        defaultValue="Lucky"
                        id="input-first-name"
                        placeholder="Enter fee here"
                        type="text"
                        value={booking_fee}
                        style={{width: '80%', margin:'auto', marginTop: '5px'}}
                        onChange={(e) => setBooking_fee(e.target.value)}
                    />
                </FormGroup>
                <div style={{width: '100%', justifyContent: 'center', display:'flex'}}>
                    <button style={styles.cancelbtn} className="button-addd" onClick={()=>putPrices()}>Save</button>
                </div>
           </div>
      </Modal>
    )
}

export default SetFee