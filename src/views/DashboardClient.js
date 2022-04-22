import React, { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap'
import { faStar, faRefresh, faCalendar, faDollarSign, faDollar, faMoneyBill, faImages } from '@fortawesome/free-solid-svg-icons'
import './css/dashboard.scss';
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage';
import moment from 'moment' 

import BookingList from './dash/BookingList';

export default function DashboardClient() {

    const [user, setUser] = useState({});

  const [boolingList, setboolingList] = useState([]);
    useEffect(()=>{
        loadboolingList();
        return ()=>{

        }
    }, [])

    const loadboolingList = async()=>{
      let userToken = getFromStorage('userToken');
      console.log(userToken)
      let token = JSON.parse(userToken).key
      let id = JSON.parse(userToken).id;
        console.log(id);
       
        await axios.get(`/booking-api/clients/bookings`, { headers: {"Authorization": `Token ${token}`}  })
        .then(async res => {
            console.log("boolingList: ", res.data);
            
            if(res.data.length > 0){
                setboolingList(res.data);
            }
        })
        .catch(err => {
            console.log("logo image not not saveddd: ", err);
            
        });
    }

  

  return (
    <div className="home">
        
        <div className="container-home" style={{height: '100%', paddingTop: 120}}>
            <div className="bg" style={{top: '20%'}}>
                <img src="/assets/image/bg-2.svg" alt="" className="img-left"/>
                <img src="/assets/image/bg-2.svg" alt="" className="img-center"/>
                <img src="/assets/image/bg-2.svg" alt="" className="img-right"/>
            </div>
            
            <BookingList bookingList={boolingList}/>
        </div>
      </div>
  )
}
