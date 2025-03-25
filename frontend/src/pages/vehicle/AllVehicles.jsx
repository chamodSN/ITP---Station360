import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AllVehicles = () => {

    const [vehicles, setVehicles] = useState([])
    
    const navigate = useNavigate();

const getAllVehicles = async () => {


    try {
        const {data} = await axios.get('http://localhost:4200/api/user/all-vehicles');

        console.log(data);
        
        if(data.success) {
            setVehicles(data.allVehicles)
        }else {
            alert('Failed to get vehicles')
        }

    } catch (error) {
        console.error(error);
    }
}

useEffect(() => {
    getAllVehicles();
}, []);


  return (
    <div>
        <h1>All Vehicles</h1>
        <div>
            {vehicles.map((item,index)=>(

                <div key={item._id}onClick={() => navigate(`/vehicle/${item._id}`)}>
                    <p>{item.brandName}</p>
                    <p>{item.modelName}</p>
                    <p>{item.plateNumber}</p>
                    <p>{item.vinNumber}</p>
                    <p>{item.fuelType}</p>
                    <img src={item.Image} alt={item.brandName} />
                </div>    
            ))}
        </div>


    </div>
  )
}

export default AllVehicles