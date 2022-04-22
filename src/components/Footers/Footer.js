import React from 'react'
import './footer.css';
import UserFooter from './UserFooter';

const Footer = () => {
  return (
    <footer className="footer-footer">
        <div className="container-footer">
            <div>
                <h2>Our news</h2>
                <img src="/assets/icons/news.svg" alt="news"/>
            </div>
            <h3>Would you like to keep up to date with our news ? Subscribe to our newsletter</h3>
            <div className="subscribe">
                <input type="email" name="email" id="email" placeholder="Email address"/>
                <button>Subscribe</button>
            </div>
        </div>
        <div className="copyright">
            {/* <p>&copy; 2022 healing marketplace</p> */}
        </div>
        <UserFooter />
    </footer>
  );
};

export default Footer;
