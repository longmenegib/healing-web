import React, { useState, useEffect, useMemo }  from 'react'
import { Modal, ModalHeader, FormGroup, Input, Button } from 'reactstrap'
import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage';
import axios from '../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import './gallery.css'

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
        width: '150px',
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
    cancelbtn:{
        width: '150px',
        backgroundColor: 'red',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: '50px',
        height: '40px',
        marginTop: '10px',
        color: 'white',
        marginBottom: '5px',
        border: 'none'
    },
    content : {
        height: '500px', // <-- This sets the height
        overlfow: 'scroll' // <-- This tells the modal to scrol
      }
}


const Gallery = ({showGallery, setShowGallery, photos, getAvailibity})=>{

    const [image, setImage] = useState([]);

    const saveImage = async(e)=>{
        e.preventDefault()
        let userToken = getFromStorage('userToken');
        let token = JSON.parse(userToken).key;
        // alert('helll')
        if(image.length < 1){
            return alert("Select an image");
        }

        for (let i = 0; i < image.length; i++) {
            const logodata = new FormData();
            logodata.append('image', image[i]);
            console.log(image)
            await axios.post(`/user-api/photos/`, logodata, { headers: {"Authorization": `Token ${token}`,
            "Content-Type": "multipart/form-data"}  })
            .then(async res => {
                console.log("company images saved");
                alert("image saved successfully");
                getAvailibity();
                setShowGallery(false);
                return true;
            })
            .catch(err => {
                console.log("company images not saveddd", err)
                alert("Image not saved")
                return false;
            });
        }
    }

    return(
      <Modal
      // toggle={function noRefCheck(){}}
      isOpen={showGallery}
      onClosed={()=> setShowGallery(false)}
      size="xl"
    //   scrollable={true}
      style={styles.content}
       >
           <div style={{height: '100%'}}>
            <ModalHeader>
                Gallery
                <div className="gallery-buttons" style={{position: 'absolute', right: '10px', top:'0'}} onClick={()=> setShowGallery(false)}>
                        <FontAwesomeIcon className="iconss" icon={faClose} size="2x"/>
                        {/* <div style={{width: '100%', justifyContent: 'center', display:'flex'}}>
                            <button style={styles.cancelbtn} className=""  onClick={()=> setShowGallery(false)}>Close</button>
                        </div> */}
                    
                    </div>
                </ModalHeader>
            <div className="imagess">
            <div className="center">
                {photos.map((img, index)=>{
                    return(
                        <img key={index} src={img.image || "./../assets/image/group-1.svg"} alt=""/>
                    )
                })}
                </div>
            </div>
            <div style={{textAlign: 'center'}}>
                <h3>Add a new photo to gallery</h3>
            </div>
            <div>
                <form>
                <div style={{width: '100%', justifyContent: 'center', display:'flex', marginBottom: '20px'}}>
                    <input  onChange={(e)=> setImage(e.target.files)} type="file" className="button-addd"/>
                </div>
                <div style={{width: '100%', justifyContent: 'center', display:'flex'}}>
                    <button style={styles.cancelbtn} className="button-addd" onClick={saveImage}>Save</button>
                </div>
                </form>
            </div>
        </div>
      </Modal>
    )
}

export default Gallery