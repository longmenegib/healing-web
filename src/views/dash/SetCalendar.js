import React, { useState, useEffect, useMemo }  from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import ReactStars from "react-rating-stars-component";
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import axios from '../../utils/axios';
import DatePicker, {TimePicker} from 'sassy-datepicker';
import './setcalendar.css';
import '../css/customCalendar.css'
import 'react-time-picker/dist/TimePicker.css'
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
        marginTop: '30px',
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


const SetCalendar = ({setopenCalendar, openCalendar, times, 
    getAvailibity, availabilities, setTimes, setActiveDay, activeDay
    })=>{

        const [value, onChangeValue] = useState('10:00');
        const [selectedTime, setSelectedTime] = useState(null);

    const onChangeTime = (tim)=>{
        console.log(tim);
        let t = `${tim.hours}:${tim.minutes}`;
        setSelectedTime(t);
    }

    const onChange = (date) => {
        console.log('hhhh', convert(date))
        setActiveDay(convert(date))
        let b = availabilities.filter(item => item.key === convert(date));
    
            if(b.length > 0){
               
                setTimes(b);
                // setSelectedTime(b[0].values[0].time_cut);
            }else{
                setTimes([
                    {
                        key: 0,
                        values: []
                    }
                ])
            }
            console.log('this is the response ', b);
      };

      function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
      }
      
      const addTimeDate = async()=>{
        const userToken = getFromStorage('userToken');
        const token = JSON.parse(userToken).key
        let id = JSON.parse(userToken).id;

        let newTime = {
            day_cut: activeDay,
            time_cut: selectedTime,
            therapist: id,
            max_people: 10
        }
        console.log('time to adddd',newTime)
        await axios.post(`/booking-api/availibilities/`, newTime,
        { headers: {"Authorization": `Token ${token}`} })
        .then((res)=>{
          console.log("added successfully");
          getAvailibity(activeDay);
        })
        .catch((err)=>{
          console.log(err);
          alert(
            "Error adding time, please try again",
          );
        })
    }

    return(
      <Modal
    //   toggle={()=> setopenCalendar(false)}
      isOpen={openCalendar}
      onClosed={()=> setopenCalendar(false)}
    //   size=''
  >
      {/* <ModalHeader toggle={function noRefCheck(){}}>
        Modal title
    </ModalHeader> */}
      <div className="profileallery">
        <div className="container-profil">
          <div className="container-foter">
                <div className=" reviewws" style={{width: '100%'}}>
                    <div className="" style={{position: 'absolute', right: '10px'}} onClick={()=> setopenCalendar(false)}>
                        <FontAwesomeIcon className="iconss" icon={faClose} size="2x"/>
                    </div>
                    <h3>Set Calendar <span></span></h3>
                    <div className="right-body">
                        <div className="center">
                            <DatePicker onChange={onChange} className="datepicker"/>
                            <div class="hours">
                                <div>
                                {times[0].values.length < 1 && (
                                <div style={{width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                                    <p style={{ fontSize: 18, fontWeight: '600', color: 'gray', marginBottom: 10 }}>No time slot available for this day</p>
                                </div> 
                                )}
                                {times[0].values.map((element, imdex) => {
                                    return(
                                            <div key={imdex} class="hour" 
                                            style={{ backgroundColor: '#ff9933' }}
                                            >
                                                {element.time_cut}
                                            </div>
                                    )}
                                )}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    
                    <div style={styles.contain}>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <h4>Add a new time slot</h4>
                        </div>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <TimePicker onChange={onChangeTime} value={value} />
                        </div>
                        <div style={{width: '100%', justifyContent: 'center', display:'flex'}}>
                            <button style={styles.cancelbtn} className="button-addd" onClick={()=>addTimeDate()}>Add Time</button>
                        </div>
                    </div>
                    
                </div>
            </div>
            </div>
            </div>
      </Modal>
    )
}

export default SetCalendar