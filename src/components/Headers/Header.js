import React, { useState, useContext, useEffect }  from 'react'
import './header.css';
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage'

import {useNavigate} from 'react-router-dom';
import { AuthContext } from '../../App';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const Header = () => {
    const isAuthenticate = getFromStorage('userToken');
    const type = JSON.parse(isAuthenticate);
    const {signOut} = useContext(AuthContext);
    const [isSigning, setSigning] = useState(false);
    const navigate = useNavigate();

    const [scrolled,setScrolled]=useState(false);

    const handleScroll=() => {
        const offset=window.scrollY;
        if(offset > 180 ){
          setScrolled(true);
        //   alert('hello')
        }
        else{
          setScrolled(false);
        }
      }
    
      useEffect(() => {
        window.addEventListener('scroll',handleScroll)
      })

      let navbarClasses=['navigation'];
        if(scrolled){
            navbarClasses.push('scrolled');
        }

    const logout =()=>{
        deleteStorage('userToken');
        signOut();
        navigate(`/`);
    }
    const submitEmail = async() => {
        navigate(`/signup`);
      }
  

  return (
    <header className="header-header">
        <div className="aside">
            <div className="center">
                <div className="aside-right">
                    <img src="/assets/image/logo.svg" alt="logo"/>
                </div>
                <div className="aside-left" style={{}}>
                    {/* <ul className="navigation-left"> */}

                    
                        <li><a href="/">HOME</a></li>
                        <li><a href="/blog">BLOG</a></li>
                        {isAuthenticate && (<>
                            <li><a href="/dashboard">DASHBOARD</a></li>
                            </>
                        )}
                    <div className="line"></div>

                    {!isAuthenticate && (<div className="signinHead">
                        <img src="/assets/icons/user.svg" alt="user" className="imageUser"/>
                        <span><a href="/signin">Sign in</a></span>
                    </div>)}
                    {isAuthenticate && (<div onClick={logout} style={{cursor: 'pointer'}}>
                        <img src="/assets/icons/user.svg" alt="user" className="imageUser"/>
                        <span><a>Log out</a></span>
                    </div>)}
                    {!isAuthenticate && (
                    <Button
                        className="button-add joinaspro"
                        onClick={submitEmail}
                        style={{}}
                        size='sm'
                    >
                        Join as provider
                    </Button>
                    )}
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;
