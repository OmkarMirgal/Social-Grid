import {Avatar} from 'antd';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'),{ssr: false});
import {CameraOutlined,LoadingOutlined} from '@ant-design/icons';
// // import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PostForm = ({content,setContent,postSubmit,handleImage,uploading,image}) => {
    return(
        <div>
            <div className='card'>
                <div className='card-body pb-3'>
                    <form className='form-group'>
                        <ReactQuill 
                            theme='snow'
                            className='form-control'
                            placeholder='Write something...' 
                            value={content} 
                            onChange={(e) => setContent(e)}/>
                        {/* </ReactQuill> */}
                    </form>
                </div>

                <div className='card-footer d-flex justify-content-between text-muted'>
                    <button onClick={postSubmit} className='btn btn-primary btn-sm  mt-1' disabled={!content}>Post</button>
                    <label >
                    {
                        image && image.url ? (<Avatar size={35} src={image.url} className='mt-1'/>) : uploading ? (<LoadingOutlined className='mt-2'/>) : (<CameraOutlined className='mt-2'/>)
                    }
                        <input onChange={handleImage} type="file" accept="images/*" hidden />
                    </label>
                </div>
            </div>
        </div>
    )
}

export default PostForm