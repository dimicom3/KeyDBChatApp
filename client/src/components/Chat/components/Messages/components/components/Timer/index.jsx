import React, { useEffect } from 'react'
function Timer(TTL=100) {
useEffect(() => {
    console.log("circleTimer")
}, []) 
  return (
  <div className="set-size charts-container">
    <div className="pie-wrapper pie-wrapper--solid progress-65">
      <span className="label">65<span className="smaller">%</span></span>
    </div>
  </div>
  )
}

export default Timer