import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context"
import ParallaxBG from "../components/cards/ParallaxBg"
import axios from "axios"
import PostPublic from '../components/cards/PostPublic'
import Head from 'next/head';
import Link from "next/link";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {path : "/socket.io"}, {
  reconnection : true,
})

const index = ({posts}) => {
  const [ state, setState ] = useContext(UserContext)

  const [timeLine ,setTimeline] = useState([]);
  // useEffect(()=>{
  //   // console.log('socketio join',socket);
  //   socket.on('receive-message',(newMessage)=> {
  //     alert(newMessage);
  //   })
  // },[])

  useEffect(()=>{
    socket.on("new-post",(newPost) =>{
      setTimeline([newPost, ...posts])
    })
  },[])

  const head = () => (
    <Head>
      <title>Social Grid - A social network that connects developers </title>
      <meta 
      name='description' 
      content = 'Social Grid - A social network that connects developers'
      />
      <meta 
      property='og:description'
      content='Social Grid - A social network that connects developers'
      />
      <meta 
      property="og:type"
      content="website" 
      />
      <meta 
      property="og:site_name"
      content="Social Grid" 
      />
      <meta 
      property="og:url"
      content="https://SocialGrid.com" 
      />
      <meta 
      property="og:image:secure_url"
      content="https://SocialGrid.com/images.bg.jpg" 
      />
    </Head>
  )

    const collection = timeLine.length > 0 ?  timeLine : posts ;

  return (
   <>
   {head()}
   <ParallaxBG url ="/images/bg.jpg"/>
    <div className="container">
      {/* <button onClick={()=>{
        socket.emit('send-message',"This is Golu!!");
      }}>Send Message</button> */}
      <div className="row">
        {collection.map((post) => (
          <div key={post._id} className="col-md-4">
            <Link  href={`public/${post._id}`}>     
              <PostPublic  post={post} />
            </Link>
          </div>
        ))}
      </div>
    </div>
   </>
  )
}

//to serverside render the props next js funtion is used (seo) instead of useffect
export async function getServerSideProps() {
  const {data} = await axios.get('/posts')
  return {
    props: {posts: data}
  }
}
export default index