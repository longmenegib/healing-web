import React, { useState, useEffect }  from 'react'
import './css/acceuil.css'
// import '../scss/acceuil.scss'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'
import axios from './../utils/axios';
import {deleteStorage, setInstorage, getFromStorage} from './../utils/Storage'

import {useNavigate} from 'react-router-dom';

import { animated, config, useSprings } from "@react-spring/web";
import { useSpring } from 'react-spring';
import SlideLayout from './SlideLayout';

const ColourListTransition = ({delay, items, activeColor, inactiveColor}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((state) => (state + 1) % items.length);
    }, delay);

    return () => clearInterval(interval);
  }, []);

  const [springs] = useSprings(
    items.length,
    (i) => ({
      color: i === index ? activeColor : inactiveColor,
      opacity: i === index ? 1 : 0,
      display: i === index ? 'flex' : 'none',
      from: { color: inactiveColor, opacity: 0 },
      config: config.molasses
    }),
    [index]
  );

  return (
    <ul>
      {springs.map(({ color, opacity, display }, i) => (
        <animated.li
          key={items[i]}
          style={{ color, display, listStyleType: "none", opacity, fontWeight: '900', fontSize: 22 }}
        >
          {items[i]}
        </animated.li>
      ))}
    </ul>
  );
};


export default function Home() {

  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isSpinning, setIsSpinning] = useState(true);
  const [item, setItem] = useState("");
  const user = getFromStorage('userToken');
  const userr = JSON.parse(user)

  useEffect(()=>{
    search_for_word();

    return ()=>{

    }
}, []);


const gotoProfile = (id)=>{
    console.log("hello");
    navigate(`/profile/${id}`,{
        state: {id: 'hellloooooo'}
    });
}


  const clickCategory = (type, ind)=>{
    //   if(user){
        navigate(`/category`,{
            state: {type: type, num: ind}
        }
      );
    //   }else{
    //     navigate(`/signin`)
    //   }
    console.log("hello");
  }

  const search = ()=>{
    // if(user){
        if(!item){
            return alert('enter a word to search');
        }
        navigate(`/search`, {
            state: {word: item}
        });
    //   }else{
    //     navigate(`/signin`);
    //   }
  }

  const search_for_word = async()=>{
    setIsSpinning(true);
    // setAccount(toke);

    navigator.geolocation.getCurrentPosition(async(location)=>{
        console.log("this is the location: ", location.coords);
        let latitude = location.coords.latitude;
        let longitude = location.coords.longitude;

        await axios.get(`/market-api/search/therapists_location/?longitude=${longitude}&latitude=${latitude}`,{ timeout: 30000 })
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

 const colors = ['red', 'orange', 'green', 'brown', 
    'blue', '#cc3333', 'rgb(123, 32, 12)', 'rgb(123, 232, 112)', 'grey', 'rgb(123, 32, 132)'];

  return (
     <>
      <Header />
        <div className="home">
          <div className="container-home" style={{display: 'flex', alignItems: 'center'}}>
              <div className="bg">
                  <img src="/assets/image/bg-2.svg" alt="" className="img-left"/>
                  <img src="/assets/image/bg-2.svg" alt="" className="img-center"/>
                  <img src="/assets/image/bg-2.svg" alt="" className="img-right"/>
              </div>
 
              <div style={{display: 'flex', alignItems: 'center', paddingTop: 40}}>
                  <h2>Search and Book Holistic Providers near you</h2>
              </div>
              {/* <h4 style={{}}></h4> */}
              <ColourListTransition
      items={["Yoga", "Energy Healing", "Herbal healing", "Meditation", "Acupuncture", "Massage therapy", "Aroma therapy", "Hypnothery"]}
      delay={3000}
      activeColor={"lightblue"}
      inactiveColor={"#000000"}
    />
              <div className="subscribe">
                  <input value={item} onChange={(e)=> setItem(e.target.value)} type="text" name="item" id="item" placeholder="Symptoms or illness"/>
                  <button onClick={search}><img src="/assets/icons/search.svg" alt="seach"/></button>
              </div>
          </div>
          <h5>Search by category to find the therapist you need</h5>
          <div className="home-cards">
              <div>
                  <div style={{backgroundColor: colors[0]}}  className="home-card" onClick={()=>clickCategory('Yoga', 0)}>
                      <img src="/assets/image/group-1.svg" alt=""/>
                      <h2>Yoga</h2>
                  </div>
                  <div style={{backgroundColor: colors[1]}}  className="home-card"  onClick={()=>clickCategory('Energy healing', 1)}>
                      <img src="/assets/image/group-2.svg" alt=""/>
                      <h2>Energy healing</h2>
                  </div>
                  <div style={{backgroundColor: colors[2]}}  className="home-card"  onClick={()=>clickCategory('Herbal healing', 2)}>
                      <img src="/assets/image/group-3.svg" alt=""/>
                      <h2>Herbal healing</h2>
                  </div>
                  <div style={{backgroundColor: colors[3]}}  className="home-card"  onClick={()=>clickCategory('Meditation', 3)}>
                      <img src="/assets/image/group-4.svg" alt=""/>
                      <h2>Meditation</h2>
                  </div>
              </div>
              <div>
                  <div style={{backgroundColor: colors[4]}}  className="home-card"  onClick={()=>clickCategory('Acupuncture', 4)}>
                      <img src="/assets/image/group-5.svg" alt=""/>
                      <h2>Acupuncture</h2>
                  </div>
                  <div style={{backgroundColor: colors[5]}}  className="home-card"  onClick={()=>clickCategory('Massage therapy', 5)}>
                      <img src="/assets/image/group-6.svg" alt=""/>
                      <h2>Massage therapy</h2>
                  </div>
                  <div style={{backgroundColor: colors[6]}}  className="home-card"  onClick={()=>clickCategory('Aroma therapy', 6)}>
                      <img src="/assets/image/group-7.svg" alt=""/>
                      <h2>Aroma therapy</h2>
                  </div>
                  <div style={{backgroundColor: colors[7]}}  className="home-card"  onClick={()=>clickCategory('Hypnothery', 7)}>
                      <img src="/assets/image/group-8.svg" alt=""/>
                      <h2>Hypnothery</h2>
                  </div>
              </div>
          </div>
          {/* {user && (
              <> */}
                <h3 className="title3">Our top therapist</h3>
                <div className="slides">
                    {results.slice(0,5).map((ele)=>{
                        return (
                            <div className="home-card" key={ele.id}>
                                <div className="home-card-img">
                                    <img src={ele.properties.logo || "../assets/image/group-1.svg"} alt="" style={{width: '100%', objectFit: 'cover', height: '100px'}}/>
                                </div>
                                <div className="home-card-map">
                                    <h3 style={{textAlign: 'center', width: '100%'}}>{ele.properties.label}</h3>
                                    <div>
                                        <img src="/assets/icons/map.svg" alt=""/>
                                        <span>{ele.properties.address}</span>
                                    </div>
                                </div>
                                <div className="home-card-star">
                                {returnSar(Math.round(ele.properties.rating))}
                                {returnlightSar(5-(Math.round(ele.properties.rating)))}
                                </div>
                                <button onClick={()=>gotoProfile(ele.id)}>Voir le profil complet</button>
                            </div>
                        )
                    })}
                </div>
              {/* </>
          )} */}
          
      </div>
      <SlideLayout />
      <Footer />
     </>
  )
}
