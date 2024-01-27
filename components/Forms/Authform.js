import {SyncOutlined } from '@ant-design/icons';

const Authform = ({ handleSubmit,name,setName,email,setEmail,password,setPassword,secret,setSecret,loading,page,username,setUsername,about,setAbout,profileUpdate}) => {
  return (
    <form onSubmit={handleSubmit}>
           {profileUpdate && 
           <>
           <div className='form-group p-2'>
                <small><label className='text-muted'>Your Username</label></small>
                <input type='text' className='form-control' autoComplete='false' placeholder='Enter username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
            </div>
            <div className='form-group p-2'>
                <small><label className='text-muted'>Tell us about yourself</label></small>
                <input type='text' className='form-control' placeholder='Write about yourself...' value={about} onChange={(e)=>setAbout(e.target.value)}/>
            </div>
            </>
            }

            {page !=='login' && <div className='form-group p-2'>
                <small><label className='text-muted'>Your Name</label></small>
                <input type='text' className='form-control' placeholder='Enter name' value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>}
            <div className='form-group p-2'>
                <small><label className='text-muted'>Your Email</label></small>
                <input type='email' className='form-control' placeholder='Enter email' value={email} onChange={(e)=>setEmail(e.target.value)} disabled={profileUpdate}/>
            </div>
            <div className='form-group p-2'>
                <small><label className='text-muted'>Your Password</label></small>
                <input type='password' className='form-control' autoComplete='false' placeholder='Enter password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            {page !=='login' && <>
                <div className='form-group p-2'>
                <small><label className='text-muted'>Pick a question</label></small>
                <select className='form-control'>
                    <option>What is Your favourite color?</option>
                    <option>What was Your First Tech Stack?</option>
                    <option>How much was your first Salary?</option>
                </select>

                <small className='form-text text-muted'>
                    You can use this to reset your password if you forgotten.
                </small>
                </div>
                <div className='form-group p-2'>
                <input type='text' className='form-control' placeholder='Write your answer here' value={secret} onChange={(e)=>setSecret(e.target.value)}/>
                </div>
            </>}
            <div className='form-group p-2'>
            <button disabled={
            profileUpdate ?  !name || !email :    
            page === 'login' ? 
            !email || !password :
            !name || !email || !secret || !password} 
            className='btn btn-primary col-12'>{loading ? <SyncOutlined spin className='py-1'/> : 'Submit'}</button>
            </div>            
        </form>
  )
}

export default Authform