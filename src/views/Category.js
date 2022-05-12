import React, { useState, useEffect }  from 'react'
import './css/category.css'
// import '../scss/category.scss'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage'

import {useNavigate, useLocation, useParams} from 'react-router-dom';

export default function Category() {

  const navigate = useNavigate();
  const location = useLocation();
  const {type, num} = location.state || {type: 'Yoga', num: 0};
    const word = type;

    const images = ["/assets/image/group-1.svg","/assets/image/group-2.svg","/assets/image/group-3.svg","/assets/image/group-4.svg",
    "/assets/image/group-5.svg","/assets/image/group-6.svg","/assets/image/group-7.svg","/assets/image/group-8.svg",]
  const [results, setResults] = useState([]);
  const [account, setAccount] = useState({});
  const [isSpinning, setIsSpinning] = useState(true);
  const [item, setItem] = useState("");
  const user = getFromStorage('userToken');
  const userr = JSON.parse(user)

    const clickCategory = (id)=>{
        console.log("hello");
        navigate(`/profile/${id}`);
    }

    useEffect(()=>{
        // alert(word);
        search_for_word(word);
    
        return ()=>{
    
        }
    }, []);
    
    
      const search_for_word = async(searchword)=>{
        setIsSpinning(true);
    
        navigator.geolocation.getCurrentPosition(async(location)=>{
            console.log("this is the location: ", location.coords);
            let latitude = location.coords.latitude;
            let longitude = location.coords.longitude;
    
            await axios.get(`http://healing-market.herokuapp.com/market-api/search/therapists_location/?longitude=${longitude}&latitude=${latitude}&query=${searchword}`,{ timeout: 10000 })
            .then(async item => {
                if(item.data.features.length > 0){
                    console.log('hyellll' ,item.data.features);
                    // item.data.features.sort((a, b) => parseFloat(b.properties.rating) - parseFloat(a.properties.rating));
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

    const search = ()=>{
        if(user){
            if(!item){
                return alert('enter a word to search');
            }
            navigate(`/search`, {
                state: {word: item}
            });
          }else{
            navigate(`/signin`);
          }
      }
    
    return (
     <>
      <Header />
      <div class="category" style={{paddingTop: 100}}>
        <div class="container-category">
            <div class="bg">
                <img src="../assets/image/bg-2.svg" alt="" class="img-left"/>
                <img src="../assets/image/bg-2.svg" alt="" class="img-center"/>
                <img src="../assets/image/bg-2.svg" alt="" class="img-right"/>
            </div>
            <div>
                  <h2>DISCOVER</h2>
              </div>
            <div class="title">
                <h2>{type}</h2>
                <img src={images[num]} alt=""/>
            </div>
            {/* <div style={{marginTop: 20}}>
                <p style={{color: '#ffe'}}>Book with thousands of holistic provider near you.</p>
            </div> */}
            <div className="subscribe">
                  <input value={item} onChange={(e)=> setItem(e.target.value)} type="text" name="item" id="item" placeholder="Symptoms or illness"/>
                  <button onClick={search}><img src="/assets/icons/search.svg" alt="seach"/></button>
              </div>
        </div>
        <div class="slides">
            <div class="center">
            {results.length < 1 && (
            <div style={{width: '100%', flexDirection: 'column', alignItems: 'center'}}>
                <p style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>No provider available for this category around you</p>
                {/* <img src='./../assets/sad_emoji.png' style={{}} /> */}
            </div> 
            )}
            {results.map((ele)=>{
                                return(
                <div class="category-card" onClick={()=>clickCategory(ele.id)}>
                    <div class="category-card-img">
                        <img src={ele.properties.logo || "../assets/image/group-1.svg"} alt=""/>
                    </div>
                    <div class="category-card-map">
                        <h3>
                            {ele.properties.label} {ele.id === account.id ? ' (You) ' : ''}
                        </h3>
                        <div>
                            <img src="../assets/icons/map.svg" alt=""/>
                            <span>
                                {ele.properties.address}
                            </span>
                        </div>
                    </div>
                    <div class="category-card-star">
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
