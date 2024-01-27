import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context'
import UserRoute from '../../components/routes/UserRoute'
import PostForm from '../../components/Forms/PostForm'
import {useRouter} from 'next/router'
import axios from 'axios'
import { toast } from 'react-toastify';
import PostList from '../../components/cards/PostList'
import People from '../../components/cards/People'
import Link from 'next/link';
import { Modal, Pagination} from 'antd'
import CommentForm from '../../components/Forms/CommentForm'
import Search from '../../components/Search'
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, { path: '/socket.io'}, { 
  reconnection : true,
})

const dashboard = () => {
    const [state, setState] = useContext(UserContext);
    //state
    const[content,setContent] = useState('');
    const[image,setImage] = useState({});
    const[uploading,setUploading] = useState(false);    

    //posts
    const[posts,setPosts] = useState([]);
    const[remove,setRemove] = useState(false);   
    
    //people
    const[people,setPeople] = useState({}); 

    //comments
    const[comment,setComment]=useState('')
    const[visible,setVisible]=useState(false)
    const[currentPost,setCurrentPost]=useState({})

    //pagination 
    const [totalPosts,setTotalPosts]=useState(0);
    const [page,setPage]=useState(1);
    
    //route
    const router = useRouter();
    
    useEffect(()=>{
      if(state && state.token) {
        timeLine()
        findPeople()
      }
    },[state && state.token && people, page])

    useEffect(()=> {
      try{
        axios.get('/total-posts').then(({data})=>setTotalPosts(data))
      }catch(err){
        console.log(err)
      }
    },[])

    const timeLine = async () => {
      try{
        const {data} = await axios.get(`/timeLine/${page}`)
        // console.log('user posts =>', data)
        setPosts(data);
      }
      catch(err){
        console.log(err)
      }
    }

    const findPeople = async () => {
      try{
        const {data} = await axios.get('/find-people')
        setPeople(data)
      }catch(err){
        console.log(err)
      }
    }

    const postSubmit = async (e) => {
      e.preventDefault();
      // console.log('post =>', content)
      try{
        const{data} = await axios.post('/create-post',{content, image})
        // console.log('create post response', data);
        if(data.error){
          toast.error(data.error,{autoClose: 2000})
        }
        else{
          setPage(1)
          timeLine();
          toast.success('post created',{autoClose: 2000,theme:'dark'});
          setContent('');
          setImage({})

          //socket
          socket.emit("new-post",data);
        }
      }
      catch(err){
        console.log(err)
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

    const handleDelete = async (post) => {
      try{
        const answer = window.confirm('Are you sure!!')
        if(!answer) return;
        setRemove(true);
        // console.log('loading');
        const {data} = await axios.delete(`/delete-post/${post._id}`)
        setRemove(false);
        toast.error('Post Deleted',{autoClose: 2000,theme:'dark'} );
        timeLine();  
      }catch(err){
        console.log(err);
      }
    }

    const handleLike = async (_id) => {
      // console.log('liked the post', _id)
      try{
        const {data} = await axios.put('/like-post',{_id})
        // console.log('post liked', data)
        timeLine()
      }catch(err){
        console.log(err)
      }
    }

    const handleUnlike = async(_id) => {
      // console.log('Unliked the post', _id)
      try{
        const {data} = await axios.put('/unlike-post',{_id})
        // console.log('post unliked', data)
        timeLine()
      }catch(err){
        console.log(err)
      }
    }

    //comments
    const handleComment = (post) => {
      setCurrentPost(post)
      setVisible(true)
    }

    const addComment = async (e) => {
      e.preventDefault();
      // console.log('add comment to this post to this id =>', currentPost._id)
      // console.log('save comment to db',comment)
      try{
        const {data} = await axios.put('/add-comment', 
        {
          post_id: currentPost._id,
          comment
        })
        console.log('add-comment => ', data)
        setComment('')
        setVisible(false)
        timeLine()
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
        timeLine()
      }catch(err){
        console.log(err)
      }
    }

    const handleFollow = async (user) => {
    //   console.log('add user to list',user)
    try{
      const {data} = await axios.put('/user-follow',{_id: user._id})
      // console.log('id is ',data) 
      
      //update local storage ,update user, keep token 
      let auth = JSON.parse(localStorage.getItem('auth'))
      auth.user = data
      localStorage.setItem('auth',JSON.stringify(auth))

      //update context
      setState({...state, user:data})

      //update people state 
      let filtered =people.filter((p)=> (p._id !== user._id))//updated user is filtered out 
      setPeople(filtered)

      //render the post in timeline 
      timeLine()
      toast.success(`You started Following ${user.name}`)
    }catch(err){
      console.log(err)
    }
    }

    return (
    <UserRoute>
      <div className='container-fluid'>
        <div className='row py-5 bg-default-image text-light'>
          <div className='col text-center'>
            <h1 className='display-2 text-center'>TimeLine</h1>
          </div>
        </div>
      

        <div className='row py-3'>
          <div className='col-md-8'>
            <PostForm 
            content = {content} 
            setContent={setContent} 
            postSubmit={postSubmit} 
            handleImage={handleImage}
            uploading={uploading}
            image={image}
            />
            <br />
            <PostList posts={posts} 
            handleDelete={handleDelete}
            remove={remove}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleComment={handleComment}
            commentCount={-2}
            removeComment={removeComment}
            />

            <Pagination className='pb-2' onChange ={(value) => setPage(value)} current={page} total={Math.ceil(totalPosts/3)*10}/>

            </div>

          {/* <pre>{JSON.stringify(posts,null,4)}</pre> */}
          
          <div className='col-md-4'>
            <Search/>
            <br/>
          {state && state.user && state.user.following && <Link className='h6' href={`/user/following`}>{state.user.following.length} Following</Link>}
            {state && state.token && people &&
              <People people={people} handleFollow={handleFollow}/>}
          </div>
        </div>
          
          <Modal open={visible} onCancel={()=> setVisible(false)} title="Comment" footer={null}>
            <CommentForm addComment={addComment} comment={comment} setComment={setComment}/>
          </Modal>

      </div>
    </UserRoute>
  )
}

export default dashboard