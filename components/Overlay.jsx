import  Image  from 'next/image'
import React from 'react'

const Overlay = () => {
  return (
    <div className='w-screen h-screen absolute top-0 left-0 flex items-center justify-center z-50 pointer-events-none'>
      <Image src={'/images/logo_main.svg'} width={200} height={100} alt='logo' />
    </div>
  )
}

export default Overlay
