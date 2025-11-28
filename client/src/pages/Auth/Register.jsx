import React from 'react'
import { useParams } from 'react-router-dom'
import PostAdForm from '../../Components/RegisterForm'
import ResponsiveHeader from '../../Components/ResponsiveHeader'
import Footer from '../../Components/Footer'

const Register = () => {
  const { referCode } = useParams();
  
  return (
    <div>
        <ResponsiveHeader/>
        <PostAdForm referCode={referCode} />
        <Footer/>
      
    </div>
  )
}

export default Register
