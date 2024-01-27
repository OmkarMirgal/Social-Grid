import ParallaxBG from "../../components/cards/ParallaxBg"
import axios from "axios"
import PostPublic from '../../components/cards/PostPublic'
import Head from 'next/head';

const SinglePost = ({post}) => {

    const head = () => (
    <Head>
      <title>Social Grid - A social network that connects developers </title>
      <meta 
      name='description' 
      content = 'Social Grid - A social network that connects developers, an individual posts from a developer'
      />
      <meta 
      property='og:description'
      content='Social Grid - A social network that connects developers, an individual posts from a developer'
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

  return (
   <>
   {head()}
   <ParallaxBG url ="/images/bg.jpg"/>
    <div className="container ">
      <div className="d-flex justify-content-center">            
        <div className="col-12">
          <PostPublic key = {post._id} post ={post} />
        </div> 
      </div>
    </div>
   </>
  )
}

//to serverside render the props next js funtion is used (seo) instead of useffect
export async function getServerSideProps(ctx) {
  const { _id } = ctx.query; // retrieve the _id parameter from the URL
  const {data} = await axios.get(`/getPost/${_id}`)// fetch post data using _id
  return {
    props: {post: data}
  }
}

export default SinglePost