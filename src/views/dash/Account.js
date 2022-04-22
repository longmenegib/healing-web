import React, { useState, useEffect, useMemo }  from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import ReactStars from "react-rating-stars-component";
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import axios from '../../utils/axios';
import DatePicker, {TimePicker} from 'sassy-datepicker';
import '../css/customCalendar.css'
import 'react-time-picker/dist/TimePicker.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'

const styles = {
    contain:{
        // backgroundColor: 'white',
        // height: Dimensions.get("screen").height - 150,
        width: '100%',
        display: 'flex',
        alignItems:'center',
        flexDirection:'column',
        justifyContent: 'center',
        position: 'relative',
        marginTop: '30px',
        marginBottom: '20px'
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
        marginTop: '30px',
        color: 'white'
    },
}


const Account = ({setOpenAccount, openAccount, count})=>{
    

    return(
      <Modal
      toggle={()=> setOpenAccount(false)}
      isOpen={openAccount}
      onClosed={()=> setOpenAccount(false)}
  >
        <ModalHeader>
            My Account Balance
        </ModalHeader>
        <div style={styles.contain}>
            {/* <div style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>MY WALLET</div> */}
            <div style={{ fontSize: 14, fontWeight: '400', color: 'black' }}>Total amount </div>
            <div 
            style={{ fontSize: 22, fontWeight: 'bold', color: 'black', marginVertical: 20, display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon className="iconss" icon={faDollarSign} size="2x"/> 
                <div style={{color:'#ff9933', fontSize: '28px'}}>{count}</div>
            </div>
        </div>
      </Modal>
    )
}

export default Account;