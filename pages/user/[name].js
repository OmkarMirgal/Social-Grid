import { Avatar, Card } from 'antd';
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext,useState,useEffect } from "react";
import axios from 'axios';
import { RollbackOutlined } from '@ant-design/icons';
import Link from 'next/link';

const {Meta} = Card

const Name = () => {
    const [state,setState]=useContext(UserContext)

    const [user,setUser]=useState([]);

    const [loading, setLoading]= useState(false);
    

    const router= useRouter();

    useEffect(()=>{
        if(router.query.name){
            fetchUser();
        }
    },[router.query.name]);

    const fetchUser = async () => {
        setLoading(true)
        try{
        const {data} = await axios.get(`/user/${router.query.name}`);
        // console.log('following=>', data);
        setUser(data);
        setLoading(false)
        }catch(err){
            console.log(err)
            setLoading(false)
        }
    }

    const imageSource = (user) => {
        if(user.image){
            return user.image.url
        }
        else{
            return '/images/bg.jpg'
        }
    }

    return(
           <div className='col-md-6 offset-md-3 mt-3 py-3'>
            {/* <pre>{JSON.stringify(user,null,4)}</pre> */}

            <div className='pt-5 pb-5'>
                <Card hoverable={true} cover={<img src={imageSource(user)} alt={user.name} style={{height: '25rem'}} />}>
                    <Meta title={user.name} description={user.about} />

                    <p className='pt-2 text-muted'>
                        Joined {moment(user.createdAt).fromNow()} 
                    </p>

                    <div className='d-flex justify-content-between '>
                        <span className='btn btn-sm' style={{fontWeight:'600'}} >{user.followers && user.followers.length} Followers</span>
                        <span className='btn btn-sm' style={{fontWeight:'600'}}>{user.following && user.following.length} Following</span>
                    </div>

                </Card>
            </div>

            <Link href='/user/dashboard' className='d-flex justify-content-center py-3'><>{<RollbackOutlined/>}</></Link>
        </div>
    )
}

export default Name