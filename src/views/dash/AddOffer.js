import React, { useState, useEffect, useMemo }  from 'react'
import { Modal, ModalHeader, FormGroup, Input, Button, Alert, Toast } from 'reactstrap'
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import axios from '../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'

import './setcalendar.css';
import '../css/customCalendar.css'

const styles = {
    contain:{
        // backgroundColor: 'white',
        // height: Dimensions.get("screen").height - 150,
        width: '100%',
        alignItems:'center',
        flexDirection:'column',
        justifyContent: 'center',
        position: 'relative',
        marginTop: '30px'
    },
    cancelbtn:{
        width: '200px',
        backgroundColor: 'red',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: '50px',
        height: '40px',
        marginTop: '10px',
        color: 'white',
        marginBottom: '5px'
    },
}


const AddOffer = ({setOpenOffer, openOffer})=>{

    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [offer, setOffer] = useState("");
    const [image, setImage] = useState([]);
    const [category, setCategory] = useState([{id: 1, label: 'Select a category'}]);

    useEffect(()=>{
        getMarketCategory();
        return ()=>{
           
        }
    }, []);

    const getMarketCategory = async()=>{
        console.log('getting the category')
        axios.get('/market-api/categories/', { withCredentials: false })
            .then(async res => {
                // console.log(res.data.results);
                if(res.data.results.length > 0){
                    setCategory(res.data.results);
                    setOffer(res.data.results[0].label);
                }
            }).catch(err => {
                console.log(err);
            })
    }

    const submitOffer = async()=>{
        const userToken = getFromStorage('userToken');
        let token = JSON.parse(userToken).key;
        let payload = {
            category: offer,
            therapist: JSON.parse(userToken).id,
            price: parseInt(price),
            description: description,
            illustration: image
        }
        let filedata = new FormData();
        filedata.append('category', offer);
        filedata.append('therapist', JSON.parse(userToken).id);
        filedata.append('description', description);
        filedata.append('price', parseInt(price));
        filedata.append('illustration', image);
    
        console.log(payload)
        await axios.post('/market-api/offers/', filedata, { headers: {"Authorization": `Token ${token}`,
        "Content-Type": "multipart/form-data"}})
            .then(async res => {
                console.log(res.data);
                alert("Offer added successfully");
            }).catch(err => {
                console.log('error from offer',err);
                alert("Could not saved Offer");
            })
    }

    return(
      <Modal
      size="lg"
      isOpen={openOffer}
      onClosed={()=> setOpenOffer(false)}
       >
           <ModalHeader>
               Create a new offer
               <div className="" style={{position: 'absolute', right: '10px', top:'10px'}} onClick={()=> setOpenOffer(false)}>
                    {/* <FontAwesomeIcon className="iconss" icon={faClose} size="1x"/> */}
                    {/* <Button
                        className="button-add"
                        onClick={()=>{}}
                    >
                        Add new offer
                    </Button> */}
                   
                    <Button onClick={()=> setOpenOffer(false)}>
                        Cancel
                    </Button>
                </div>
            </ModalHeader>
          
            <div className="right-body">
                        <div className="center">
                            <div class="hours" style={{width: '100%'}}>
                            <form>
                                {/* <div className="p">
                                    <h3>Dont have an account ? <a href="signup-as">Sign up!</a></h3>
                                    <h3>Please fill in all the required fields correctly</h3>
                                </div> */}
                                <div className="form-input">
                                    <select className="options" value={offer} onChange={(e)=> setOffer(e.target.value)}>
                                    {category.map((ele)=>{
                                            return(
                                                <option key={ele.id} value={ele.id}>
                                                    {ele.label}
                                                </option>
                                            )
                                        })}
                                        
                                    </select>
                                    <input value={price} onChange={(e)=> setPrice(e.target.value)} type="text" name="price" id="price" placeholder="Price" />
                                    <textarea value={description} onChange={(e)=> setDescription(e.target.value)} type="description" name="description" id="description" placeholder="Offer Description"></textarea>
                                    <div className="form-input-files">
                                        <div className="files-card">
                                            <label htmlFor="company">Offer Photo</label>
                                            <input onChange={(e)=> setImage(e.target.files[0])} type="file" name="company" id="company" className="choose-file" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="buttons">
                                    <Button style={{backgroundColor: '#ff9933', color: 'white', border: 'none'}} onClick={submitOffer}>
                                        Save Offer
                                    </Button>
                                    {/* <button onClick={()=>{}}>Cancel</button> */}
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
      </Modal>
    )
}

export default AddOffer;