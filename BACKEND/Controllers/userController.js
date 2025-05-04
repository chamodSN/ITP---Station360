import { v2 as cloudinary } from 'cloudinary'
import vehicleModel from '../models/vehicleModel.js';
import User from '../models/userModel.js';
import { generateUserReportPDF } from '../pdf/ReportGenerator.js';
const addvehicle = async (req, res) => {
    try {
        const userId = req.userId;
        const { brandName, modelName, plateNumber, vinNumber, fuelType } = req.body;
        const imagefile = req.file;

        if (!brandName || !modelName || !plateNumber || !vinNumber || !fuelType || !imagefile) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const imageUpload = await cloudinary.uploader.upload(imagefile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const newVehicle = new vehicleModel({
            user,
            brandName,
            modelName,
            plateNumber,
            vinNumber,
            fuelType,
            Image: imageUrl
        });

        await newVehicle.save();

        return res.status(201).json({
            success: true,
            message: "Vehicle added successfully",
            vehicle: newVehicle
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error adding vehicle"
        });
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

        const vehicle = await vehicleModel.findById(vehicleId).populate('user');

        return res.json({ success: true, vehicle })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


const deleteVehicle = async (req, res) => {
    try {

        const vehicleId = req.params.id;

        await vehicleModel.findByIdAndDelete(vehicleId);

        return res.json({ success: true, message: "Vehicle deleted successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const { plateNumber } = req.body;
        const imageFile = req.file;

        const updateData = {
            plateNumber
        };

        // Upload new image if provided
        if (imageFile) {
            const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            });
            updateData.Image = uploadResult.secure_url;
        }

        const updatedVehicle = await vehicleModel.findByIdAndUpdate(vehicleId, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            vehicle: updatedVehicle
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, gender } = req.body;
        const imageFile = req.file;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await User.findByIdAndUpdate(userId, { name, phone, gender })

        // Handle image upload if new image provided
        if (imageFile) {
            const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image'
            });
            user.image = uploadedImage.secure_url;
        }

        // Save updated user
        await user.save();

        // Make sure to return the complete updated user object
        const updatedUser = await User.findById(userId).select('-password');

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error updating profile"
        });
    }
};


const getProfile = async (req, res) => {
    try {
        const user = req.user; // Get user from checkAuth middleware

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.json({
            success: false,
            message: error.message || "Error fetching profile"
        });
    }
};

const deleteProfile = async (req, res) => {
    try {
        // Get user ID from auth middleware
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No user found"
            });
        }

        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Clear authentication cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully"
        });

    } catch (error) {
        console.error("Profile deletion error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error deleting profile"
        });
    }
};

const deleteProfileByAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        // Assuming you're using Mongoose or similar
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

const getProfileByAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.json({
            success: false,
            message: error.message || "Error fetching profile"
        });
    }
};


const getMyVehicles = async (req, res) => {
    try {
        const userId = req.userId;

        const vehicles = await vehicleModel.find({ user: userId });

        return res.status(200).json({
            success: true,
            vehicles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching vehicles"
        });
    }
};

const allUsers = async (req, res) => {
    try {
        const search = req.query.search || '';
        const regex = new RegExp(search, 'i'); // case-insensitive

        const users = await User.find({
            $or: [
                { name: { $regex: regex } },
                { email: { $regex: regex } }
                // Add other fields if needed
            ]
        }).select('-password');

        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

const generateUserReport = async (req, res) => {
    const { startDate, endDate } = req.body;
    console.log("Received dates:", startDate, endDate);

    try {
        const users = await User.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });

        if (!users.length) {
            return res.status(404).json({ message: 'No users found for the given date range' });
        }

        const pdfStream = await generateUserReportPDF(users, startDate, endDate);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=user_report.pdf');
        pdfStream.pipe(res);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export { addvehicle, getAllVehicles, getVehicle, deleteVehicle, updateVehicle, updateProfile, getProfile, deleteProfile, getMyVehicles, allUsers, deleteProfileByAdmin, getProfileByAdmin, generateUserReport }