import React, {useState, useContext} from 'react'
import './css/signup.css'
import '../scss/signup.scss'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'
import { AuthContext } from '../App';
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage'
import {useNavigate} from 'react-router-dom';

export default function PatientRegister() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameErr, setnameErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [passErr, setpassErr] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [phone, setPhone] = useState('');

    const {signIn} = useContext(AuthContext);
    const navigate = useNavigate();

    const createAccount = async(e)=>{
        e.preventDefault();
        if(!phone){
           alert(
              "All fields are required",
            );
            return ;
        }
        if(username && email && password){
          setIsSpinning(true);
          const data = { username: username, is_client: true, is_therapist: false,
              email: email, password1: password, password2: password }
            console.log("this is the data: ", data);
              await axios.post('http://healing-market.herokuapp.com/registration/', data, { withCredentials: false })
              .then(async respo => {
                console.log(respo.data);
                  let dataLog = {username: username, password: password }
               
                await axios.post('http://healing-market.herokuapp.com/user-api/custom/login', dataLog, { withCredentials: false })
                .then(async res => {
                    console.log(res.data);
                    setInstorage('userToken', JSON.stringify(res.data));
                    await axios.put(`http://healing-market.herokuapp.com/user-api/clients/${res.data.id}/`, {phone: phone, }, { headers: {"Authorization": `Token ${res.data.key}`} })
                    .then(ele => {
                        console.log('phone number added', ele);
                    }).catch(error=>{
                        console.log(error);
                    }) 
                    signIn();
                    navigate(`/home`);
                })
                .catch(err => {
                    console.log('error from signing on', err);
                });
                    
              })
              .catch(err => {
                setIsSpinning(false);
                console.log(err);
                if(err.response){
                  console.log("this is response error", err.response.data);
                  if(err.response.data.email){
                    setEmailErr(err.response.data.email[0]);
                  }
                  if(err.response.data.username){
                    setnameErr(err.response.data.username[0]);
                  }
                  if(err.response.data.password1){
                    setpassErr(err.response.data.password1[0]);
                  }
                }else if(err.request){
                 alert(
                    "Check your connection and try again",
                  )
                }else if(err.message){
                  console.log("this is the message error");
                }
              });
          }else{
           
            setIsSpinning(false);
            if(!username){
              setnameErr("username is required");
            }
            if(!email){
              setEmailErr('email is required');
            }
            if(!password){
              setpassErr('password is required');
            }
           
          }
          
        }
      
    const putErr = numb => {
        if(numb == 1){
        if(nameErr){
            return <p>{nameErr}</p>
        }
        }else if(numb == 2){
            if(emailErr){
            return <p>{emailErr}</p>
        }
        }else{
        if(passErr){
            return <p>{passErr}</p>
        }
        }
    }
  return (
    <>
      <Header />
    <div className="sigup" style={{paddingTop: 100}}>
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
                    {putErr(1)}
                    <input value={email} onChange={(e)=> setEmail(e.target.value)}  type="email" name="email" id="email" placeholder="Email address" required />
                    {putErr(2)}
                    <input value={password} onChange={(e)=> setPassword(e.target.value)}  type="password" name="password" id="password" placeholder="Password" required />
                    {putErr(3)}
                    <input value={phone} onChange={(e)=> setPhone(e.target.value)}  type="text" name="address" id="address" placeholder="Phone number" required />
                </div>
                <div className="buttons"  style={{alignSelf: 'center'}} >
                    {/* <button type="reset">Cancel</button> */}
                    <button style={{backgroundColor: '#ff9933', color: 'white'}} onClick={createAccount}>Register</button>
                </div>
            </form>
        </div>
    </div>
      <Footer />
    </>
  )
}
