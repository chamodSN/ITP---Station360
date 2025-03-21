import { v2 as cloudinary } from 'cloudinary';
import serviceModel from '../models/serviceModel.js';

const addService = async (req, res) => {
    try {

        const { serviceName, displayImage, description, specificationsString, price, available, isBookable, interval } = req.body

        const imageFile = req.file

        if (!serviceName || !description || !specificationsString || !price || !available || !isBookable || !interval || !imageFile) {
            return res.json({ success: false, message: "All fields are required" })
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })

        const imageUrl = imageUpload.secure_url;

        const seperated = specificationsString.split(",");

        const startTime = 9.00 * 60;
        const endTime = 17.00 * 60;
        let timeStapm = startTime;

        const timeSlots = [];

        while (timeStapm < endTime) {
            let hours = Math.floor(timeStapm / 60);
            let minutes = timeStapm % 60;

            let formattedTime = `${hours}.${minutes.toString().padStart(2, '0')}`;
            timeSlots.push(formattedTime);

            timeStapm += Number(interval);
        }

        const serviceData = {
            serviceName,
            displayImage: imageUrl,
            description,
            specifications: seperated,
            price,
            available,
            isBookable,
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

        const allServices = await serviceModel.find().select('displayImage serviceName available');

        if (!allServices) {
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

        const service = await serviceModel.findById(serviceId).select('-interval -timeSlots -bookedSlots');

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

        const serviceId = req.params.serviceId;
        const { serviceName, description, specificationsString, price, available, isBookable, interval } = req.body;
        const imageFile = req.file;

        if (!serviceName || !description || !specificationsString || !price || !available || !isBookable) {
            return res.json({ success: false, message: "All fields are required" })
        }

        let service = await serviceModel.findById(serviceId);

        if (!service) {
            return res.json({ success: false, message: "Service not found" });
        }

        let timeSlots = service.timeSlots;

        if (interval) {
            const startTime = 9.00 * 60;
            const endTime = 17.00 * 60;
            let timeStapm = startTime;

            timeSlots = []; // Clear existing timeSlots

            while (timeStapm < endTime) {
                let hours = Math.floor(timeStapm / 60);
                let minutes = timeStapm % 60;
                let formattedTime = `${hours}.${minutes.toString().padStart(2, '0')}`;
                timeSlots.push(formattedTime);
                timeStapm += Number(interval);
            }
            await serviceModel.findByIdAndUpdate(serviceId, { interval: interval })
            await serviceModel.findByIdAndUpdate(serviceId, { timeSlots: timeSlots })
        }

        const seperated = specificationsString.split(",");

        await serviceModel.findByIdAndUpdate(serviceId, { serviceName, description, specifications:seperated, price, available, isBookable })

        let updateMessage = "Service updated successfully.";

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })

            const imageUrl = imageUpload.secure_url;

            await serviceModel.findByIdAndUpdate(serviceId, { displayImage: imageUrl })

            updateMessage = "Service and image updated successfully.";

        }

        return res.json({ success: true, message: updateMessage });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

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

export { addService, displayAllServices, displaySingleServices, updateService, deleteService }