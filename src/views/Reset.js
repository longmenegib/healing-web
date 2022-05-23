import React, {useState} from 'react'
import './css/signin.css'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'
import {useNavigate, useParams} from 'react-router-dom';

import axios from './../utils/axios';
import { Button, Spinner } from 'reactstrap'

export default function Reset() {

  const navigate = useNavigate();
  const {uid, token} = useParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

    const login = async(e)=>{
      e.preventDefault();
        setShow(true);
        console.log("this is is ", {uid, token})
        if(email && password){
            if(email !== password){
                return alert("Password should match!");
            }
            const data = {
                new_password1: email,
                new_password2: password,
                uid: uid,
                token: token
            }
              await axios.post('/rest-auth/password/reset/confirm/', data, { withCredentials: false, timeout: 10000 })
              .then(async res => {
                console.log(res.data);
                setShow(false);
                alert(res.data.detail);
                navigate('/signin')
              })
              .catch(err => {
                console.log(err);
                setShow(false);
              });
          }else{
            setShow(false);
            alert(
              "All fields are required"
            );
          }
          
        }
      
   

  return (
    <>
      <Header />
    <div className="sigin" style={{paddingTop: 120}}>
        <div className="center">
            <div className="title">
                <h2>Reset your password</h2>
                <img src="../assets/icons/user.svg" alt="" />
            </div>

            <form>
                <div className="form-input">
                    <input value={email} onChange={(e)=> setEmail(e.target.value)} type="password" name="username" id="username" placeholder="Password" />
                    <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" name="password" id="password" placeholder="Re-enter password" />
                </div>
                <div className="buttons">
                    <Button style={{backgroundColor: '#ff9933', color: 'white'}} disabled={show} onClick={login}>
                    {show ?
                    <Spinner style={{ width: '1.5rem', height: '1.5rem', color: 'white' }}
                    children={false} />
                    : 
                    <span>Reset</span>
                }
                    </Button>
                </div>
            </form>
        </div>
    </div>
      <Footer />
    </>
  )
}
