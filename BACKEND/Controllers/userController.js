import { v2 as cloudinary } from 'cloudinary'
import vehicleModel from '../models/vehicleModel.js';

const addvehicle = async (req, res) => {
    try {

        const { userId, brandName, modelName, plateNumber, vinNumber, fuelType, Image } = req.body;

        const imagefile = req.file

        console.log(req.body);
console.log(req.file); 


        if (!brandName || !modelName || !plateNumber || !vinNumber || !fuelType || !imagefile)
            return res.json({ sucess: false, message: "All fields are required" })

        const imageUpload = await cloudinary.uploader.upload(imagefile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url;

        const vehicleData = {
            userId,
            brandName,
            modelName,
            plateNumber,
            vinNumber,
            fuelType,
            Image: imageUrl
        }

        console.log(vehicleData)

        const newVehicle = new vehicleModel(vehicleData)

        await newVehicle.save()

        return res.json({ success: true, message: "Vehicle added successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

const getAllVehicles = async (req, res) => {
    try {

        const allVehicles = await vehicleModel.find();

        return res.json({ success: true, allVehicles })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const getVehicle = async (req, res) => {
    try {

        const vehicleId = req.params.id;

        const vehicle = await vehicleModel.findById(vehicleId);

        return res.json({ success: true, vehicle })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


const deleteVehicle = async (req, res) => {
    try {

        const vehicleId = req.params.id;

        await vehicleModel.findByIdAndDelete(vehicleId);

        return res.json({ success: true, message: "Vehicle deleted successfully"})

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const updateVehicle = async (req, res) => {
    try {

        const vehicleId = req.params.id;
        const { brandName, modelName, plateNumber, vinNumber, fuelType } = req.body;

        console.log('req.body', req.body)
        console.log('req.file', req.file)

        const imageFile = req.file;

        if(imageFile){
           const imageUpload =  await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

              const imageUrl = imageUpload.secure_url;

              await vehicleModel.findByIdAndUpdate(vehicleId, { Image : imageUrl });

        return res.json({ success: true, message: "Vehicle Image updated successfully"})
        }

        await vehicleModel.findByIdAndUpdate(vehicleId, { brandName, modelName, plateNumber, vinNumber, fuelType });


        
  
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export { addvehicle, getAllVehicles, getVehicle, deleteVehicle, updateVehicle }