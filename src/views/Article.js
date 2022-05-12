import React, {useState, useEffect} from 'react'
import './css/article.css';
import {useNavigate, useParams} from 'react-router-dom';
import renderHTML from 'react-render-html';
import axios from './../utils/axios'
import { getFromStorage } from './../utils/Storage';
import Header from '../components/Headers/Header';
import Footer from '../components/Footers/Footer';

export default function Article() {

    const navigate = useNavigate();
    const {id} = useParams();
    const [focusId, setFocusId] = useState(id)
    // let id = JSON.parse(userToken).id;

    const [blogs, setBlog] = useState([]);
    const [article, setArticle] = useState({})
     //useeffec to call the Blog
     useEffect(()=>{
        getArticle();
    }, [focusId])
    useEffect(()=>{
        getBlog();
    }, [])

    // get Blog >> admin
    const getBlog = async() => {
        var arr = [];
        await axios.get(`/blog-api/articles/`).then((response)=>{
            console.log(response.data);
            setBlog(response.data.results);
        }).catch(err=>{
            console.log(err);
        });
    }

    const getArticle = async()=>{
        await axios.get(`/blog-api/articles/${focusId}/`, { timeout: 10000})
        .then(res=>{
            console.log("ativdddd", res.data)
            setArticle(res.data);
        }).catch(err=>{
            console.log(err)
        })
    }

    const gotoBlogpost = (ele)=>{
        setFocusId(ele.id);
        navigate(`/blog/article/${ele.id}`);
    }

    return (
        <>
        <Header />
        <div className="" style={{paddingTop:"100px"}}>
            <div className="rowblog">
                <div className="leftcolumn">
                    <div className="card">
                    <h2>{article.author}</h2>
                    <h5><span style={{textDecoration:'underline', color: '#ff9933'}}>{article.category}</span></h5>
                    <div className="fakeimg" style={{height:"400px"}}>
                    <img alt="" src={article.image} className="blog-image" width="100%" height="100%"/>
                    </div>
                    <div>
                        {article.content && (
                            <>
                            {renderHTML(article.content)}
                            </>
                        )}
                    
                    </div>
                    </div>
                </div>
                <div className="rightcolumn">
                    <div className="card">
                    <h3>Popular Post</h3>

                    {blogs.map((ele)=>{
                        return(
                            <div key = {ele.id} className="row" style={{marginBottom:'5px', cursor:'pointer'}} onClick={()=>gotoBlogpost(ele)}>
                                <img src={ele.image} className="col-4" height="50px" width="50px"/>
                                <p className="col-8">
                                    <span style={{color: 'black', fontWeight: 900}}>{ele.author}</span><br/>
                                    <span>{ele.category}</span>
                                </p>
                            </div>
                        )
                    })}
                    </div>
                   
                </div>
             </div>
        </div>
        <Footer />
        </>
    )
}
