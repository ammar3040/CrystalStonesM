import React from 'react'

function 
SingleSlide({SlideImg}) {
  return (
 <div style={{width:"100%",
  height:"100%",
    backgroundImage: `url(${SlideImg})`,
       backgroundRepeat:" no-repeat",
       backgroundSize:"cover",
 }}>
    </div>
  )
}

export default  SingleSlide
