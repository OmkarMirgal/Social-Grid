import { Avatar, List } from 'antd';
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext,useEffect,useState } from "react";
import { LoadingOutlined } from '@ant-design/icons';
import {imageSource} from '../../functions';
import Link from 'next/link';

const People = ({people,handleFollow,handleUnfollow}) => {
    const [state]=useContext(UserContext)

    const [loading,setloading] = useState(false); 

    useEffect(()=>{
        if(people) {setloading(true)}
    },[])

    const router= useRouter();

    return(
           <>
            {/* <pre>{JSON.stringify(people,null,4)}</pre> */}
            { people && loading  && loading ? (<List itemLayout="horizontal" dataSource ={people} renderItem={(user)=>
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar src={imageSource(user)}/>}
                    title={
                        <div className="d-flex justify-content-between">
                            <Link href={`/user/${user.name}`} style={{textDecoration:'none',color:'black' }}>{user.name}</Link>
                            {state &&
                            state.user &&
                            state.user.followers &&
                             user.followers.includes(state.user._id) 
                            ? <span onClick={()=>handleUnfollow(user)} className="text-primary pointer">Unfollow</span>
                            : <span onClick={()=>handleFollow(user)} className="text-primary pointer">Follow</span>
                            }
                        </div>
                        }
                />
            </List.Item>
            }
            />) : <LoadingOutlined/>}
        </>
    )
}

export default People