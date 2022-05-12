import React, { useState, useEffect, useMemo }  from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import ReactStars from "react-rating-stars-component";
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import './subscription.css'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/axios';

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
        marginBottom: '30px'
    },
}


const Subscription = ({setshowSubs, showSubs})=>{

    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [selected, setSelected] = useState({});
    

    useEffect(()=>{
        loadPlan();
        return ()=>{

        }
    }, [])

    const loadPlan = async()=>{
        let userToken = getFromStorage('userToken');
        let token = JSON.parse(userToken).key;

        await axios.get('http://healing-market.herokuapp.com/membership-api/plans/', { headers: {"Authorization": `Token ${token}`}  })
        .then(async res => {
            console.log("plans: ", res.data.results);
            if(res.data.results.length > 0){
                setPlans(res.data.results);
                setSelected(res.data.results[0]);
            }
        })
        .catch(err => {
            console.log("logo image not not saveddd: ", err);
        });
    }

    const subscribe= ()=>{
        if(!selected){
            return alert(
                'Select a plan first'
            )
        }
        let userToken = getFromStorage('userToken');
        let token = JSON.parse(userToken).key;
        let id = JSON.parse(userToken).id;
        var end_date = new Date();
        end_date.setDate(end_date.getDate()+selected.period)
        let data = {
            therapist: id,
            plan: selected.id,
            end_date: end_date
        }
        console.log(data);
        navigate('/pay-subscription', {
            state: {data: data}
        });
    }

    return(
      <Modal
    //   toggle={()=> setshowSubs(false)}
      isOpen={showSubs}
      onClosed={()=> setshowSubs(false)}
  >
      <ModalHeader>
            <span style={{color: '#ff9933', fontWeight: 'bold'}}>Subscription Plan</span>
            <div className="" style={{position: 'absolute', right: '10px', top:'0'}} onClick={()=> setshowSubs(false)}>
                <FontAwesomeIcon className="iconss" icon={faClose} size="1x"/>
            </div>
        </ModalHeader>
        <div style={{display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{ display: 'flex' ,alignSelf: 'center'}}>
                <p style={{textAlign: 'center'}}>
                    List your business for one low monthly fee to get unlimited visibility
                </p>
            </div>
            <div className="subs-plan">
                <div className="title">Best plan</div>
                <div className="dayNum">30</div>
                <div className="days">Days</div>
                <div className="price">$14.99/mt</div>
            </div>
            <div style={{width: '100%', justifyContent: 'center', display:'flex'}}>
                <button style={styles.cancelbtn} className="button-addd" onClick={subscribe}>
                    Get 30 Days / $14.99
                </button>
            </div>
            <div style={{textAlign: 'center'}}>
                <h5>When will i be billed</h5>
                <p style={{fontSize: '14px'}}>
                    Your Healing Market account billed at the end of your trial period (if applicable) on
                    confirmation of your subscription
                </p>
            </div>
            <div style={{textAlign: 'center'}}>
                <h5>Does my subscription auto renewed?</h5>
                <p style={{fontSize: '14px'}}>
                    Yes. You can disabled this at any time
                </p>
            </div>
        </div>
    </Modal>
    )
}

export default Subscription