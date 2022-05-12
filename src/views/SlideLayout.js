import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlay, faApple } from "@fortawesome/free-brands-svg-icons"
import React from 'react';
import {Container, Row, Col, Button} from 'reactstrap'
import illus from '../assets/images/phone.png'
import playstore from '../assets/images/playstore.png'

const styles = {
    store:{
        display: 'flex', 
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'gray',
        width: 160,
        borderRadius: 10,
        color: 'white'
    },
    opt:{
        display: 'flex',
        flexDirection: 'column'
    }
}

export default function SlideLayout() {
  return (
    <div className='slideLayout'>
        <Container className="w-100 slideContainer" style={{paddingTop: '30px'}}>
            <Row>
                <Col sm={12} md={7} lg={6}>
                   <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column',height: '100%'}}>
                        <h3 style={{fontWeight: 'bold'}}>Book your favorite Holistic providers faster using the Healing Marketplace App</h3>
                        {/* <h6>Available on IOS and Android</h6> */}
                        <div style={{justifyContent:'space-between', display: 'flex', marginTop: 20, width: 350, marginBottom: 20}}>
                            {/* <Col> */}
                            <div
                                className=""
                                onClick={()=> window.open("https://apps.apple.com/app/healing-marketplace/id1581092859", "_blank")}
                                style={styles.store}
                                size='lg'
                            >
                                <div>
                                <FontAwesomeIcon  icon={faApple} size="3x" color='#fff' className="icons"/>
                                </div>
                                <div style={styles.opt}>
                                    <span style={{fontSize: 11, color: 'white'}}>Download on</span>
                                    <span style={{fontSize: 18, color: 'white', fontWeight: '700'}}>App Store</span>
                                </div>
                            </div>
                            <div
                                className=""
                                onClick={()=> window.open("https://play.google.com/store/apps/details?id=com.syren", "_blank")}
                                style={styles.store}
                                size='lg'
                            >
                                <div>
                                {/* <FontAwesomeIcon  icon={playstore} size="2x" color='#fff' className="icons"/> */}
                                <img src={playstore} width="30px" alt=""/>  
                                </div>
                                <div style={styles.opt}>
                                    <span style={{fontSize: 11, color: 'white'}}>Available on</span>
                                    <span style={{fontSize: 18, color: 'white', fontWeight: '700'}}>Google Play</span>
                                </div>
                            </div>
                            {/* </Col> */}
                        </div>
                   </div>
                </Col>
                <Col className="illustration" sm={12} md={5} lg={6}>
                    <img src={illus} width="100%" height="100%" alt="" className="home-img"/>  
                </Col>
            </Row>
        </Container>
    </div>
  )
}
