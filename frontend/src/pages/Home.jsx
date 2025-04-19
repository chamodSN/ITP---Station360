import React from 'react'
import VehicleServiceFeatures from '../components/VehicleServiceFeatures'
import VehicleServices from '../components/VehicleServices'
import VehicleServiceHome from '../components/VehicleServiceHome'

const Home = () => {
  return (
    <div>
      <VehicleServiceHome />
      <VehicleServices />
      <VehicleServiceFeatures />
    </div>
  )
}

export default Home