import React, {useState, useContext, useMemo} from 'react'
import './css/signin.css'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'
import {useNavigate} from 'react-router-dom';

import { AuthContext } from '../App';
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setpassErr] = useState('');
  const {signIn} = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);

    const login = async(e)=>{
      e.preventDefault();
        setEmailErr("");
        setpassErr("");
        if(email && password){
            const data = {username: email, password: password }
              await axios.post('/user-api/custom/login', data, { withCredentials: false, timeout: 10000 })
              .then(async res => {
                console.log(res.data);
                let user = res.data;
                if(res.data.is_therapist){
                  user.id = res.data.therapist_id;
                }
                
                setInstorage('userToken', JSON.stringify(user));
                signIn();
                navigate(`/`);
              })
              .catch(err => {
                console.log(err);
                  alert(
                    `Wrong username or password`,
                  )
              });
          }else{
            alert(
              "All fields are required"
            );
            if(!email){
              setEmailErr('username is required');
            }
            if(!password){
              setpassErr('password is required');
            }
          }
          
        }
      
    const submitEmail = async(e) => {
      e.preventDefault();
      if(!email){
        return alert("Please enter a valid email address");
      }
      var data = {
        email: email,
    };
    console.log(data);
    await axios.post('/rest-auth/password/reset/', data, { timeout: 10000, withCredentials: false })
    .then(res=>{
        console.log(res.data);
        alert(`${res.data.detail}`);
        setOpenModal(false);
    })
    .catch(err=>{
        alert(
      "ERROR: Could not submit email address"
    );
    })
    }

    const openClick = (e)=>{
        e.preventDefault();
        setOpenModal(true);
    }
    
    const openEmail = useMemo(()=>{
      return(
          <Modal
          // toggle={function noRefCheck(){}}
          isOpen={openModal}
          onClosed={()=> setOpenModal(false)}
      >
          <ModalHeader>
          Recover your password.
          </ModalHeader>
          <ModalBody>
              <form>
              <input value={email} onChange={(e)=> {
                  e.preventDefault();
                  setEmail(e.target.value)
              }} 
             placeholder="Enter your email address here" required/>
              </form>
          </ModalBody>
          <ModalFooter>
          <Button
              className="button-add"
              onClick={submitEmail}
          >
              Submit
          </Button>
          {' '}
          <Button onClick={()=> setOpenModal(false)}>
              Cancel
          </Button>
          </ModalFooter>
      </Modal>
      )
  })

  return (
    <>
      <Header />
      {openEmail}
      
    <div className="sigin" style={{paddingTop: 120}}>
        <div className="center">
            <div className="title">
                <h2>Sign in</h2>
                <img src="../assets/icons/user.svg" alt="" />
            </div>

            <form>
                <div className="p">
                    <h3>Dont have an account ? <a href="signup-as">Sign up!</a></h3>
                    <h3>Please fill in all the required fields correctly</h3>
                </div>
                <div className="form-input">
                    <input value={email} onChange={(e)=> setEmail(e.target.value)} type="text" name="username" id="username" placeholder="Username" />
                    <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" name="password" id="password" placeholder="Password" />
                </div>
                <div className="buttons">
                    <button style={{backgroundColor: '#ff9933', color: 'white'}} onClick={login}>Login</button>
                    <button onClick={openClick}>Forgot your password</button>
                </div>
            </form>
        </div>
    </div>
      <Footer />
    </>
  )
}
