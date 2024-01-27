import renderHTML from 'react-render-html'
import moment from 'moment'
import { Avatar } from 'antd'
import PostImage from '../images/PostImage'
import {HeartOutlined, HeartFilled, CommentOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons'
import { useContext } from 'react'
import { UserContext } from '../../context'
import { useRouter } from 'next/router'
import {imageSource} from '../../functions';
import Link from 'next/link'
import Post from '../cards/Post';

const PostList = ({posts, handleDelete,remove,handleLike,handleUnlike,handleComment,removeComment}) => {
    //state
    const [state]= useContext(UserContext);

    //router
    const router = useRouter();

  return (
    <>
    {
        posts && posts.map((post)=> <Post key={post._id} post={post} handleDelete={handleDelete} remove={remove} handleLike={handleLike} handleUnlike={handleUnlike} handleComment={handleComment} removeComment={removeComment}/>)
    }
    </>
  )
}

export default PostList