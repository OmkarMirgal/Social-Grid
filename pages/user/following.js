import { Avatar, List } from 'antd';
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext,useState,useEffect } from "react";
import axios from 'axios';
import { RollbackOutlined } from '@ant-design/icons';
import Link from 'next/link';

const Following = () => {
    const [state,setState]=useContext(UserContext)

    const [people,setPeople]=useState([]);

    const [loading, setLoading]= useState(false);
    

    const router= useRouter();

    useEffect(()=>{
        if(state && state.token){
            fetchFollowing();
        }
    },[state && state.token]);

    const fetchFollowing = async () => {
        setLoading(true)
        try{
        const {data} = await axios.get('/user-following');
        // console.log('following=>', data);
        setPeople(data);
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

    const handleUnfollow = async (user) => {
        try{
            const {data} = await axios.put('/user-unfollow',{_id: user._id});
            
            //update local storage ,update user, keep token 
            let auth = JSON.parse(localStorage.getItem('auth'))
            auth.user = data
            localStorage.setItem('auth',JSON.stringify(auth))

            //update context
            setState({...state, user:data})

            //update people state 
            let filtered =people.filter((p)=> (p._id !== user._id))//updated user is filtered out 
            setPeople(filtered)

            toast.danger(`You started unfollowing ${user.name}`)

        }catch(err){
            console.log(err)
        }
    }

    return(
           <div className='col-md-6 offset-md-3 mt-3 py-3'>
            {/* <pre>{JSON.stringify(people,null,4)}</pre> */}
           <List itemLayout="horizontal" bordered={true} dataSource={people}  renderItem={(user)=>
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar src={imageSource(user)}/>}
                    title={
                        <div className="d-flex justify-content-between">
                            {user.name}
                            <span onClick={()=>handleUnfollow(user)} className="text-primary pointer">Unfollow</span>
                        </div>
                        }
                />
            </List.Item>
            }
            />

            <Link href='/user/dashboard' className='d-flex justify-content-center py-3'><>{<RollbackOutlined/>}</></Link>
        </div>
    )
}

export default Following