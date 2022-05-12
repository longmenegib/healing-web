import React, { useState, useEffect, useMemo }  from 'react'
import './css/profileGallery.css'
import './css/customCalendar.css'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage';
import DatePicker from 'sassy-datepicker';
import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from 'reactstrap'
import ReactStars from "react-rating-stars-component";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'

const styles = {
    timeslot:{
        color: '#fff',
        // backgroundColor: 'linear-gradient(180deg, #cd3732, #f48e1e)',
        border: 'none'
    },
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
    subtile:{
        width: '100%',
        display:'flex',
        // alignItems:'center',
        // marginTop: 20,
        marginBottom: '10px',
        flexDirection: 'column',

    },
    sub:{
        width: '100%',
        display:'flex',
        // alignItems:'center',
        marginTop: 10,
        marginBottom: 0,
        justifyContent: 'center'
    },
    cancelbtn:{
        width: '200px',
        backgroundColor: '#ff9933',
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


export default function ProfileGallery() {

  const navigate = useNavigate();
  let { id } = useParams();
  const [detail, setDetail] = useState({
      properties:{
        reviews:[],
        photos:[],
        categories:[]
      }
  });

  const [openOrderPay, setOpenPay] = useState(false)
  const [select, setSelect] = useState(0);
  const [openReview, setOpenReview] = useState(false);
  const [review, setReview] = useState("");
  const [rate, setRate] = useState(1);
  const [show, setShow] = useState(false)
  const [availabilities, setAvailabilities] = useState([]);
  const momentDate = moment().format('YYYY-MM-DD');
    const [activeDay, setActiveDay]= useState(momentDate);
    
    const [selectedTime, setSelectedTime] = useState(null);
    const [order, setOrder] = useState({});
    const [times, setTimes] = useState([]);
    const [openBooking, setOpenBooking] = useState(false)

    const [selectedOffer, setSelectedOffer] = useState({});
    const [offers, setOffers] = useState([]);

    const [showAddreview, setShowaddreview ] = useState(false);
    const [descript, setDescript] = useState(false)

  useEffect(()=>{
    getDetails();
}, []);



useEffect(()=>{
    console.log("helloo")
    getAvailibity();

    return ()=>{

    }
}, [])

useEffect(()=>{
    // console.log('these are the element ',detail);
    getOffers();
}, []);

//get informations on each therati
const getOffers = async()=>{
    // const userToken = getFromStorage('userToken');
    // const token = JSON.parse(userToken).key;
    await axios.get(`/market-api/therapists/${id}/offers`)
    .then(async res => {
        console.log('this is the response ',res.data);
        setOffers(res.data);
    })
    .catch(err => {
        console.log(err);
    });
}

const onChange = (date) => {

    console.log('hhhh', convert(date))
    setActiveDay(convert(date))
    let b = availabilities.filter(item => item.key === convert(date));

        if(b.length > 0){
        //    setSelectedTime(b[0].values[0].time_cut);
        //     setTimes(b[0].values);
        getAvailibity(convert(date));
        }
        else{
            setTimes([])
        }
        console.log('this is the response ', b);
  };

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
  }

//get informations on each therati
const getDetails = async()=>{
    await axios.get(`/user-api/therapists/${id}/detail`)
    .then(async res => {
        console.log('this is the response details',res.data.properties);
        setDetail(res.data);
        setShow(true);
    })
    .catch(err => {
        console.log(err);
    });
}

const getAvailibity = async(ddd)=>{
    
    await axios.get(`http://healing-market.herokuapp.com/booking-api/therapists/${id}/availibilities`, { timeout: 10000 })
    .then(async res => {
        let arr =sortArray('day_cut', res.data);
        // getDatetime(0);
        setAvailabilities(arr);
        let b = arr.filter(item => item.key === ddd);

        if(b.length > 0){
            setSelectedTime(b[0].values[0].time_cut);
            setTimes(b[0].values);
        }else{
            setTimes([])
        }
        console.log('this is the response ', arr);
    })
    .catch(err => {
        console.log(err);
    });
}

const sortArray = (key, arr)=>{
    const sorted = arr.reduce((rv, x)=>{
      let v= key instanceof Function ? key(x) : x[key];
      let el = rv.find((r)=>r && r.key === v);
      if(el){
        el.values.push(x);
      }else{
        rv.push(
          {key:v, values:[x]}
        );
      }
      return rv;
    }, []);

    return sorted;
  }

  const selectTimefunction = (ele)=> {
        console.log(ele.time_cut);
        setSelectedTime(ele.time_cut);
  }
  

const submitReview = async(e)=>{
    e.preventDefault();
    setShowaddreview(true);
    const userToken = getFromStorage('userToken');
    const client_id = JSON.parse(userToken).id;
    const token = JSON.parse(userToken).key
    console.log('client id id',client_id);
    console.log('therapist id i',detail);
    let is_therapist = JSON.parse(userToken).is_therapist;
    if(is_therapist){
        setShowaddreview(false);
        return alert(
            "Can't perform this action"
        );
    }
    if(review && rate){
        let data = {
            therapist: detail.id,
            client: client_id,
            description: review,
            rating_value: rate
        }
        console.log('payload ',data);
        await axios.post('/market-api/reviews/', data, { headers: {"Authorization": `Token ${token}`} })
        .then(async res => {
            console.log(res.data);
             //submit the rating now after
            let dataRate = {
                therapist: id,
                client: client_id,
                value: rate
            }
            await axios.post('/market-api/ratings/', dataRate, { headers: {"Authorization": `Token ${token}`} })
            .then(async res => {
                // console.log(res.data);
                getDetails();
                setOpenReview(false);
                setShowaddreview(false);
            })
            .catch(err => {
                setShowaddreview(false);
                alert(
                    "Rating not saved"
                );
            });
            
        })
        .catch(err => {
            setShowaddreview(false);
            alert(
                "Review not saved"
            );
        });
    }else{
        alert("Enter a review");
        setShowaddreview(false);
    }
}

const convertTo = (time12h)=>{
    const [time, modifier]= time12h.split(' ');

    let [hours, minutes] = time.split(':');
    if(hours === '12'){
      hours = '00';
    }

    if(modifier === 'PM'){
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }


const ratingChanged = (newRating) => {
    console.log(newRating);
    setRate(newRating);
  };

  const makeOrder = async()=>{
      console.log('goood');
      const userToken = getFromStorage('userToken');
        let is_therapist = JSON.parse(userToken).is_therapist;
        if(is_therapist){
            return alert(
                "Can't perform this action"
            );
        }
      navigate(`/payment/`, {
          state: {order: order}
      });
  }

  const bookingNow = ()=>{

    if(!selectedTime){
        alert("select a timeslot first")
        return
    }

    try{
        let order = {
            therapist: id,
            status: 0,
            start_date: activeDay,
            start_time: convertTo(selectedTime),
            price: selectedOffer.price,
            user: detail.properties.label,
            selectedDate: moment(activeDay).format('dddd [the] Do [of] MMMM'),
            displayTime: selectedTime,
            offer: selectedOffer.id
        }
        console.log('this is the order: ', order);
        setOrder(order);
        setSelectedTime("");
        setOpenBooking(false);
        setOpenPay(true);
    }catch(err){
        alert("select a timeslot first");
        return;
    }
  }

  const openBookingSet = ()=>{
   
    const userToken = getFromStorage('userToken');
    if(userToken){
        setDescript(false);
        setOpenBooking(true);
    }else{
        navigate(`/signin`, {state: {goto: 'profile', link: id}});
    }
  }

  const openDescript = (elem)=>{
    setDescript(true);
    setSelectedOffer(elem);
  }

  const openReviewFunction = ()=>{
    const userToken = getFromStorage('userToken');
    if(userToken){
        setOpenReview(true);
    }else{
        navigate(`/signin`, {state: {goto: 'profile', link: id}});
    }
  }

  const OrderPayModal = useMemo(()=>{
      return(
        <Modal
        // toggle={function noRefCheck(){}}
        isOpen={openOrderPay}
        onClosed={()=> setOpenPay(false)}
    >
            <div>   
            <div style={styles.contain}>
                    <div style={styles.subtile}>
                        <div className="" style={{position: 'absolute', right: '10px', top: -20}} onClick={()=> setOpenPay(false)}>
                            <FontAwesomeIcon className="iconss" icon={faClose} size="2x"/>
                        </div>
                        <p style={{ fontSize: '16px', color: 'gray', textAlign: 'center', fontFamily: 'arial' }}>
                            You want to set an appointment with
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', textAlign: 'center' }}>{order.user}</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'gray', textAlign: 'center' }}>on</p>
                    </div>
                    <div style={styles.sub}>
                        <p style={{ fontSize: '28px', fontWeight: '700', color: 'black', textAlign: 'center', fontFamily: 'arial' }}>
                           {order.selectedDate} At {order.displayTime}
                        </p>
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}} onClick={makeOrder}>
                        <p style={styles.cancelbtn}>Book now (${order.price})</p>
                    </div>

                </div>
            </div>
            
        </Modal>
      )
  })

    const AddReview = useMemo(()=>{
        return(
            <Modal
            // toggle={function noRefCheck(){}}
            isOpen={openReview}
            onClosed={()=> setOpenReview(false)}
        >
            <ModalHeader>
            Add a review
            </ModalHeader>
            <ModalBody>
            <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#ffd700"
                value={rate}
            />
                <form>
                <textarea value={review} onChange={(e)=> {
                    e.preventDefault();
                    setReview(e.target.value)
                }} 
               placeholder="Enter your review here" required></textarea>
                </form>
            </ModalBody>
            <ModalFooter>
            <Button
                className="button-add"
                onClick={submitReview}
                disabled={showAddreview}
            >
                {showAddreview ?
                    <Spinner style={{ width: '1.5rem', height: '1.5rem', color: 'white' }}
                    children={false} />
                    : 
                    <span>Add</span>
                }
            </Button>
            
            <Button onClick={()=> setOpenReview(false)}>
                Cancel
            </Button>
            </ModalFooter>
        </Modal>
        )
    })


    const BookingCalendar = useMemo(()=>{
        return(
            <Modal
            // toggle={function noRefCheck(){}}
            isOpen={openBooking}
            onClosed={()=> setOpenBooking(false)}
            size="lg"
        >
            <ModalHeader>
                Select your booking timeslot
            </ModalHeader>
            <ModalBody>
            <div className="center">
                            <DatePicker onChange={onChange} className="datepicker"/>
                            <div className="hours">
                                <div>
                                {times.length < 1 ? (
                                <div style={{width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                                    <p style={{ fontSize: 18, fontWeight: '600', color: 'gray', marginBottom: 10 }}>No time slot available for this day</p>
                                   
                                </div> 
                                ) : 
                                <>
                                {times.map((element, imdex) => {
                                    return(
                                            <div key={imdex} onClick={()=>selectTimefunction(element)}
                                            className={selectedTime===element.time_cut ? 'hour hourer' : 'hour'}
                                            >
                                                {element.time_cut}
                                            </div>
                                    )}
                                )}
                                </>
                                }
                                </div>
                                {/* <button onClick={()=> bookingNow()}>Book now</button> */}
                            </div>
                        </div>
            </ModalBody>
            <ModalFooter>
            <Button
                className="button-add"
                onClick={bookingNow}
            >
                Confirm booking
            </Button>
            
            <Button onClick={()=> setOpenBooking(false)}>
                Cancel
            </Button>
            </ModalFooter>
        </Modal>
        )
    });

    const OfferDescription= useMemo(()=>{
        return(
            <Modal
                // toggle={function noRefCheck(){}}
                isOpen={descript}
                onClosed={()=> setDescript(false)}
                size="lg"
            >
                {/* <ModalHeader style={{width: '100%'}}> */}
                    <div className="" style={{flex: 1, width: '100%', padding: 20, borderBottom: '1px solid gray', position: 'relative', display: 'flex', alignItems: 'center'}}>
                        <div style={{width: '100%', fontSize: 22}}>
                            Offer Description
                        </div>
                        <div style={{width: '100%'}}>
                        <Button
                            className="button-add"
                            // onClick={openBookingSet}
                            style={{position: 'absolute', top: 10, right: 10}}
                        >
                            ${selectedOffer.price}
                        </Button>
                        </div>
                    </div>
                {/* </ModalHeader> */}
                <ModalBody>
                    <div className="">
                        <h3>{selectedOffer.category}</h3>
                        <div>
                            {selectedOffer.description}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                <Button
                    className="button-add"
                    onClick={openBookingSet}
                >
                    Book now
                </Button>
                
                <Button onClick={()=> setDescript(false)}>
                    Cancel
                </Button>
                </ModalFooter>
            </Modal>
        )
    })


  return (
      <>
      <Header />
      {AddReview}
      {OrderPayModal}
      {BookingCalendar}
      {OfferDescription}
      <div className="profileGallery" style={{paddingTop: 120}}>
        <div className="container-profile">
            <div className="container-header">
                <div className="header-img">
                    <img src={detail.properties.logo || "../assets/image/group-1.svg"} alt="" style={{width: '100%', objectFit: 'cover'}} />
                </div>
                <div className="header-title">
                    <div className="profile-card-map">
                        <h3>{detail.properties.label}</h3>
                        <div>
                            <img src="../assets/icons/map.svg" alt=""/>
                            <span>{detail.properties.address}</span>
                        </div>
                    </div>
                    <div className="profile-card-star">
                    {detail.properties.rating >= 0 && (
                        <ReactStars
                        count={5}
                        size={24}
                        edit={false}
                        activeColor="#ffd700"
                        value={Math.ceil(detail.properties.rating)}
                    />
                    )}
                        
                    </div>
                    <p>{detail.properties.categories.join('-')}</p>
                    <div className="profile-card-contact">
                        <li><a href={`mailto: ${detail.properties.email}`}><img src="../assets/icons/mail.svg" alt=""/></a><span>Send a message</span></li>
                        <li><a href={`tel: ${detail.properties.phone}`}><img src="../assets/icons/phone.svg" alt=""/></a><span>Contact</span></li>
                    </div>
                </div>
            </div>
            <div className="container-footer">
                <div className="profile-card">
                        <h3>Description <span></span></h3>
                        <p>
                            {detail.properties.description}
                        </p>
                    </div>
                 <div className="footer-left review-web">
                    <div className="profile-card">
                        <h3>Review <span></span></h3>
                        <div className="box">
                        {detail.properties.reviews.map((rev)=>{
                                    return(
                            <div className="list">
                                <div className="list-text">
                                    <h3>{rev.client}</h3>
                                    <p>{rev.description}</p>
                                </div>
                                <div className="profile-card-star">
                            {detail.properties.rating && (
                            <ReactStars
                                    count={5}
                                    edit={false}
                                    size={12}
                                    activeColor="#ffd700"
                                    value={rev.rating_value}
                                />
                        )}
                                </div>
                            </div>
                                    )
                        })}
                        </div>
                        <Button onClick={openReviewFunction}>
                            <span>Add a review</span>
                        </Button>
                    </div>
                </div>
                
                <div className="footer-right">
                    <div className="right-header">
                        <div className="center">
                            <li className={select ? "active" : ""} onClick={()=> setSelect(1)}>
                                <img src="../assets/icons/galleryOrange.svg" alt=""/>
                                <span>View Gallery</span>
                            </li>
                            <li className={!select ? "active" : ""} onClick={()=> setSelect(0)}>
                                <img src="../assets/icons/calendarGray.svg" alt=""/>
                                <span>My Offers</span>
                            </li>
                        </div>
                    </div>
                    <div className="right-body">
                        {select ?
                        <div className="center">
                            {/* <img src="../assets/icons/galleryGray.svg" alt=""/>
                            <img src="../assets/icons/galleryGray.svg" alt=""/>
                            <img src="../assets/icons/galleryGray.svg" alt=""/>
                            <img src="../assets/icons/galleryGray.svg" alt=""/>
                            <img src="../assets/icons/galleryGray.svg" alt=""/>
                            <img src="../assets/icons/galleryGray.svg" alt=""/>
                            <img src="../assets/icons/galleryGray.svg" alt=""/>
                            <img src="../assets/icons/galleryGray.svg" alt=""/> */}
                            <div className="imagess">
                            <div className="center">
                                {detail.properties.photos.map((img, index)=>{
                                    return(
                                        <img key={index} src={img.image || "./../assets/image/group-1.svg"} alt=""/>
                                    )
                                })}
                                </div>
                            </div>
                        </div>
                        :
                        <>
                            {/* <div onClick={()=>setOpenBooking(true)}>Select</div> */}
                            <div>
                                <div className="slides">
                                    {offers.map((ele, index)=>{
                                    return(
                                    <div key={index} className="home-card">
                                        <div className="home-card-img">
                                            <img src={ele.illustration || "../assets/image/group-1.svg"} alt="" style={{width: '100%', objectFit: 'cover', height: '100px'}}/>
                                        </div>
                                        <div className="home-card-map">
                                            <h3 style={{textAlign: 'center', width: '100%'}}>{ele.category} </h3>
                                            <div style={{display: 'flex',flexDirection: 'column'}}>
                                                <p>{ele.description.slice(0, 30)}...</p>
                                                <h4>$ {ele.price}</h4>
                                            </div>
                                        </div>
                                    
                                        <button onClick={()=>openDescript(ele)}>Learn more</button>
                                    </div>
                                    )}
                                    )}
                                </div>
                            </div>
                        </>
                        }
                    </div>
                    <div className="footer-left review-mobile">
                    <div className="profile-card">
                        <h3>Review <span></span></h3>
                        <div className="box">
                        {detail.properties.reviews.map((rev)=>{
                                    return(
                            <div className="list">
                                <div className="list-text">
                                    <h3>{rev.client}</h3>
                                    <p>{rev.description}</p>
                                </div>
                                <div className="profile-card-star">
                            {show && (
                            <ReactStars
                                    count={5}
                                    edit={false}
                                    size={12}
                                    activeColor="#ffd700"
                                    value={rev.rating_value}
                                />
                        )}
                                </div>
                            </div>
                                    )
                        })}
                        </div>
                        <button onClick={openReviewFunction}>Add a review</button>
                    </div>
                </div>
                
                </div>
               
            </div>
        </div>
    </div>

    <Footer />
    </>
    
  )
}
