import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Vehicle = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4200/api/user/vehicle/${id}`);
                if (data.success) {
                    setVehicle(data.vehicle);
                }
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            }
        };
        fetchVehicle();
    }, [id]);

    const updateVehicle = async () => {
        try {

            console.log(vehicle)
            const formData = new FormData();

            formData.append("Image", vehicle.Image);
            formData.append("brandName", vehicle.brandName);
            formData.append("modelName", vehicle.modelName);
            formData.append("vinNumber", vehicle.vinNumber);
            formData.append("plateNumber", vehicle.plateNumber);
            formData.append("fuelType", vehicle.fuelType);

            if (image) {
                formData.append("Image", image);
            }

            console.log(formData);

            const { data } = await axios.put(`http://localhost:4200/api/user/update-vehicle/${id}`, formData);
            console.log('data', data);

            if (data.success) {
                toast.success("Vehicle Updated Sucessfully");
                setIsEdit(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error updating image:", error);
        }
    };

    const deleteVehicle = async () => {
        try {
            const { data } = await axios.delete(`http://localhost:4200/api/user/vehicle/${id}`);
            if (data.success) {
                toast.success("Vehicle Deleted Successfully");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating image:", error);
        }
    }

    return vehicle && (
        <div>
            <h1>Vehicle</h1>
            <p>{vehicle.brandName}</p>
            <p>{vehicle.modelName}</p>
            <p>{vehicle.vinNumber}</p>
            <p>{vehicle.plateNumber}</p>
            <p>{vehicle.fuelType}</p>
            {!isEdit ? <img src={vehicle.Image} alt={vehicle.brandName} /> :
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            }{isEdit ? (
                <button onClick={() => updateVehicle()}>Save</button>
            ) : (
                <button onClick={() => setIsEdit(!isEdit)}>Edit</button>
            )}
            <br />
            <br />
            <button onClick={() => deleteVehicle()}>Delete</button>

        </div>
    );
};

export default Vehicle;
