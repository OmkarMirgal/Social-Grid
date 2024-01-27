import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "../../../../components/cards/Post";
import Link from "next/link";
import { RollbackOutlined } from '@ant-design/icons';

// import UserRoute from '../../../components/routes/UserRoute';

const PostComments = () => {

    //states
    const [post,setPost] = useState({})
    
    const router = useRouter()
    const _id = router.query._id

    useEffect(()=>{
        if(_id) fetchPost()
    },[_id])

    const fetchPost = async () => {
        try{
            const {data} = await axios.get(`/user-post/${_id}`);
            setPost(data); 
            // console.log(data)
        }catch(err){
            console.log(err)
        }
    } 
    const removeComment = async(postId,comment) => {
      let answer = window.confirm('Are you sure?')
      if(!answer) return
      try{
        const {data} = await axios.put('/remove-comment',{postId,comment})
        console.log('comment removed', data)
        fetchPost()
      }catch(err){
        console.log(err)
      }
    }

  return (
    <>
    <div className="container-fluid">
        <div className='row py-5 bg-default-image text-light'>
          <div className='col text-center'>
            <h1 className='display-2 text-center'>Comments</h1>
          </div>
        </div>

        <div className="row col-md-8 offset-md-2 mt-4 p-3">
            <Post post={post} commentCount={100} removeComment={removeComment}/>

            <Link href={'/user/dashboard'} className='d-flex justify-content-center p-1' >
                <RollbackOutlined/>
            </Link>
        </div>

    </div>
    </>
    // <pre>{JSON.stringify(post,null,4)}</pre>
  )
}

export default PostComments