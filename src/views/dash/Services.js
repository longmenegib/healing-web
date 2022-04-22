import React, { useState, useEffect, useMemo }  from 'react'
import { Modal, ModalHeader, FormGroup, Input, Button, Alert, Toast } from 'reactstrap'
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import axios from '../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'

import './setcalendar.css';
import '../css/customCalendar.css'

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


const Services = ({setOpenService, openService, offers, setOpenOffer, openOffer})=>{

    // const []

    return(
      <Modal
      size="lg"
      isOpen={openService}
      onClosed={()=> setOpenService(false)}
       >
           <ModalHeader>
               What services do you offer ?
               <div className="" style={{position: 'absolute', right: '10px', top:'10px'}} onClick={()=> setOpenService(false)}>
                    {/* <FontAwesomeIcon className="iconss" icon={faClose} size="1x"/> */}
                    <Button
                        className="button-add"
                        onClick={()=> setOpenOffer(true)}
                    >
                        Add new offer
                    </Button>
                    {' '}
                    <Button onClick={()=> setOpenService(false)}>
                        Cancel
                    </Button>
                </div>
            </ModalHeader>
          
            <div className="right-body">
                        <div className="center">
                            <div class="hours" style={{width: '100%'}}>
                                <div style={{width: '100%'}}>
                                {offers.length < 1 && (
                                <div style={{width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                                    <p style={{ fontSize: 18, fontWeight: '600', color: 'gray', marginBottom: 10 }}>No time slot available for this day</p>
                                </div> 
                                )}
                                <div className="slides">
                                {offers.map((ele, index)=>{
                                return(
                                <div key={index} className="home-card">
                                    <div className="home-card-img">
                                        <img src={ele.illustration || "../assets/image/group-1.svg"} alt="" width="100%"/>
                                    </div>
                                    <div className="home-card-map">
                                        <h3>{ele.category} </h3>
                                        <div style={{display: 'flex',flexDirection: 'column'}}>
                                            <p>{ele.description.slice(0, 30)}...</p>
                                            <h4>$ {ele.price}</h4>
                                        </div>
                                    </div>
                                
                                    {/* <button onClick={()=>openDescrip(ele)}>Buy now</button> */}
                                </div>
                                )}
                                )}
                            </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
      </Modal>
    )
}

export default Services