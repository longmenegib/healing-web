import React, {useState, useEffect} from 'react'
import './css/blog.css';
import {useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { getFromStorage } from '../utils/Storage';
import renderHTML from 'react-render-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { Row, Col} from 'reactstrap'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'

export default function Blog() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
    
        getBlogs();

        return ()=>{

        }
      },[])

    const getBlogs = async()=>{
        const user = getFromStorage("userToken");
        const token = JSON.parse(user).key;
        await axios.get('/blog-api/articles/', { headers: {"Authorization": `Token ${token}`} })
        .then(res=>{
            console.log(res.data.results);
            
            var moi = [];
            if(res.data.results.length > 0){
                for (let i = 0; i < res.data.results.length; i++) {
                moi.push(res.data.results[i]);
                
                }
            }
            
            if(res.data.count > 10){
                var count = res.data.count;
                var numberOftime = Math.floor(count / 10);
                var nextpage = numberOftime;
                
                for (let i = 1; i <= numberOftime; i++) {
                nextpage = i + 1;
                axios.get(`/blog-api/articles/?page=${nextpage}`, { headers: {"Authorization": `Token ${token}`} })
                .then(res =>{
                    for (let i = 0; i < res.data.results.length; i++) {
                    moi.push(res.data.results[i]); 
                    }
                    console.log("heeeemoi", moi);          
                    setBlogs(moi);
                    setLoading(false);  
                })
                .catch(err=>{
                    console.log(err);
                })
                }
            }else{   
                console.log("heeeemoi", moi);
                if(moi.length > 0){
                    setBlogs(moi);
                }
                setLoading(false);
            }
        })
        .catch(err=>{
            console.log('blogs: ',err);
        //     Alert.alert(
        //   `Oops!`,
        //   "Check try internet connection and try again",
        // );
        })
    }

    const gotoBlogpost = (ele)=>{
       navigate(`/blog/article/${ele.id}`);
    }
    return (
        <>
      <Header />
        <div className="container blog" style={{paddingTop: 100}}>
            
            {/* blog section */}
            <section className="blog-section">
                <h1>Get the best articles</h1>
                <Row style={{display: 'flex', alignItems: 'stretch'}}>
                    
                    {blogs.map((ele)=>{
                        return(
                            <Col sm={4}  key={ele.id} style={{marginTop: '30px', display: 'flex'}}>
                                <div className="blog-component-container">
                                    <div className="blog-image-container">
                                        <img alt="" src={ele.image} style={{objectFit: 'cover'}} className="blog-image" width="100%" height="300px"/>
                                    </div>
                                    <div className="blog-text-container">
                                        <div className="blog-title">
                                            <p className="title">
                                                {ele.author}
                                                
                                            </p>
                                            <p style={{color: '#ff9933'}} className="date">
                                                {ele.category}
                                                
                                            </p>
                                        </div>
                                        <div className="blog-text">
                                            <div>
                                            {/* {ele.content.slice(0, 200)} */}
                                            {renderHTML(ele.content.slice(0, 200))}
                                            </div>
                                        </div>
                                        <div className="blog-footer">
                                            <p style={{color: '#ff9933'}}>
                                                {ele.nb_comments} 
                                                <FontAwesomeIcon icon={faComment} className="iconss" style={{marginLeft: 5}}/>
                                            </p>
                                            <p style={{cursor: 'pointer', color: 'gray'}} onClick={()=>gotoBlogpost(ele)}>Read more</p>
                                            {/* <div className="blog-link d-flex">
                                                <i className="bx bxl-twitter"></i>
                                                <i className="bx bxl-facebook"></i>
                                                <i className="bx bxl-linkedin"></i>
                                                <i className="bx bxl-instagram"></i>
                                                <FontAwesomeIcon icon={["fab", "github"]} />
                                            </div> */}
                                            
                                        </div>
                                    </div>
                                </div>
                            </Col>
                           
                         )
                    })} 
                </Row>
            </section>
        </div>
        <Footer />
        </>
    )
}
