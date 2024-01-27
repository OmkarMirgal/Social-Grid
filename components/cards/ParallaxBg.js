import { useContext } from "react"

const ParallaxBG = ({url, children= 'Social Grid'}) => {
  return (
    <div className='fluid'>
      <h1 className='display-2 fw-bold text-center py-5' style={{
        backgroundImage: "url("+url+")",
        backgroundAttachment: 'fixed',
        padding: '100px 0 75px 0',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        display: 'block',
        }}>{children}</h1>
    </div>
  )
}

export default ParallaxBG