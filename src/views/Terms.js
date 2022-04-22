import React from 'react'
import Header from '../components/Headers/Header'
import Footer from '../components/Footers/Footer'

export default function Terms() {
  return (
    <>
      <Header />
      <div className="container" style={{display: 'flex', width: '100%',justifyContent: 'center', paddingTop: 120}}>
        <div style={{display: 'flex', width: '100%',justifyContent: 'center', flexDirection: 'column'}}>
          <p style={{fontSize: 78, textAlign: 'center', fontWeight: 'bold', color: '#ff9933'}}>404</p>
          <h1 style={{textAlign: 'center'}}> PAGE NOT FOUND</h1>
        </div>
      </div>
      <Footer />
    </>
  )
}
