
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage'
import './usewrfoot.css'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin, faTelegram, faTwitter, faWhatsapp, faYoutube } from "@fortawesome/free-brands-svg-icons"

const UserFooter = () => {

  const isAuthenticate = getFromStorage('userToken');

  return (
    <footer className="footefooter" style={{backgroundColor: '#2f2338'}}>
      <Row className="align-items-center m-auto" style={{color: 'white', width: '80%', paddingTop: '20px'}}>
      The Use of this website, content, and products are for informational purposes only. 
Healing Marketplace does not provide medical advice, 
diagnosis, and treatment. This website, content, and products are for informational purposes only.
      </Row>
      <div className=" d-flex justify-content-center">
      <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 footer-links mt-4">
                  <h4 style={{color: 'blue'}}>Our Social Networks</h4>
                  <p style={{color: 'white'}}>Follow us and discover latest design post on:</p>
                  <div className="social-links mt-3">
                    <a href="https://m.facebook.com/109169183883396/" className="twitter foot-item"><FontAwesomeIcon  icon={faFacebook} size="2x" color='#FFF' className="iconss"/></a>
                    {/* <Link to="#" className="facebook foot-item"><FontAwesomeIcon  icon={faTwitter} size="2x" color='#FFF' className="iconss"/></Link> */}
                    <a href="https://www.instagram.com/the_healing_marketplace/" className="instagram foot-item"><FontAwesomeIcon  icon={faInstagram} size="2x" color='#FFF' className="iconss"/></a>
                    {/* <Link to="" className="google-plus foot-item"><FontAwesomeIcon  icon={faLinkedin} size="2x" color='#FFF' className="iconss"/></Link> */}
                    <a href="https://youtube.com/channel/UChrV7V_gY1-k8B46jwRzp_A" className="linkedin foot-item"><FontAwesomeIcon  icon={faYoutube} size="2x" color='#FFF' className="iconss"/></a>
                  </div>
                </div>
      </div>
      <Row className="align-items-center" style={{display: 'flex', justifyContent: 'space-between', marginTop: 30}}>
        <Col xl="6">
          <Nav className="">
            <NavItem>
              <NavLink
                href="/"
                rel="noopener noreferrer"
                // target="_blank"
                style={{color: 'white'}}
                className="footitem"
              >
                Home
              </NavLink>
            </NavItem>

              <NavItem>
                <NavLink
                  href="/privacy-policy"
                  rel="noopener noreferrer"
                  // target="_blank"
                  style={{color: 'white'}}
                  className="footitem"
                >
                  Privacy policy
                </NavLink>
              </NavItem>
          
            

            <NavItem>
              <NavLink
                href="/terms-conditions"
                rel="noopener noreferrer"
                // target="_blank"
                style={{color: 'white'}}
                className="footitem"
              >
                Client Terms
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="/provider-terms-conditions"
                rel="noopener noreferrer"
                // target="_blank"
                style={{color: 'white'}}
                className="footitem"
              >
                Provider Terms and conditions
              </NavLink>
            </NavItem>

          </Nav>
        </Col>
        <Col xl="6" style={{display: 'flex', justifyContent: 'right'}}>
          <div className=" justify-content-xl-end" style={{color: 'white'}}>
            © {new Date().getFullYear()}{" "}
            <span
              className="font-weight-bold ml-1"
              style={{color: 'grey'}}
            >
              Healing Market
            </span>
          </div>
        </Col>

      </Row>
    </footer>
  );
};

export default UserFooter;
