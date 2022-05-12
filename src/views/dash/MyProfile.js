
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
  } from "reactstrap";

  import React, {useState, useEffect} from 'react'
  import {deleteStorage, setInstorage, getFromStorage} from '../../utils/Storage'
  import axios from '../../utils/axios'
  
  const MyProfile = (props) => {
  
    const [profile, setProfile] = useState([]);
    let user = JSON.parse(getFromStorage('userToken'));
    let token = user.key;
    const id = user.id;
    const [show, setShow] = useState(false);
  
      useEffect(()=>{
        console.log(id)
          getDetails();
        },[])

        const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [business, setBusiness] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [states, setStates] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [description, setDescription] = useState('');
  
  
       //get informations on each therati
       const getDetails = async()=>{
          
        await axios.get(`/user-api/therapists/${id}/detail`, { headers: {"Authorization": `Token ${token}`} })
        .then(async res => {
            console.log('this is the response ', res.data.properties);
            setProfile(res.data.properties);
            setUsername(res.data.properties.user)
            setPhone(res.data.properties.phone)
            setBusiness(res.data.properties.label)
            setEmail(res.data.properties.email)
            setAddress(res.data.properties.address)
            setCity(res.data.properties.city)
            setStates(res.data.properties.region)
            setZipcode(res.data.properties.zip_code)
            setDescription(res.data.properties.description)
            setShow(true);
        })
        .catch(err => {
            console.log(err);
        });
      }

      const updateInfos = async(type)=>{
        console.log(type);
        if(type==="address"){
          let data = {
            'address': address,
            'city': city,
            'region': states,
            'zip_code': zipcode,
          }
          await axios.put(`/user-api/therapists/${id}/`, data, { headers: {"Authorization": `Token ${token}`} })
          .then(res => {
            console.log('goood');
            alert("Address informations updated")
          }).catch(err=>{
            console.log(err);
            alert("Address informations not updated")
          })
        }else{
          let data = {
            'label': business,
            'description' : description,
            // 'birthdate': dob,
            'phone': phone
          }
          await axios.put(`/user-api/therapists/${id}/`, data, { headers: {"Authorization": `Token ${token}`} })
          .then(res => {
            console.log('goood');
            alert('Account infos updated')
          }).catch(err=>{
            console.log(err);
            alert("Account information not updated")
          })
        }
      }
  
    return (
      <>
       
          <Container className="mt-2" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={profile.logo}
                          width="100%"
                          height="100%"
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-between">
                  {profile.is_certified && (<Button
                    className="mr-4"
                    color="success"
                    // href="#pablo"
                    
                    size="sm"
                  >
                    Account Certified
                  </Button>)}
                  {!profile.is_certified && (<Button
                    className="mr-4"
                    color="danger"
                    // href="#pablo"
                    
                    size="sm"
                  >
                    Account non certified
                  </Button>)}
                    {/* <Button
                      className="float-right"
                      color="default"
                      href={`mailto:${profile.email}`}
                      // onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Mail
                    </Button> */}
                  </div>
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                        <div>
                          <span className="heading">{profile.rating}</span>
                          <span className="description">Rating</span>
                        </div>
                        <div>
                          <span className="heading">
                          {show && ( <span>{profile.photos.length}</span>)}
                              </span>
                          <span className="description">Photos</span>
                        </div>
                        {/* <div>
                           
                          <span className="heading">
                          {show && profile.booking_fee.length > 0 && ( <span> ${profile.booking_fee[0].booking_fee}</span>)}
                        </span>
                          <span className="description"> Fee</span>
                        </div> */}
                      </div>
                    </div>
                  </Row>
                  <div className="text-center">
                    <h3>
                    {profile.user}
                      {/* <span className="font-weight-light">, 27</span> */}
                    </h3>
                    <div className="h5 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      {profile.address} - {profile.region} - {profile.city} - {profile.zip_code}
                    </div>
                    <div className="h5 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                      {profile.label}
                    </div>
                    <div>
                      <i className="ni education_hat mr-2" />
                      {profile.category}
                    </div>
  
                    <div className="mt-3 btn btn-warning"
                     onClick={()=> window.open(`${profile.certificate}`, "_blank")}>
                      <i
                       className="fas fa-file text-success mr-4" style={{fontSize: '20px', cursor: 'pointer'}}/>
                       Open Certification
                    </div> 
  
                    <hr className="my-4" />
                    <p>
                    {profile.description}
                    </p>
                    {/* <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      Show more
                    </a> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className=" shadow" style={{backgroundColor: '#ff9933'}}>
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      {/* <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        Settings
                      </Button> */}
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="input-username"
                              placeholder="Username"
                              type="text"
                              value={username}
                              // onChange={(e)=> setUsername(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="example@example.com"
                              type="email"
                              value={email}
                              // onChange={(e)=> setEmail(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Business name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Lucky"
                              id="input-first-name"
                              placeholder="Business name"
                              type="text"
                                value={business}
                                onChange={(e)=> setBusiness(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Phone number
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Jesse"
                              id="input-last-name"
                              placeholder="Phone number"
                              type="text"
                              value={phone}
                              onChange={(e)=> setPhone(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Description
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Jesse"
                              id="input-last-name"
                              placeholder="Business descriptin"
                              type="textarea"
                              value={description}
                              onChange={(e)=> setDescription(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                            <Button
                                className="button-add"
                                onClick={()=> updateInfos('personal')}
                                // style={{display: 'flex', justifyContent: 'center'}}
                                size='sm'
                            >
                                Update infos
                            </Button>
                            </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    
                    <h6 className="heading-small text-muted mb-4">
                      Contact information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Address
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                              id="input-address"
                              placeholder="Home Address"
                              type="text"
                              value={address}
                              onChange={(e)=> setAddress(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              City
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="New York"
                              id="input-city"
                              placeholder="City"
                              type="text"
                              value={city}
                              onChange={(e)=> setCity(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Country
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="United States"
                              id="input-country"
                              placeholder="Country"
                              type="text"
                              value={states}
                              onChange={(e)=> setStates(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Postal code
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-postal-code"
                              placeholder="Postal code"
                              type="number"
                              value={zipcode}
                              onChange={(e)=> setZipcode(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                            <Button
                                className="button-add"
                                onClick={()=> updateInfos('address')}
                                // style={{display: 'flex', justifyContent: 'center'}}
                                size='sm'
                            >
                                Update infos
                            </Button>
                          </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                   
                    {/* <h6 className="heading-small text-muted mb-4">About me</h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          className="form-control-alternative"
                          placeholder="A few words about you ..."
                          rows="4"
                          defaultValue="A beautiful Dashboard for Bootstrap 4. It is Free and
                          Open Source."
                          type="textarea"
                        />
                      </FormGroup>
                    </div> */}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        {/* )} */}
        
      </>
    );
  };
  
  export default MyProfile;
  