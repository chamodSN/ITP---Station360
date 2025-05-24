import { v2 as cloudinary } from 'cloudinary';
import serviceModel from '../models/serviceModel.js';

const addService = async (req, res) => {
    try {

        const { serviceName, category, displayImage, description, specificationsString, price, available, interval } = req.body

        const imageFile = req.file

        const isAvailableBoolean = JSON.parse(available)

        if (!serviceName || !category || !description || !specificationsString || !price || !imageFile || !interval) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })

        const imageUrl = imageUpload.secure_url;

        const seperated = specificationsString.split(",");

        let timeSlots = [];

        const startTime = 9.00 * 60;
        const endTime = 17.00 * 60;
        let timeStapm = startTime;

        while (timeStapm < endTime) {
            let hours = Math.floor(timeStapm / 60);
            let minutes = timeStapm % 60;

            let formattedTime = `${hours}.${minutes.toString().padStart(2, '0')}`;
            timeSlots.push(formattedTime);

            timeStapm += Number(interval);
        }

        const serviceData = {
            serviceName,
            category,
            displayImage: imageUrl,
            description,
            specifications: seperated,
            price: parseInt(price),
            available: isAvailableBoolean,
            interval: parseInt(interval),
            timeSlots: timeSlots,
        }

        const newService = new serviceModel(serviceData)

        await newService.save()

        return res.json({ success: true, message: "Service added successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const displayAllServices = async (req, res) => {
    try {

        const allServices = await serviceModel.find().select('-bookedSlots');

        if (allServices.length === 0) {
            return res.json({ success: false, message: "No services found" })
        }

        return res.json({ success: true, allServices })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


const displaySingleServices = async (req, res) => {
    try {

        let serviceId = req.params.serviceId;

        const service = await serviceModel.findById(serviceId).select('-bookedSlots');

        if (!service) {
            return res.json({ success: false, message: "Selected Service Cannot be Found" })
        }

        return res.json({ success: true, service })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const updateService = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("File received:", req.file);

        const serviceId = req.params.serviceId;
        const { serviceName, category, description, specificationsString, price, available, interval } = req.body;
        const imageFile = req.file;

        // Validation
        if (!serviceName || !category || !description || !specificationsString || !price || !available || !interval) {
            return res.json({ success: false, message: "All fields are required" });
        }

        let service = await serviceModel.findById(serviceId);
        if (!service) {
            return res.json({ success: false, message: "Service not found" });
        }

        // Generate time slots using dot format (e.g., 9.30)
        const startTime = 9 * 60;
        const endTime = 17 * 60;
        let timeStapm = startTime;
        let timeSlots = [];

        while (timeStapm < endTime) {
            let hours = Math.floor(timeStapm / 60);
            let minutes = timeStapm % 60;
            let formattedTime = `${hours}.${minutes.toString().padStart(2, '0')}`;
            timeSlots.push(formattedTime);
            timeStapm += Number(interval);
        }

        const specifications = specificationsString.split(",");

        const updateData = {
            serviceName,
            category,
            description,
            specifications,
            price,
            available,
            interval,
            timeSlots
        };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.displayImage = imageUpload.secure_url;
        }

        await serviceModel.findByIdAndUpdate(serviceId, updateData);

        const updateMessage = imageFile
            ? "Service and image updated successfully."
            : "Service updated successfully.";

        return res.json({ success: true, message: updateMessage });

    } catch (error) {
        console.error("Error updating service:", error.message);
        return res.json({ success: false, message: error.message });
    }
};


const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.serviceId;

        let service = await serviceModel.findById(serviceId);

        if (!service) {
            return res.json({ success: false, message: "Service not found" });
        }

        await serviceModel.findByIdAndDelete(serviceId);

        return res.json({ success: true, message: "Service deleted successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

const searchServices = async (req, res) => {
    try {
        const search = req.query.search || '';
        const regex = new RegExp(search, 'i'); // case-insensitive search

        const services = await serviceModel.find({
            $or: [
                { serviceName: { $regex: regex } },
                { category: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        }).select('-bookedSlots');

        if (services.length === 0) {
            return res.json({ success: false, message: "No matching services found" });
        }

        return res.json({ success: true, services });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export { addService, displayAllServices, displaySingleServices, updateService, deleteService, searchServices }