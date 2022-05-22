import React, { useState, useEffect, useMemo }  from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import ReactStars from "react-rating-stars-component";
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import './review.css'
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
        marginTop: '30px',
        color: 'white'
    },
}


const OrderPayModal = ({setOpenreview, openReview, reviewList})=>{

    
    return(
      <Modal
      // toggle={function noRefCheck(){}}
      isOpen={openReview}
      onClosed={()=> setOpenreview(false)}
      
  >
      <div className="profileGallery">
        <div className="container-profile">
          <div className="container-footer">
                <div className=" reviewws" style={{width: '100%'}}>
                    <h3>My Review <span></span></h3>
                    <div className="" style={{position: 'absolute', right: '25px'}} onClick={()=> setOpenreview(false)}>
                        <FontAwesomeIcon className="iconss" icon={faClose} size="2x"/>
                    </div>
                    <div className="profile-card" style={{width: '100%'}}>
                        <div className="box">
                        {reviewList.map((rev, index)=>{
                                    return(
                            <div key={index} className="list">
                                <div className="list-text">
                                    <h3>{rev.client}</h3>
                                    <p>{rev.description}</p>
                                </div>
                                <div className="profile-card-star">
                            {/* {show && ( */}
                            <ReactStars
                                    count={5}
                                    edit={false}
                                    size={12}
                                    activeColor="#ffd700"
                                    value={rev.rating_value}
                                />
                        {/* )} */}
                                </div>
                            </div>
                                    )
                        })}
                        </div>
                        {/* <button style={styles.cancelbtn} onClick={()=> setOpenreview(false)}>Close</button> */}
                    </div>
                </div>
            </div>
            </div>
            </div>
      </Modal>
    )
}

export default OrderPayModal