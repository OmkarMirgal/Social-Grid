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

const PostPublic = ({post, handleDelete,remove,handleLike,handleUnlike,handleComment,commentCount=3,removeComment}) => {
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
                           ( <HeartFilled  className='text-danger pt-2 h5'/>)
                        :
                            (<HeartOutlined  className='text-danger pt-2 h5'/>)
                    }
                    <div className='pt-2 px-2'style={{marginRight: '1rem'}}>{post.likes.length} Likes</div>
                    <CommentOutlined className='text-danger pt-2 h5 pl-5'/>
                    <div className='pt-2 px-2'>
                        {post.comments.length}&nbsp;&nbsp;  
                        <span className='text-dark' style={{textDecoration:'none'}} >Comments</span>
                        </div>
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
                    </span>
                    </li>
                   ))}
                </ol>
            )}
        </div>}
    </>
  )
}

export default PostPublic