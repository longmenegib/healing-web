import React, {useState, useEffect, useContext} from 'react'
import './css/signup.css'
// import '../scss/signup.scss'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'


import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { loadStripe } from "@stripe/stripe-js";

import {useNavigate} from 'react-router-dom';

import { AuthContext } from '../App';
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage'

const stripe = loadStripe(
    "pk_live_51IMgMoD0JaUAVNhkluLE0zZhay0VbtxQ0NKoRjoas5CEyYrbX8DTKI2xPH7GYiYbsljAiy8sxEkKQWVktYa3KU6R001wbzfLnc"
  );

export default function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [category, setCategory] = useState([]);
    const [label, setLabel] = useState('');
    const [phone, setPhone] = useState('');
    const [tags, setTags] = useState('');
    const [business, setbusiness] = useState('');
    const [descript, setDescript] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [states, setStates] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [booking_fee, setBooking_fee]=useState('');
    const [image, setImage] = useState([]);
    const [fileResponse, setfileResponse] = useState([]);
    const [logo, setLogo] = useState([]);
    const [dob, setDob] = useState("");


    const {signIn} = useContext(AuthContext);
    const animatedComponents = makeAnimated();
    const [selectedItem, setSelectedItem] = useState([]);

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
                    let arr = myfunction(res.data.results);
                    
                    setCategory(arr);
                }
            }).catch(err => {
                console.log(err);
            })
    }

    function myfunction(arr) {
        return arr.map(function(e) {
          return {
            label: e.label,
            value: e.id
          };
        });
      }

    function validatePhoneNumber(input_str) {
        var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
      
        return re.test(input_str);
      }
    
      function validateZip(zip){
        const re = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
        console.log(re);
        return re.test(zip);

      }

      function CheckValid(str){
        const re = /^\S+$/
        return re.test(str)
    }

    function checkPassword(str) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{6,}$/;
        return re.test(str);
    }
    function isEmail(email) {
       
        var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          
        return regexp.test(String(email).toLowerCase());
    }
      

    const register = async(e)=>{
        e.preventDefault();

        if(selectedItem.length < 1){
            alert(
                'Select at least one category'
            )
            return;
        }
        let result = selectedItem.map(({ value }) => value)
        console.log(result);

        if(username && email && password && phone && tags && business &&
            states && address && city && zipcode && dob ){

            if(!isEmail(email)){
                alert('Enter a valid email address');
                return ;
            }
            if(password.length < 8){
                alert('Password require at least 8 character');
                return ;
            }
            if(!CheckValid(username)){
                alert('Username should not have space');
                return ;
            }
            if(!validatePhoneNumber(phone)){
                alert("not correct phone number");
                return
            }
    
            if(!validateZip(zipcode)){
                alert("not a valid us zipcode");
                return
            }else{
                // alert("corret")
                // return
            }

            const userinfos = { username: username, is_client: false, is_therapist: true,
                email: email, password1: password, password2: password,  }
            let therapistinfo;
            navigator.geolocation.getCurrentPosition(async(location)=>{
                console.log("this is the location: ", location.coords);
                let latitude = location.coords.latitude;
                let longitude = location.coords.longitude;
    
                therapistinfo = {
                    // 'logo': logo[0].uri,
                    'phone': phone,
                    'address': address,
                    'city': city,
                    'region': states,
                    'label': business,
                    // 'category': label,
                    'zip_code': zipcode,
                    'location': {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    'description' : descript,
                    'birthdate': dob,
                }
                console.log('date date', dob);
                navigate('/register-subscription', {
                    state: {userinfos: userinfos, therapistinfo: therapistinfo,
                    logo: logo, image: image, fileResponse: fileResponse, tags: tags,  category: result
                    }
                });
            },
            (error)=>{
                console.log('error from location: ', error);
                return ;
            },
            
            );
        }else{
            alert("All fields are required")
        }
        
      }
    
      const styleSelect = {
        control: base => ({
          ...base,
          border: '2px solid #f7951d',
          boxShadow: 'none',
          borderRadius: 30,
          '&:hover': {
            border: '2px solid #f7951d !important'
         },
         '&::placeholder':{
             color: '#f7951d !important'
         }
        })
      };

  return (
    <>
      <Header />
    <div className="sigup" style={{paddingTop: 120}}>
        <div className="center">
            <div className="title">
                <h2>Sign up</h2>
                <img src="../assets/icons/user.svg" alt="" />
            </div>

            <form>
                <div className="text">
                    <h3>Already have an account ? <a href="signin">Login in instead!</a></h3>
                    <h3>Please fill in all the required fields correctly and then validate your registration</h3>
                </div>
                <div className="form-input">
                    <input value={username} onChange={(e)=> setUsername(e.target.value)} type="text" name="username" id="username" placeholder="Username" required />
                    <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Email address" required />
                    <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" name="password" id="password" placeholder="Password" required />
                   
                    <Select
                        defaultValue={[category[0]]}
                        isMulti
                        name="categories"
                        options={category}
                        className="basic-multi-select"
                        classNamePrefix="select a category"
                        onChange={(e)=> setSelectedItem(e)}
                        styles={styleSelect}
                        placeholder="Choose category"
                    />

                    <input value={business} onChange={(e)=> setbusiness(e.target.value)} type="text" name="business" id="business" placeholder="Business name" required />
                    <textarea value={descript} onChange={(e)=> setDescript(e.target.value)} type="text" name="Description" id="descr" placeholder="Business Description" required></textarea>
                    <input value={address} onChange={(e)=> setAddress(e.target.value)} type="text" name="address" id="address" placeholder="Address" required />
                    <input value={phone} onChange={(e)=> setPhone(e.target.value)} type="number" name="phone" id="phone" placeholder="Phone number" required />
                    <input value={states} onChange={(e)=> setStates(e.target.value)} type="text" name="state" id="state" placeholder="State" required />
                    <input value={city} onChange={(e)=> setCity(e.target.value)} type="text" name="city" id="city" placeholder="City" required />
                    <input value={zipcode} onChange={(e)=> setZipcode(e.target.value)} type="text" name="zipcode" id="zipcode" placeholder="Zipcode" required />
                   
                    <input value={tags} onChange={(e)=> setTags(e.target.value)} type="text"  placeholder="Tags (ex: headache, eyes pronblem...)" required />
                    <input value={dob} onChange={(e)=> setDob(e.target.value)} type="date"  placeholder="Date of Birth " required />
                    <div className="form-input-files">
                        <div className="files-card">
                            <label htmlFor="company">Add your company logo</label>
                            <input onChange={(e)=> setLogo(e.target.files[0])} type="file" name="company" id="company" className="choose-file" required />
                        </div>
                        <div className="files-card">
                            <label htmlFor="additional">Add additional images</label>
                            <input onChange={(e)=> setImage(e.target.files)} type="file" name="additional" id="additional" className="choose-file" multiple />
                        </div>
                        
                    </div>
                    <div className="form-input-files" style={{}}>
                        {/* <div className="files-card">
                            <label for="company">Add your company logo</label>
                            <input type="file" name="company" id="company" className="choose-file" required />
                        </div> */}
                        <div className="files-card">
                            <label htmlFor="additionall">Add certificate</label>
                            <input onChange={(e)=> setfileResponse(e.target.files[0])} type="file" name="additionall" id="addition" className="choose-file" multiple />
                        </div>
                    </div>
                </div>
                <div className="form-pay">
                    <div className="control">
                        <input type="checkbox" name="pay" id="pay" checked />
                    </div>
                    <label>$14.99 / Month</label>
                    <p>List tour business for one low montly fee to get unlimited visibility ! Enjoy 30 days free trial
                    </p>
                </div>
                <div className="buttons">
                    <button type="reset">Cancel</button>
                    <button onClick={register}>Register</button>
                </div>
            </form>
        </div>
    </div>
      <Footer />
    </>
  )
}
