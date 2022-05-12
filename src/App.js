
import React,  {useState, useEffect, useMemo, createContext}  from "react";
import { useLocation, Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import {deleteStorage, setInstorage, getFromStorage} from './utils/Storage'
import Login from "./views/Login";
import Home from "./views/Home";
import Category from "./views/Category";
import ProfileGallery from "./views/ProfileGallery";
import PatientRegister from "./views/PatientRegister";
import Register from "./views/Register";
import SelectSign from "./views/SelectSign";
import SearchResult from "./views/SearchResult";
import Payment from "./views/Payment";
import MyProfile from "./views/dash/MyProfile";

import { routes, clientRoutes } from "./routes.js";
import Sidebar from "./components/Sidebar/Sidebar";
import DashboardHome from "./views/DashboardHome";

import "./assets/css/argon-dashboard-react.css";
import PaymentSubscription from "./views/dash/SubscriptionPayment";
import PrivacyPolicy from "./views/PrivacyPolicy";
import Terms from "./views/Terms";
import Blog from "./views/Blog";
import PatientTerms from "./views/PatientTerms";
import ProviderTerms from "./views/ProviderTerms";

import {isMobile} from 'react-device-detect';
import RegistrationSubscription from "./views/RegistrationSubscription";
import DashboardClient from "./views/DashboardClient";
import Article from "./views/Article";

export const AuthContext = createContext();

const Admin = () => {
  const [isSigning, setSigning] = useState(false);
  const user = getFromStorage('userToken');
  const userr = JSON.parse(user)

  useEffect(()=>{
    
    getToken();
  },[])

  const getToken = async()=>{
    
    // console.log('hello hello ',user);
    if(user == null){
      setSigning(false);
    }else{
      setSigning(true);
    }
  }

  const authContext = useMemo(
    ()=>({
      signIn: async () =>{
        // getToken();
        setSigning(true);
        console.log("i am log in");
      },
      signOut: async()=>{
        console.log("i am logged out");
        // getToken();
        setSigning(false);
      },
      signUp: async () =>{
        console.log("account created");
      }
    })
  )

  // const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

  //   if(isMobile){
  //     return <div>
  //       Sorry, this website is only available on desktop devices.
  //       Please download our mobile version here:
  //     </div>
  // }

  return (
    <AuthContext.Provider value={authContext}>
     <div>

     </div>
      <BrowserRouter>
      <Routes>
      <Route
         exact
          path="/"
          element={
              <Home />
          }
        />
        <Route
         exact
          path="/terms-conditions"
          element={
              <PatientTerms />
          }
        />
         <Route
         exact
          path="/provider-terms-conditions"
          element={
              <ProviderTerms />
          }
        />
       <Route
         exact
          path="privacy-policy"
          element={
              <PrivacyPolicy />
          }
        />
        <Route
         exact
          path="/blog"
          element={
              <Blog />
          }
        />
        <Route
         exact
          path="/blog/article/:id"
          element={
              <Article />
          }
        />
         <Route
        exact
          path="category"
          element={
              <Category />
          }
        />
        <Route
        exact
          path="search"
          element={
              <SearchResult />
          }
        />
         <Route
        exact
          path="profile/:id"
          element={
              <ProfileGallery />
          }
        />

      {isSigning ? 
      <>
       
       
       
        <Route
        exact
          path="payment"
          element={
              <Payment />
          }
        />
        <Route
        exact
          path="pay-subscription"
          element={
              <PaymentSubscription />
          }
        />
       
        <Route
        exact
          path="account"
          element={
            userr.is_therapist ? 
            <>
              <Sidebar
                routes={routes}
                logo={{
                  innerLink: "/dashboard",
                  outterLink: '',
                  // imgSrc: require("./assets/images/logo.svg"),
                  // imgAlt: "...",
                }}
              />
               <div className="main-content" >
               <MyProfile />
              </div>
            </>
            : <Navigate to="/" replace/>
          }
        />  

        <Route
        exact
          path="dashboard"
          element={
            userr.is_therapist ?
            <>
              <Sidebar
                routes={routes}
                logo={{
                  innerLink: "/dashboard",
                  outterLink: '',
                  // imgSrc: require("./assets/images/logo.svg"),
                  // imgAlt: "...",
                }}
              />
               <div className="main-content" >
              <DashboardHome /> 
              </div>
            </>
             :
             <>
              <Sidebar
                routes={clientRoutes}
                logo={{
                  innerLink: "/dashboard",
                  outterLink: '',
                  // imgSrc: require("./assets/images/logo.svg"),
                  // imgAlt: "...",
                }}
              />
               <div className="main-content" >
                <DashboardClient /> 
              </div>
            </>
          }
        />
        </>
          :
      <>
      {/* <Route
         exact
          path="/"
          element={
              <SelectSign />
          }
        /> */}
        <Route
        exact
          path="register"
          element={
              <PatientRegister />
          }
        />
        <Route
        exact
          path="signin"
          element={
              <Login />
          }
        />
        <Route
        exact
          path="signup"
          element={
              <Register />
          }
        />
        <Route
          exact
          path="signup-as"
          element={
              <SelectSign />
          }
        />
         <Route
          exact
          path="register-subscription"
          element={
              <RegistrationSubscription />
          }
        />
      </>
    }
    <Route exact path="*" element={<Terms />} status={404}/>
    </Routes>
</BrowserRouter>
      
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ signIn, children }) => {
  if (!signIn) {
    return <Navigate to="/signup-as" replace />;
  }else{
    return children;
  }

  // return children;
};

const ProtectedRouteAccess = ({ signIn, children }) => {
  if (signIn) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default Admin;
