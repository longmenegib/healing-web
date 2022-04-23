import React, { useState, useEffect }  from 'react'
// import './css/category.css'
// import '../scss/category.scss'
import './css/acceuil.css'
// import '../scss/acceuil.scss'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage'

import {useNavigate, useLocation} from 'react-router-dom';

export default function SearchResult() {

    const navigate = useNavigate();
    const location = useLocation();
    const {word} = location.state;

    const [results, setResults] = useState([]);
    const [isSpinning, setIsSpinning] = useState(true);
    const [item, setItem] = useState(word);
    const [account, setAccount] = useState({});

    const clickCategory = (id)=>{
        console.log("hello");
        navigate(`/profile/${id}`);
    }

    useEffect(()=>{
        console.log(word);
        search_for_word(item);
    
        return ()=>{
    
        }
    }, []);
    
      const search = ()=>{
        if(!item){
            return alert('enter a word to search');
        }
        search_for_word(item);
      }
    
      const search_for_word = async(searchword)=>{
        setIsSpinning(true);
        const tok = getFromStorage('userToken');
        const toke = JSON.parse(tok);
        setAccount(toke);
    
        navigator.geolocation.getCurrentPosition(async(location)=>{
            console.log("this is the location: ", location.coords);
            let latitude = location.coords.latitude;
            let longitude = location.coords.longitude;
    
            await axios.get(`/market-api/search/therapists_location/?longitude=${longitude}&latitude=${latitude}&query=${searchword}`,{ timeout: 10000, headers: {"Authorization": `Token ${toke.key}`} })
            .then(async item => {
                if(item.data.features.length > 0){
                    console.log('hyellll' ,item.data.features);
                    item.data.features.sort((a, b) => parseFloat(b.properties.rating) - parseFloat(a.properties.rating));
                    setResults(item.data.features);
                    setIsSpinning(false);
                }else{
                    console.log("no service provider in your area.")
                    setResults([]);
                    setIsSpinning(false);
                }
            })
            
            .catch(err => {
                console.log(err);
            });
        },
        (error)=>{
            console.log('error from location: ', error);
        },
       
        );
    }

    const returnSar = (num)=>{
        let arr = new Array();
        for (let i = 0; i < num; i++) {
            arr.push(i);
        }
        // num =2;
        // setStar(arr)
        return arr.map((el, index)=>{
            return(
                <img key={index} className="star-fill" src="../assets/icons/star.svg" alt=""/>
            )
        })
    }
    
    const returnlightSar = (num)=>{
        let arr = new Array();
        for (let i = 0; i < num; i++) {
            arr.push(i);
        }
        // num =2;
        // setStar(arr)
        return arr.map((el, index)=>{
            return(
                <img key={index} className="star-light" src="../assets/icons/star.svg" alt=""/>
            )
        })
    }

    return (
     <>
      <Header />
      <div class="home category" style={{paddingTop: 100}}>
        <div class="container-home" style={{minHeight: '30px'}}>
            <div class="bg">
                <img src="../assets/image/bg-2.svg" alt="" class="img-left"/>
                <img src="../assets/image/bg-2.svg" alt="" class="img-center"/>
                <img src="../assets/image/bg-2.svg" alt="" class="img-right"/>
            </div>
            <div class="subscribe">
                <input value={item} onChange={(e)=> setItem(e.target.value)} type="text" id="item" placeholder="Symptoms or illness"/>
                <button onClick={search}><img src="/assets/icons/search.svg" alt="seach"/></button>
            </div>
        </div>
        <div class="slides">
            <div class="center">
            {results.length < 1 && (
            <div style={{width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                <p style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>No provider available for this category around you</p>
                <img src='../assets/sad_emoji.png' style={{}} />
            </div> 
            )}
            {results.map((ele)=>{
                                return(
                <div class="home-card" onClick={()=>clickCategory(ele.id)}>
                    <div class="home-card-img">
                        <img src={ele.properties.logo || "../assets/image/group-1.svg"} alt="" style={{width: '100%', objectFit: 'cover', height: '100px'}}/>
                    </div>
                    <div class="home-card-map">
                        <h3>
                            {ele.properties.label} {ele.id === account.id ? ' (You) ' : ''}
                        </h3>
                        <div>
                            <img src="../assets/icons/map.svg" alt=""/>
                            <span>
                                {ele.properties.label}
                            </span>
                        </div>
                    </div>
                    <div class="home-card-star">
                    {returnSar(Math.round(ele.properties.rating))}
                        {returnlightSar(5-(Math.round(ele.properties.rating)))}
                    </div>
                    <button>Voir le profil complet</button>
                </div>
            )}
            )}
            </div>
        </div>
    </div>
      <Footer />
     </>
  )
}
