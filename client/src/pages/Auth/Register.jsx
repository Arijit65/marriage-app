import React from 'react'
import { useParams } from 'react-router-dom'
import PostAdForm from '../../Components/RegisterForm'
import MainHeader from '../../Components/mainHeader'
import Footer from '../../Components/Footer'

const Register = () => {
  const { referCode } = useParams();
  
  return (
    <div>
        <MainHeader/>
        <PostAdForm referCode={referCode} />
        <Footer/>
      
    </div>
  )
}

export default Register
