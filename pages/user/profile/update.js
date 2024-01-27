import axios from 'axios';
import { useState, useContext, useEffect} from 'react'
import React from 'react'
import { toast } from 'react-toastify';
import { Modal, Image } from 'antd';
import Link from 'next/link';
import Authform from '../../../components/Forms/Authform'
import { UserContext } from '../../../context';
import { useRouter } from 'next/router';
import { LoadingOutlined,CameraOutlined } from '@ant-design/icons';


  const ProfileUpdate = () => {
    const [username,setUsername]=useState('');
    const [about,setAbout]=useState('');
    
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const[secret,setSecret]=useState('');
    const [ok,setOk] = useState(false);
    const [loading,setLoading] = useState(false)

    //profile image
    const [image,setImage] = useState({});
    const [uploading,setUploading] = useState(false);


    const [state,setState] = useContext(UserContext); 
    const router = useRouter();

    useEffect(()=>{
        if(state && state.user){
            // console.log('user state=>', state.user)
            setUsername(state.user.username)
            setName(state.user.name)
            setEmail(state.user.email)
            setAbout(state.user.about)
            setImage(state.user.image)

        }
    },[state && state.user])


    const handleSubmit = async (e)=>{
      e.preventDefault();
      try{
        setLoading(true)
      const {data} =  await axios.put(`/profile-update`,
      {
        username,
        about,
        name,
        email,
        password,
        secret,
        image,
      })
    //   console.log("User updated", data)

        if(data.error){
          toast.error(data.error, {
            position: "top-center",
            autoClose: 2000,
            theme: "dark",
            });
          setLoading(false)
        }
        else{
        //updated local storage, update user, keep token
        let auth = JSON.parse(localStorage.getItem('auth'))
        auth.user = data
        localStorage.setItem('auth',JSON.stringify(auth))

        //update context
        setState({...state, user:data})

        setOk(true)
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
    }

    const handleImage = async (e) => {
        const file = e.target.files[0]
        let formData = new FormData()
        formData.append('image', file)
        // console.log([...formData])
        setUploading(true)
        try{
          const {data} = await axios.post('/upload-image',formData)
          // console.log("uploaded image",data)
          setImage({
            url: data.url,
            public_id: data.public_id,
          })
          setUploading(false)
        }
        catch(err){
          console.log(err)
          setUploading(false)
        }
  
      }

  return (
    <>
    <div className='container-fluid'>
        <div className='row py-5 bg-default-image text-light'>
            <div className='col text-center'>
                <h1 className='display-2 text-center'>Profile</h1>
            </div>
        </div>

    <div className='row py-5'>
      <div className='col-md-6 offset-md-3'>

        {/* upload image */}
        <div className='d-flex justify-content-center m-1 p-1'>
            <label >
            {
                image && image.url ? (<Image style={{borderRadius:"1.2rem"}} src={image.url} className='m-1'/>) : uploading ? (<LoadingOutlined className='mt-2'/>) : (<CameraOutlined className='mt-2'/>)
            }
                <input onChange={handleImage} type="file" accept="images/*" hidden />
            </label>
        </div>

        <Authform
        profileUpdate={true}
        handleSubmit={handleSubmit}
        username={username}
        setUsername={setUsername}
        about={about}
        setAbout={setAbout}
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
          <p>You Have Succesfully Updated Your Profile</p>
            {/* <Link href="/login" className='btn btn-primary btn-sm'>Login</Link> */}
        </Modal>
      </div>
    </div>

    <div className='row'>
      <div className='col'>
        <p className='text-center'>Already Registered? <Link href={'/login'}>Login</Link></p>
      </div>
    </div>
    </div>
    </>
  )
}

export default ProfileUpdate