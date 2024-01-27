import axios from 'axios';
import { useContext, useState } from 'react'
import React from 'react'
import { toast } from 'react-toastify';
import { Modal, Button } from 'antd';
import Link from 'next/link';
import Authform from '../components/Forms/Authform'
import { useRouter } from 'next/router';
import { UserContext } from '../context';

  const login = () => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [loading,setLoading] = useState(false);
    const [state, setState] = useContext(UserContext);

    const router = useRouter();

    const handleSubmit = async (e)=>{
      e.preventDefault();
      try{
        setLoading(true)
      const {data} =  await axios.post(`/login`,
      {
        email,
        password,
      })

      if(data.error){
        toast.error(data.error, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
          });
        setLoading(false);
      }
      else{
        //update context
        setState({
          user : data.user,
          token : data.token,
        })
        //save in local storage
        window.localStorage.setItem('auth', JSON.stringify(data))
      }
     
      router.push('/user/dashboard');

      }
      catch (err){
        toast.error(err.response.data, {
            position: "top-center",
            autoClose: 2000,
            theme: "dark",
            });
            setLoading(false)
      }
    }

    if(state && state.token) router.push('/user/dashboard')
  return (
    <>
    <div className='container-fluid'>
        <div className='row py-5 bg-default-image text-light'>
            <div className='col text-center'>
                <h1 className='display-2 text-center'>Login Page</h1>
            </div>
        </div>
    </div>

    <div className='row py-5'>
      <div className='col-md-6 offset-md-3'>
        <Authform
        handleSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        page='login'/>
      </div>
    </div>

    <div className='row'>
      <div className='col'>
        <p className='text-center'>Not yet registered ? {''}<Link href={'/register'}>Register</Link></p>
      </div>
    </div>

    <div className='row'>
      <div className='col'>
        <p className='text-center'><Link href={'/forgot-password'} className="text-danger">Forgot password</Link></p>
      </div>
    </div>
    </>
  )
}

export default login;