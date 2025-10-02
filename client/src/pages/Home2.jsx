import React from 'react'
import MainHeader from '../Components/mainHeader'
//import RegistrationForm from '../Components/Registrationform'
import HeroRegistration from '../Components/HeroFields'
import WelcomeSection from '../Components/Welcome'
import AdsSection from '../Components/AddSection'
import { Settings, Star, UserCheck } from 'lucide-react'
import ServicesSection from '../Components/Services'
import SuccessStories from '../Components/SuccessStories'
import Footer from '../Components/Footer'

const Home2 = () => {
  return (
    <div>
       <MainHeader/>
      <div id='hero' >
      <HeroRegistration/>
      </div>
      <WelcomeSection/>
      <AdsSection/>
      <ServicesSection/>
      <SuccessStories/>
      <Footer/>


     
    </div>
  )
}

export default Home2
