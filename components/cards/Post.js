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

const Post = ({post, handleDelete,remove,handleLike,handleUnlike,handleComment,commentCount=3,removeComment}) => {
    //state
    const [state]= useContext(UserContext);

    //router
    const router = useRouter();

  return (
    <>
        {post && post.postedBy && <div key={post._id} className='card mb-4 p-2'>
            <div className="card-header">
                {/* <Avatar size={40} className='m-1 text-light bg-dark'>
                    {post.postedBy.name[0]}
                    </Avatar> */}
                    {/* <pre>{JSON.stringify(post.postedBy)}</pre> */}
                    <Avatar size={40} src={imageSource(post.postedBy)} className='m-1 text-light bg-dark'/>
                    <span className='p-2'>{post.postedBy.name}</span>
                    <span>{moment(post.createdAt).fromNow()}</span>
            </div>
            <div className="card-body">
            {renderHTML(post.content)}
            </div>
            <div className="card-footer">
                {/* <img className='card-img-top' src={post.image && post.image.url} alt={post.postedBy.name}></img> */}
                {post.image && (
                    <PostImage url={post.image.url}/>
                )}
                <div className='d-flex pt-2'>
                    {
                       state && state.user && post.likes && post.likes.includes(state.user._id)
                        ?
                           ( <HeartFilled onClick={()=>handleUnlike(post._id)} className='text-danger pt-2 h5'/>)
                        :
                            (<HeartOutlined onClick={()=>handleLike(post._id)} className='text-danger pt-2 h5'/>)
                    }
                    <div className='pt-2 px-2'style={{marginRight: '1rem'}}>{post.likes.length} Likes</div>
                    <CommentOutlined onClick={() => handleComment(post)} className='text-danger pt-2 h5 pl-5'/>
                    <div className='pt-2 px-2'>
                        {post.comments.length}&nbsp;&nbsp;  
                        <Link className='text-dark' style={{textDecoration:'none'}} href={`post/comments/${post._id}`}>Comments</Link>
                        </div>
                    
                    
                    {state && state.user && state.user._id === post.postedBy._id && 
                        <>
                            <EditOutlined onClick={() => router.push(`/user/post/${post._id}`)} className='text-danger pt-2 h5 px-3 mx-auto'/>
                            {/* <DeleteOutlined onClick={() => handleDelete(post)} className='text-danger pt-2 h5 px-3'/> */}
                            {post && remove ? (<SyncOutlined spin={true} className=' text-success m-2 p-1' style={{scale:'1.2'}}/>) : (<DeleteOutlined onClick={() => handleDelete(post)} className='text-danger pt-2 h5 px-3'/> )}
                        </>
                    }

                </div>
            </div>

            {/* render comments  */}
            {post.comments && post.comments.length > 0 &&
            (
                <ol className='list-group' style={{overflowX:'scroll',maxHeight:'8rem'}}>
                   {post.comments.slice(0,commentCount).map((c) => (
                    <li key={c._id} className='list-group-item d-flex justify-content-between align-items-start' >
                    <div className='ms-2 me-auto'>
                        <div><Avatar className='mb-1 mr-3' size={25} src={imageSource(c.postedBy)} /> {c.postedBy.name}</div>
                        <div className='fw-normal fst-italic'>{c.text}</div>
                    </div>
                    <span className='badge text-muted rounded-pill'>{moment(c.created).fromNow()}
                    {state && state.user && state.user._id === c.postedBy._id && (
                        <div className='ml-auto mt-3'>
                            <DeleteOutlined onClick={()=>removeComment(post._id,c)} className='pl-3 text-danger'/>
                        </div>
                    )}
                    </span>
                    </li>
                   ))}
                </ol>
            )}
        </div>}
    </>
  )
}

export default Post