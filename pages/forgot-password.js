import axios from 'axios';
import { useState, useContext} from 'react'
import React from 'react'
import ForgotPasswordForm from '../components/Forms/ForgotPasswordForm'
import { toast } from 'react-toastify';
import { Modal, Button } from 'antd';
import Link from 'next/link';
import { UserContext } from '../context';
import { useRouter } from 'next/router';

  const forgotPassword = () => {
    const [email,setEmail]=useState('');
    const [newPassword,setNewPassword]=useState('');
    const[secret,setSecret]=useState('');
    const [ok,setOk] = useState(false);
    const [loading,setLoading] = useState(false)

    const [state] = useContext(UserContext); 
    const router = useRouter();

    const handleSubmit = async (e)=>{
      e.preventDefault();
      try{
        setLoading(true)
      const {data} =  await axios.post(`/forgot-password`,
      {
        email,
        newPassword,
        secret,
      })
      console.log("forgot-pass data =>", data);
    //   setEmail('')
    //   setPassword('')
    //   setSecret('')
    //   setOk(data.ok);
    //   setLoading(false)
    if (data.error) {
        toast.error(data.error);
        setLoading(false);
      }
   
      if (data.success) {
        setEmail("");
        setNewPassword("");
        setSecret("");
        setOk(true);
        setLoading(false);
      }
      }
      catch (err){
        // toast.error(err.response.data, {
        //     position: "top-center",
        //     autoClose: 2000,
        //     theme: "dark",
        //     });
            console.log(err);
            setLoading(false)
      }

    }

    if(state && state.token) router.push('/')
  return (
    <>
    <div className='container-fluid'>
        <div className='row py-5 bg-default-image text-light'>
            <div className='col text-center'>
                <h1 className='display-2 text-center'>Reset password</h1>
            </div>
        </div>
    </div>

    <div className='row py-5'>
      <div className='col-md-6 offset-md-3'>
        <ForgotPasswordForm
        handleSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        secret={secret}
        setSecret={setSecret}
        loading={loading}/>
      </div>
    </div>
    <div className="row">
      <div className='col'>
        <Modal 
        title="Congratulations!"
        open={ok}
        onCancel={() => setOk(false)}
        footer={null}
        >
          <p>Congrats! Password has changed succesfully</p>
            <Link href="/login" className='btn btn-primary btn-sm'>Login</Link>
        </Modal>
      </div>
    </div>
    </>
  )
}

export default forgotPassword