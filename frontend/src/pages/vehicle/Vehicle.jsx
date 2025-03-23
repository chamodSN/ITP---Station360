import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect,useState } from 'react';

const Vehicle = () => {
    const {id} = useParams();
    const [vehicle, setVehicle] = useState(null);
    


const fetchVehicle = async () => {

    try{
        const {data} = await axios.get(`http://Localhost:4200/api/user/vehicle/${id}`);

        if(data.success){
            setVehicle(data.vehicle);
        }
    }catch(error){
        console.error(error);
    }
};

useEffect(() => {
    fetchVehicle();
}, [id]);

return vehicle && (
    <>
    <div>Vehicle</div>
    
    <div>
    <p>{vehicle.brandName}</p>
            <p>{vehicle.modelName}</p>
            <p>{vehicle.vinNumber}</p>
            <p>{vehicle.plateNumber}</p>
            <p>{vehicle.fuelType}</p>
            <img src={vehicle.Image} alt={vehicle.brandName} /> 
    </div>
            
     </>

           
)

}

export default Vehicle