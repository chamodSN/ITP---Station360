import React, { useState } from 'react'
import axios from 'axios'

const AddVehicle = () => {

    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [plateNumber, setPlateNumber] = useState('')
    const [vin, setVin] = useState('')
    const [fuel, setFuel] = useState('')
    const [image, setImage] = useState('')
    const [userId, setUserId] = useState('67dd1a12e1485ca648678a8d')
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('brandName', brand);
            formData.append('modelName', model);
            formData.append('plateNumber', plateNumber);
            formData.append('vinNumber', vin);
            formData.append('fuelType', fuel);
            formData.append('Image', image);

            formData.forEach((value, key) => {
                console.log(`${key} : ${value}`)
            })

            const { data } = await axios.post('http://localhost:4200/api/user/add-vehicle', formData)

            if(data.success){
                window.alert('vehicle Added Sucessfully')
            }else{
                console.log("Error message", data.error)
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (


        <form onSubmit={onSubmitHandler}>
            <h1>AddVehicle</h1>

            <p>Brand Name</p>
            <input type="text" onChange={(e) => setBrand(e.target.value)} value={brand} />
            <br />
            <p>Model Name</p>
            <input type="text" onChange={(e) => setModel(e.target.value)} value={model} />
            <br />
            <p>Plate Number</p>
            <input type="text" onChange={(e) => setPlateNumber(e.target.value)} value={plateNumber} />
            <br />
            <p>Vin Number</p>
            <input type="text" onChange={(e) => setVin(e.target.value)} value={vin} />
            <br />
            <p>Fuel Type</p>
            <input type="text" onChange={(e) => setFuel(e.target.value)} value={fuel} />
            <br />
            <p>Image</p>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <br />
            <button type="submit">Add Vehicle</button>

        </form>


    )
}

export default AddVehicle
