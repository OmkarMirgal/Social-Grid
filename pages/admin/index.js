import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context';
import AdminRoute from '../../components/routes/AdminRoute';
import {useRouter} from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import renderHTML from 'react-render-html';

const Admin = () => {
    const [state, setState] = useContext(UserContext);

    //posts
    const[posts,setPosts] = useState([]);

    //route
    const router = useRouter();
    
    useEffect(()=>{
      if(state && state.token) {
        timeLine()
      }
    },[state && state.token])

    const timeLine = async () => {
      try{
        const {data} = await axios.get(`/posts`)
        // console.log('user posts =>', data)
        setPosts(data);
      }
      catch(err){
        console.log(err)
      }
    }

    const handleDelete = async (post) => {
      try{
        const answer = window.confirm('Are you sure!!')
        if(!answer) return;
        const {data} = await axios.delete(`/admin/delete-post/${post._id}`)
        toast.error('Post Deleted',{autoClose: 2000,theme:'dark'} );
        timeLine();  
      }catch(err){
        console.log(err);
      }
    }

    return (
    <AdminRoute>
      <div className='container-fluid'>
        <div className='row py-5 bg-default-image text-light'>
          <div className='col text-center'>
            <h1 className='display-2 text-center'>ADMIN</h1>
          </div>
        </div>
        
        <div className='row py-4'>
            <div className='col-md-8 offset-md-2 p-3'>
                {posts && posts.map((post)=>(
                    <div key={post._id} className='d-flex justify-content-between'>
                        {/* <div>{renderHTML(post.content)} - <b>{post.postedBy.name}</b></div> */}
                        <div>{renderHTML(post.content)}</div>
                        <div className='text-danger' onClick={ () => handleDelete(post) }> Delete </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </AdminRoute>
  )
}

export default Admin