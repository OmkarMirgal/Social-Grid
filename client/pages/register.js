import axios from 'axios';
import { useState, useContext} from 'react'
import React from 'react'
import { toast } from 'react-toastify';
import { Modal, Button } from 'antd';
import Link from 'next/link';
import Authform from '../components/Forms/Authform'
import { UserContext } from '../context';
import { useRouter } from 'next/router';

  const register = () => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const[secret,setSecret]=useState('');
    const [ok,setOk] = useState(false);
    const [loading,setLoading] = useState(false)

    const [state] = useContext(UserContext); 
    const router = useRouter();

    const handleSubmit = async (e)=>{
      e.preventDefault();
      try{
        setLoading(true)
      const {data} =  await axios.post(`/register`,
      {
        name,
        email,
        password,
        secret,
      })
      
        if(data.error){
          toast.error(data.error, {
            position: "top-center",
            autoClose: 2000,
            theme: "dark",
            });
          setLoading(false)
        }
        else{
        setName('')
        setEmail('')
        setPassword('')
        setSecret('')
        setOk(data.ok);
        setLoading(false)
        }
      }
      catch (err){
        toast.error(err.response.data, {
            position: "top-center",
            autoClose: 2000,
            theme: "dark",
            });
            setLoading(false)
      }

      // axios.post('http://localhost:8000/api/register',
      // {
      //   name,
      //   email,
      //   password,
      //   secret,
      // })
      // // .then ((res) => console.log(res))
      // // .catch((err) => console.log(err));

      // .then ((res) => setOk(res.data.ok))
      // .catch((err)=> toast.error(err.response.data, {
      //   position: "top-center",
      //   autoClose: 2000,
      //   theme: "dark",
      //   }));

    }

    if(state && state.token) router.push('/')
  return (
    <>
    <div className='container-fluid'>
        <div className='row py-5 bg-default-image text-light'>
            <div className='col text-center'>
                <h1 className='display-2 text-center'>Register Page</h1>
            </div>
        </div>
    </div>

    <div className='row py-5'>
      <div className='col-md-6 offset-md-3'>
        <Authform
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
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
          <p>You Have Succesfully Registered.</p>
            <Link href="/login" className='btn btn-primary btn-sm'>Login</Link>
        </Modal>
      </div>
    </div>

    <div className='row'>
      <div className='col'>
        <p className='text-center'>Already Registered? <Link href={'/login'}>Login</Link></p>
      </div>
    </div>
    </>
  )
}

export default register