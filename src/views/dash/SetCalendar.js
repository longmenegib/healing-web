import React, { useState, useEffect, useMemo }  from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap'
import ReactStars from "react-rating-stars-component";
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import axios from '../../utils/axios';
import DatePicker, {TimePicker} from 'sassy-datepicker';
import './setcalendar.css';
import '../css/customCalendar.css'
import 'react-time-picker/dist/TimePicker.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';


const mark = [
    '2022-05-24',
]

const styles = {
   
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
        color: 'white',
    },
}


const SetCalendar = ({setopenCalendar, openCalendar, times, 
    getAvailibity, availabilities, setTimes, setActiveDay, activeDay, markedDays, setMarkedDays
    })=>{

        const [value, onChangeValue] = useState('10:00');
        const [selectedTime, setSelectedTime] = useState(null);
        const [dob, setDob] = useState("");


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

    const deleteTIme = async(uiid) => {
         const userToken = getFromStorage('userToken');
        const token = JSON.parse(userToken).key
        let id = JSON.parse(userToken).id;
        await axios.delete(`http://healing-market.herokuapp.com/booking-api/availibilities/${uiid}/`, { headers: {"Authorization": `Token ${token}`} })
        .then((res)=>{
            console.log(res);
            alert("Timeslot deleted")
            getAvailibity(activeDay);
        })
        .catch((err)=>{
            console.log(err);
            alert("Unable to delete timeslot");
        })
    }


    const timeAction = async(uiid)=>{
        window.confirm('Are you sure you wish to delete this item?') ? deleteTIme(uiid) : console.log('cancel');
    }

    return(
      <Modal
    //   toggle={()=> setopenCalendar(false)}
      isOpen={openCalendar}
      onClosed={()=> setopenCalendar(false)}
      size='lg'
  >
      {/* <ModalHeader toggle={function noRefCheck(){}}>
        Modal title
    </ModalHeader> */}
      <div className="profileallery">
        <div className="container-profil">
          <div className="container-foter">
                <div className=" reviewws" style={{width: '100%'}}>
                    <div className="" style={{position: 'absolute', right: '25px'}} onClick={()=> setopenCalendar(false)}>
                        <FontAwesomeIcon className="iconss" icon={faClose} size="2x"/>
                    </div>
                    <h3 style={{textAlign: 'center'}}>Set Calendar <span></span></h3>
                    <div className="right-body">
                        <div className="center">
                            {/* <DatePicker onChange={onChange} className="datepicker"/> */}
                           
                            <Calendar
                                style={{ height: '100%', width: '100%' }}
                                onChange={onChange}
                                value={new Date()}
                                tileClassName={({ date, view }) => {
                                if(markedDays.find(x=>x===moment(date).format("YYYY-MM-DD"))){
                                return  'highlllight'
                                }
                                }}


                                // tileDisabled={({ date }) => date.getDay() === 0}

                                /*maxDate={new Date(2020, 1, 0)}</div>*/
                                // minDate={
                                // new Date()
                                // }
                            >
                            </Calendar>

                            <div class="hours">
                                <div>
                                {times[0].values.length < 1 && (
                                <div style={{width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                                    <p className="notimemsg" style={{ fontWeight: '600', color: 'gray', marginBottom: 10 }}>No time slot available for this day</p>
                                </div> 
                                )}
                                {times[0].values.map((element, imdex) => {
                                    return(
                                            <div key={imdex} class="hour" 
                                            style={{ backgroundColor: '#ff9933' }}
                                            onDoubleClick={() => timeAction(element.id)}
                                            >
                                                {element.time_cut}
                                            </div>
                                    )}
                                )}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    
                    <div className="downnnn">
                        <div style={{}}>
                            <h4>Add a new time for {activeDay}</h4>
                        </div>
                        {/* <input value={dob} onChange={(e)=> setDob(e.target.value)} type="date"  placeholder="Date of Birth " required /> */}
                        <div style={{}}>
                            <TimePicker onChange={onChangeTime} value={value} />
                        </div>
                        <div className="save-slot">
                            <button style={styles.cancelbtn} className="button-addd" onClick={()=>addTimeDate()}>Save slot</button>
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