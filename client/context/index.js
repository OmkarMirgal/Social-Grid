import { useState, createContext ,useEffect} from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';

//initialize context
const UserContext = createContext();

//we create a context's  state to access 
const UserProvider = ({children})=>{
    const [state,setState] = useState({
        user : {},
        token : '',
    })

    useEffect(()=>{
        setState(JSON.parse(window.localStorage.getItem('auth')))
    },[])

    const router = useRouter();

    const token =state && state.token ? state.token : '';
    //axios config in wrapper component
    //baseurl
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
    //headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Add a request interceptor
    axios.interceptors.response.use(
        function (response) {
        // Do something before request is sent
        return response;
    }, function (error) {
        // Do something with request error
        let res= error.response;
        // return Promise.reject(error);
        if(res.status === 401 && res.config && !res.config.__isRetryRequest){ //401 is unauthorized error code
            setState(null);
            window.localStorage.removeItem('auth');
            router.push('/login');
        }
    });

    //we pass the context value with .provider method
    return (
        <UserContext.Provider value={[ state, setState ]}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider};