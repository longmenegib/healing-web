import React, { useRef, useEffect }  from 'react'
import './css/acceuil.css'

import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRightAlt, faArrowRight, faUser } from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom';

export default function SelectSign() {

  const navigate = useNavigate();

  const sign = (ele)=>{
    if(ele===1){
        navigate(`/signup`);
    }else{
        navigate(`/register`);
    }
  }

  return (
     <>
      {/* <Header /> */}
        <div class="home" style={{height: '100vh'}}>
          <div class="container-home" style={{height: '100vh'}}>
              <div class="bg">
                  <img src="/assets/image/bg-2.svg" alt="" class="img-left"/>
                  <img src="/assets/image/bg-2.svg" alt="" class="img-center"/>
                  <img src="/assets/image/bg-2.svg" alt="" class="img-right"/>
              </div>

              <div>
                  <h2>SIGN UP</h2>
              </div>
              {/* <h3>Register as</h3> */}
              {/* <div class="subscribe">
                  <input type="email" name="email" id="email" placeholder="Symptoms or illness"/>
                  <button><img src="/assets/icons/search.svg" alt="seach"/></button>
              </div> */}

              <div class="home-cards" style={{marginTop: '30px'}}>
                  <div style={{width: '50%', margin: 'auto'}}>
                    <div class="home-card" 
                    // style={{backgroundColor: '#f7951d'}}
                    onClick={()=> sign(1)}
                    >
                        <FontAwesomeIcon style={{fontSize: '30px', color: 'red'}} color={'red'} icon={faUser} className="icons-btn"/>
                        <h2 style={{color: 'red', paddingTop: '20px'}}>Holistic Provider</h2>
                    </div>
                    <div class="home-card" 
                    style={{backgroundColor: '#f7951d'}}
                    onClick={()=> sign(0)}
                    >
                        <FontAwesomeIcon style={{fontSize: '30px', color: 'red'}} color={'red'} icon={faUser} className="icons-btn"/>
                        <h2 style={{color: 'white', paddingTop: '20px'}}>A Patient or Client</h2>
                    </div>
                </div>
              </div>
          </div>
      </div>
      {/* <Footer /> */}
     </>
  )
}
