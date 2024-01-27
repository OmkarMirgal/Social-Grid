import { useState,useContext } from "react"
import { UserContext } from "../context"
import axios from "axios"
import { toast } from "react-toastify"
import People from "./cards/People"

const Search = () => {

const [state,setState] = useContext(UserContext)

const [query , setQuery] = useState('');

const [result, setResult]=useState([]);

const searchUser = async (e) => {
    e.preventDefault()
    // console.log(`Find "${query}" from db`)
    try {
        const {data} = await axios.get(`/search-user/${query}`);
        // console.log('Search user response =>', data)
        setResult(data);
    } catch (err) {
        console.log(err)
    }
}

const handleFollow = async (user) => {
    try {
        const {data} = await axios.put('/user-follow', {_id : user._id})

        //updating the local storage
        let auth = JSON.parse(localStorage.getItem('auth'))
        auth.user = data
        localStorage.setItem('auth',JSON.stringify(auth))
        //updating context
        setState({...state, user:data})
        
        //updating result state(filter out the user)
        let filtered = result.filter((r)=>(r._id!=user._id))
        setResult(filtered);
        
        toast.success(`You started following ${user.name}`,{autoClose: 2000})

    } catch (err) {
        console.log(err)
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
        let filtered =result.filter((p)=> (p._id !== user._id))//updated user is filtered out 
        setResult(filtered)

        toast.error(`You started unfollowing ${user.name}`,{autoClose: 2000})


    }catch(err){
        console.log(err)
    }
}

  return (
    <>
    <form className="form-inline row" onSubmit={searchUser}>
      <div className="col-md-9">
        <input onChange={(e) => {
            setQuery(e.target.value); 
            setResult([]);
        }}
        value={query} 
        className="form-control mr-sm-2 col" 
        placeholder="Search" 
        type="Search"/>
      </div>
      <div className="col-md-3">
        <button className="btn btn-outline-primary my-2 my-sm-0 mr-2" type="submit" >Search</button>
      </div>
    </form>

    {result && result.map((r) => <People key={r._id} people={result} handleUnfollow={handleUnfollow} handleFollow={handleFollow}/> )}
    </>
  )
}

export default Search