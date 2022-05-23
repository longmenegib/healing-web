import React, { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap'
import { faStar, faRefresh, faCalendar, faDollarSign, faDollar, faMoneyBill, faImages } from '@fortawesome/free-solid-svg-icons'
import './css/dashboard.scss';
import './dash/dashhome.css'
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage';
import moment from 'moment' 

import OrderPayModal from './dash/Reviews';
import BookingList from './dash/BookingList';
import SetCalendar from './dash/SetCalendar';
import SetFee from './dash/SetFee';
import Gallery from './dash/Gallery';
import Subscription from './dash/Subscription';
import Services from './dash/Services';
import AddOffer from './dash/AddOffer';
// import Account from './dash/Account';


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


export default function DashboardHome() {

    const [user, setUser] = useState({});

  const [openReview, setOpenreview] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [boolingList, setboolingList] = useState([]);

  const [openAccount, setOpenAccount] = useState(false)
  const [number, setNumber] = useState(0);

  const [openFee, setopenFee] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showSubs, setshowSubs] = useState(false)

  const [openCalendar, setopenCalendar] = useState(false);
  const [availabilities, setAvailabilities] = useState([]);
  const [photos, setPhotos] = useState([]);
  const momentDate = moment().format('YYYY-MM-DD');

  const [activeDay, setActiveDay]= useState(momentDate);
  const [checkLink, setCheckLink] = useState(true);

  const [openService, setOpenService] = useState(false);
  const [offers, setOffers] = useState([]);

  const [openOffer, setOpenOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});

    const [times, setTimes] = useState([
        {
            key: 0,
            values: []
        }
    ]);

    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [offer, setOffer] = useState("");
    const [image, setImage] = useState([]);
    const [category, setCategory] = useState([{id: 1, label: 'Select a category'}]);
    const [typeOffer, setTypeOffer]= useState('add');
    const [offername, setOffername] = useState("");

    const [markedDays, setMarkedDays] = useState([]);

    useEffect(()=>{
        getDetails();
    }, []);

    useEffect(()=>{
        loadboolingList();
        return ()=>{

        }
    }, [])

    useEffect(()=>{
        getAvailibity(activeDay);
        return ()=>{

        }
    }, [])
    useEffect(()=>{
        getBill();
        return ()=>{

        }
    }, [])

    useEffect(()=>{
        // console.log('these are the element ',detail);
        getOffers();
    }, []);

    useEffect(()=>{
        getMarketCategory();
        return ()=>{
           
        }
    }, []);

    const getMarketCategory = async()=>{
        console.log('getting the category')
        axios.get('/market-api/categories/', { withCredentials: false })
            .then(async res => {
                // console.log(res.data.results);
                if(res.data.results.length > 0){
                    setCategory(res.data.results);
                    setOffer(res.data.results[0].id);
                }
            }).catch(err => {
                console.log(err);
            })
    }

    
    //get informations on each therati
    const getOffers = async()=>{
        const userToken = getFromStorage('userToken');
        const token = JSON.parse(userToken).key;
        let id = JSON.parse(userToken).id;
        await axios.get(`/market-api/therapists/${id}/offers`, { headers: {"Authorization": `Token ${token}`} })
        .then(async res => {
            console.log('this is the response ',res.data);
            setOffers(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }
    

    const loadboolingList = async()=>{
      let userToken = getFromStorage('userToken');
      console.log(userToken)
      let token = JSON.parse(userToken).key
      let id = JSON.parse(userToken).id;
        console.log(id);
       
        await axios.get(`/booking-api/therapists/${id}/bookings`, { headers: {"Authorization": `Token ${token}`}  })
        .then(async res => {
            console.log("boolingList: ", res.data);
            
            if(res.data.length > 0){
                setboolingList(res.data);
            }
        })
        .catch(err => {
            console.log("booking list not loaded: ", err);
            
        });
    }

  //get informations on each therati
  const getDetails = async()=>{
    let userToken = getFromStorage('userToken');
    console.log(userToken)
    let token = JSON.parse(userToken).key
    let id = JSON.parse(userToken).id;
    await axios.get(`/user-api/therapists/${id}/detail`, { headers: {"Authorization": `Token ${token}`} })
    .then(async res => {
        console.log('this is the response ',res.data.properties);
        setReviewList(res.data.properties.reviews);
        setPhotos(res.data.properties.photos);
        setUser(res.data.properties);
        if(res.data.properties.account_stripe_id){
            setCheckLink(true);
        }else{
            setCheckLink(false);
        }
    })
    .catch(err => {
        console.log(err);
    });
  }

  const getAvailibity = async(ddd)=>{
    const userToken = getFromStorage('userToken');
    let token = JSON.parse(userToken).token;
    let id = JSON.parse(userToken).id;
    await axios.get(`/booking-api/therapists/${id}/availibilities`, { timeout: 10000, headers: {"Authorization": `Token ${token}`} })
    .then(async res => {
        let arr =sortArray('day_cut', res.data);
        // getDatetime(0);
        setAvailabilities(arr);
        let b = arr.filter(item => item.key === ddd);

        let markedDay = [];

        for (let index = 0; index < arr.length; index++) {
            const element = arr[index].key;
            console.log('day to mark:', element);
            markedDay.push(element);
        }
        setMarkedDays(markedDay);

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
        console.log('this is the response ', arr);
    })
    .catch(err => {
        console.log(err);
    });
}

const getBill = async()=>{
    const userToken = getFromStorage('userToken');
    let token = JSON.parse(userToken).token;
    let id = JSON.parse(userToken).user_id;
    console.log("from the billl")
    await axios.get(`/booking-api/bookings/total`, { headers: {"Authorization": `Token ${token}`} })
    .then(async res => {
        console.log('this is the billl ',res.data);
        setNumber(res.data.total_amount);
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

  const openAccountshow = ()=>{
    setOpenAccount(true);
  }

  const openUpdate = (ele)=>{
      console.log(ele);
    setSelectedOffer(ele);
    setTypeOffer("update");
    setDescription(ele.description);
    setPrice(ele.price);
    // setOffername(ele.label);
    setOffer(category[0].id);
    setOpenOffer(true);
}

  const Account = useMemo(()=>{

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
                <div style={{color:'#ff9933', fontSize: '28px'}}>{number}</div>
            </div>
        </div>
      </Modal>
    )
})


  return (
    <div className="home">
        <OrderPayModal openReview={openReview} setOpenreview={setOpenreview} reviewList={reviewList}/>
        <SetCalendar 
            times={times} 
            getAvailibity={getAvailibity} 
            availabilities={availabilities} 
            setopenCalendar={setopenCalendar} 
            openCalendar={openCalendar}
            setTimes={setTimes}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            markedDays = {markedDays}
            setMarkedDays = {setMarkedDays}
        />
        {Account}
        <SetFee 
            openFee={openFee}
            setopenFee={setopenFee}
            getDetails={getDetails}
        />
        <Gallery 
            showGallery={showGallery}
            setShowGallery={setShowGallery}
            photos={photos} 
            getAvailibity={getAvailibity} 
        />

        <Subscription 
            setshowSubs={setshowSubs}
            showSubs={showSubs}
        />
        <Services 
            setOpenService={setOpenService}
            openService={openService}
            offers={offers}
            setOpenOffer={setOpenOffer}
            setSelectedOffer={setSelectedOffer}
            openUpdate={openUpdate}
        />

        <AddOffer 
            setOpenOffer={setOpenOffer}
            openOffer={openOffer}
            setSelectedOffer={setSelectedOffer}
            selectedOffer={selectedOffer}
            price={price} setPrice={setPrice} 
            category={category} setCategory={setCategory}
            description={description} setDescription={setDescription}
            offer={offer} setOffer={setOffer}
            image={image} setImage={setImage}
            typeOffer={typeOffer} setTypeOffer={setTypeOffer}
            getOffers={getOffers}
            setOpenService={setOpenService}
            offername={offername} setOffername={setOffername}
        />
        <div className="container-home" style={{height: '100%', paddingTop: 120}}>
            <div className="bg" style={{top: '20%'}}>
                <img src="/assets/image/bg-2.svg" alt="" className="img-left"/>
                <img src="/assets/image/bg-2.svg" alt="" className="img-center"/>
                <img src="/assets/image/bg-2.svg" alt="" className="img-right"/>
            </div>

            <div style={{display: 'flex', width: '400px', flexDirection:'row', justifyContent: 'space-evenly',  marginBottom: 30 }}>
                <div style={{ width: '50%',fontSize: 14, fontWeight: 'bold', color: 'white', backgroundColor: '#ff9933',
                    borderRadius: 50, textAlign: 'center', alignSelf: 'center', padding: 10}}>
                    Expiration date
                </div>
                <div style={{ width: '50%',fontSize: '14px', fontWeight: '400', color: '#ff9933', backgroundColor: 'white',
                    borderRadius: '50px', textAlign: 'center', alignSelf: 'center', padding: 10}}>
                    {user.end_subscription}
                </div>
            </div>
            <div className="home-cards">
            <div>
                <div className="home-card dash-card" onClick={()=> setOpenreview(true)}>
                <FontAwesomeIcon  icon={faStar} size="4x" color='#FFF' className="iconss"/>
                    <h2>Reviews</h2>
                </div>
                <div className="home-card dash-card" onClick={()=> setshowSubs(true)}>
                <FontAwesomeIcon className="iconss" icon={faRefresh} size="4x"/>
                    <h2>Subscription</h2>
                </div>
                <div className="home-card dash-card" onClick={()=> setopenCalendar(true)}>
                <FontAwesomeIcon className="iconss" icon={faCalendar} size="4x"/>
                    <h2>Set Calendar</h2>
                </div>
                
            {/* </div>
            <div> */}
                {/* <div className="home-card dash-card" onClick={()=> setopenFee(true)}>
                    <FontAwesomeIcon className="iconss" icon={faDollar} size="4x"/>
                    <h2>Update Fee</h2>
                </div> */}
                <div className="home-card dash-card" onClick={()=> setShowGallery(true)}>
                    <FontAwesomeIcon className="iconss" icon={faImages} size="4x"/>
                    <h2>My Gallery</h2>
                </div>
                <div className="home-card dash-card" onClick={openAccountshow}>
                    <FontAwesomeIcon className="iconss" icon={faMoneyBill} size="4x"/>
                    <h2>My Account</h2>
                </div>
                <div className="home-card dash-card" onClick={()=> setOpenService(true)}>
                    <FontAwesomeIcon className="iconss" icon={faMoneyBill} size="4x"/>
                    <h2>Offers</h2>
                </div>
            </div>

            <BookingList bookingList={boolingList}/>
        </div>
        </div>
      </div>
  )
}
