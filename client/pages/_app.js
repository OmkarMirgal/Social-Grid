import { UserProvider } from '../context';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../components/Nav'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import Head from 'next/head';


export default function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
        {/* <div className='container py-4'> */}
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
            <Nav/>
        {/* </div> */}
            <ToastContainer position="top-center"/>
            <Component {...pageProps} />
        </UserProvider>
    );
  }