import React from 'react'
import Link from 'next/link';
import { useContext ,useEffect, useState } from 'react';
import { UserContext } from '../context';
import { useRouter } from 'next/router';
import { Avatar } from 'antd';

const Nav = () => {
  const [current, setCurrent] = useState('');
  const [state, setState] = useContext(UserContext);
  
  useEffect(()=> {
    process.browser && setCurrent(window.location.pathname);
  },[process.browser && window.location.pathname])

    // console.log("current=>",current);
  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem('auth');
    setState(null);
    router.push('/login');
  }

  return (
    <nav className="nav d-flex justify-content-between" style={{backgroundColor: 'black'}}>
      <Link className='btn rounded text-light'  href="/"><Avatar src='/images/logo.jfif'  size={40}/> Social Grid</Link>
        { state !== null ?  
          <>
            {/* <Link className={`nav-link text-light ${current === '/user/dashboard' && 'active'}`} href="/user/dashboard">{state && state.user&& state.user.name}</Link>   
            <a href='' onClick={logout} className={`nav-link text-light ${current === '/logout' && 'active'}`}>Logout</a> */}
            <div className="dropdown">
              <li className={`btn text-light dropdown-toggle  m-2 ${current === '/user/dashboard' && 'bg-primary'}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {state && state.user && state.user.name}
              </li>
              <ul className="dropdown-menu dropdown-menu-dark">
                <Link className={`nav-link text-light ${current === '/user/dashboard' && 'bg-primary'}`} href="/user/dashboard">Dashboard</Link>   
                <Link className={`nav-link text-light ${current === '/user/profile/update' && 'bg-primary'}`} href="/user/profile/update">Profile</Link>
                {/* <Link className={`nav-link text-light ${current === '/logout' && 'bg-primary'}`} onClick={logout} href='javascript:void(0)'>Logout</Link> */}

                { state.user.role === 'Admin' &&
                  (<Link className={`nav-link text-light ${current === '/admin' && 'bg-primary'}`} href="/admin">Admin</Link>)
                }
                <li> <a href='/login' onClick={logout} className={`nav-link text-light ${current === '/logout' && 'bg-primary'}`}>Logout</a></li>
              </ul>
            </div>
          </>  
        :
          <>   
            <Link className={`btn rounded text-light ${current === '/login' && 'bg-primary'}`} href="/login">Login</Link>   
            <Link className={`btn rounded text-light ${current === '/register' && 'bg-primary'}`} href="/register">Register</Link>
          </>
          }
        
        



    </nav>

  )
}

export default Nav