import { useContext, useEffect,useState } from "react";
import axios from "axios";
import {useRouter} from 'next/router';
import { SyncOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

const UserRoute = ({children}) => {
  const[ok,setOk] =useState(false);
  const router = useRouter();
  const[state]=useContext(UserContext);  
    
  useEffect(()=>{
    if(state && state.token) getCurrentUser();  
  },[state && state.token])
    
  const getCurrentUser = async () =>{
    try{
        // const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API}/current-user`,
        const {data} = await axios.get(`/current-user`);

        //axios headers setuped in wrapper component UserRoute
        // {headers:
        //     {Authorization : `Bearer ${state.token}`},
        // });
        if(data.ok) setOk(true);
    }
    catch(err){
        router.push('/login');
    }
  }

  process.browser && state === null && setTimeout(()=>{getCurrentUser();},1000)

  return !ok ? (<SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5"/>) : (<>{children}</>)
}

export default UserRoute