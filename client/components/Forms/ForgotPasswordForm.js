import {SyncOutlined } from '@ant-design/icons';

const Authform = ({ handleSubmit,name,setName,email,setEmail,newPassword,setNewPassword,secret,setSecret,loading,page}) => {
  return (
    <form onSubmit={handleSubmit}>
            <div className='form-group p-2'>
                <small><label className='text-muted'>Your Email</label></small>
                <input type='email' className='form-control' placeholder='Enter email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className='form-group p-2'>
                <small><label className='text-muted'>Your New Password</label></small>
                <input type='password' className='form-control' placeholder='Enter password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
            </div>
            <>
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
            </>
            <div className='form-group p-2'>
            <button disabled={!email || !newPassword || !secret || loading} 
            className='btn btn-primary col-12'>{loading ? <SyncOutlined spin className='py-1'/> : 'Submit'}</button>
            </div>            
        </form>
  )
}

export default Authform